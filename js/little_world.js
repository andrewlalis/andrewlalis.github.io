const SKY_MIDNIGHT = [20, 5, 50];
const SKY_DAWN = [255, 149, 145];
const SKY_DAY = [255, 255, 230];
const SKY_DUSK = [255, 177, 33];

const SUN_COLOR = "#ffc400";

const WIND_SPEED = 0.001 * randRange(-1, 1);
const CLOUD_SPAWN_CHANCE = Math.abs(WIND_SPEED) * randRange(10, 75);
const LIGHTNING_SPAWN_CHANCE = CLOUD_SPAWN_CHANCE / 100;
const CLOUD_BASE_BRIGHTNESS = randRange(0.5, 1);
const STORM_CLOUD_THRESHOLD = 0.6;
const MIN_CLOUD_PARTS = 3;
const MAX_CLOUD_PARTS = 12;

class CloudPart {
	/**
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} width
	 * @param {Number} height
	 * @param {Number} fluffiness
	 * @param {Number} brightness
	 */
	constructor(x, y, width, height, fluffiness, brightness) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.fluffiness = fluffiness;
		this.brightness = brightness;
	}
}

class Cloud {
	/**
	 * @param {Number} x
	 * @param {Number} y
	 * @param {CloudPart[]} parts
	 */
	constructor(x, y, parts) {
		this.x = x;
		this.y = y;
		this.parts = parts;
		this.minX = Math.min.apply(null, this.parts.map(part => part.x));
		this.maxX = Math.max.apply(null, this.parts.map(part => part.x + part.width));
		this.minY = Math.min.apply(null, this.parts.map(part => part.y));
		this.maxY = Math.max.apply(null, this.parts.map(part => part.y + part.height));
		this.width = this.maxX - this.minX;
		this.height = this.maxY - this.minY;
		this.avgBrightness = this.parts.map(part => part.brightness).reduce((a, b) => a + b, 0) / this.parts.length;
	}
}

/**
 * The list of clouds to render.
 * @type {Cloud[]}
 */
let clouds = [];

for (let i = 0; i < 10; i++) {
	spawnCloud(randRange(0.05, 0.95));
}

class Lightning {
	constructor(points, thickness, lifetime) {
		this.points = points;
		this.createdAt = Date.now();
		this.thickness = thickness;
		this.lifetime = lifetime;
	}
}

const lightnings = [];

/**
 * Draws the world on the given rendering context, using the given width, height and current time.
 * @param {CanvasRenderingContext2D} c
 * @param {Number} w
 * @param {Number} h
 * @param {Number} t
 */
function draw(c, w, h, t) {
	drawSky(c, w, h, t);
	drawSun(c, w, h, t);
	drawClouds(c, w, h, t);
}

function drawSun(c, w, h, t) {
	let theta = t * 2 * Math.PI + (Math.PI / 2);
	let rX = 0.95 * (w / 2);
	let rY = 0.90 * (h);
	let size = 0.05 * ((w + h) / 2);
	let sunX = rX * Math.cos(theta) + (w / 2);
	let sunY = rY * Math.sin(theta) + (0.95 * h);
	if (sunY - size > h) {
		return;
	}

	c.beginPath();
	const pulseFactor = Math.cos(2 * Math.PI * t * 10000) * 5 + 5;
	let g = c.createRadialGradient(sunX, sunY, size / 2, sunX, sunY, size - pulseFactor);
	g.addColorStop(0, SUN_COLOR);
	g.addColorStop(1, "rgba(255, 196, 0, 0)");
	c.fillStyle = g;
	c.arc(sunX, sunY, size, 0, 2 * Math.PI, false);
	c.fill();

	if (t >= 0.2 && t <= 0.8) {
		drawGodRays(t, sunX, sunY, w, h);
	}
}

function drawGodRays(t, sunX, sunY, w, h) {
	const dayT = (t - 0.25) * 2;
	const godRayBrightness = Math.pow((Math.cos(dayT * 2 * Math.PI) + 1) / 2, 2) * 0.25;
	if (godRayBrightness > 0.01) {
		c.fillStyle = `rgba(255, 196, 0, ${godRayBrightness})`;
		const slices = 32;
		const sliceSizeRad = 2 * Math.PI / slices;
		const screenDiagonalLength = Math.sqrt(w * w + h * h);
		const R = 2 * Math.PI * (dayT * 100);
		for (let i = 0; i < slices; i++) {
			if (i % 2 !== 0) continue;
			const angleStart = sliceSizeRad * i + R;
			const angleEnd = angleStart + sliceSizeRad;
			const startX = sunX + screenDiagonalLength * Math.cos(angleStart);
			const startY = sunY + screenDiagonalLength * Math.sin(angleStart);
			const endX = sunX + screenDiagonalLength * Math.cos(angleEnd);
			const endY = sunY + screenDiagonalLength * Math.sin(angleEnd);
			c.beginPath();
			c.moveTo(sunX, sunY);
			c.lineTo(startX, startY);
			c.lineTo(endX, endY);
			c.fill();
		}
	}
}

function drawSky(c, w, h, t) {
	let g = c.createLinearGradient(0, 0, 0, h);
	let skyColor = getSkyColor(t);
	if (lightnings.length > 0) {
		skyColor = interpolateColor(skyColor, [255, 255, 255], 0.5, 0, 1);
	}
	if (skyColor[0] < 128) {
		document.documentElement.style.setProperty("--textColor", "#EEE");
	} else {
		document.documentElement.style.setProperty("--textColor", "#222");
	}
	g.addColorStop(1, "#87CEEB");
	g.addColorStop(0, "rgb(" + skyColor[0] + ", " + skyColor[1] + ", " + skyColor[2] + ")");
	c.fillStyle = g;
	c.fillRect(0, 0, w, h);
}

function drawClouds(c, w, h, t) {
	c.strokeStyle = "#fff";
	lightnings.forEach(lightning => {
		c.lineWidth = lightning.thickness;
		c.beginPath();
		c.moveTo(lightning.points[0].x, lightning.points[0].y);
		for (let i = 1; i < lightning.points.length; i++) {
			c.lineTo(lightning.points[i].x, lightning.points[i].y);
		}
		c.stroke();
	});
	clouds.forEach(cloud => {
		cloud.parts.forEach(part => {
			const x = (cloud.x + part.x) * w;
			const y = (cloud.y + part.y) * h;
			const width = part.width * w;
			const height = part.height * h;
			let txOriginal = c.getTransform();
			c.beginPath();
			c.transform(width, 0, 0, height, x, y);
			let g = c.createRadialGradient(0, 0, 1 - part.fluffiness, 0, 0, 1);
			const colorRgb = 255 * part.brightness;
			g.addColorStop(0, `rgba(${colorRgb}, ${colorRgb}, ${colorRgb}, 255)`);
			g.addColorStop(1, `rgba(${colorRgb}, ${colorRgb}, ${colorRgb}, 0)`);
			c.fillStyle = g;
			c.arc(0, 0, 1, 0, 2 * Math.PI, false);
			c.fill();
			c.resetTransform();
		});
	});
}

/**
 * Updates any objects in this scene.
 * @param {CanvasRenderingContext2D} c
 * @param {Number} w
 * @param {Number} h
 * @param {Number} dt
 */
function updateObjects(c, w, h, dt) {
	clouds.forEach(cloud => {
		cloud.x += WIND_SPEED * (1 + 2 * cloud.y);
		if (cloud.avgBrightness < STORM_CLOUD_THRESHOLD && Math.random() < LIGHTNING_SPAWN_CHANCE) {
			spawnLightning(cloud, w, h);
		}
	});
	const now = Date.now();
	lightnings.removeIf(l => now - l.createdAt > l.lifetime);
	if (WIND_SPEED > 0) {
		clouds.removeIf(cloud => cloud.x - cloud.width > 1);
	} else {
		clouds.removeIf(cloud => cloud.x + cloud.width < 0);
	}
	if (Math.random() < CLOUD_SPAWN_CHANCE) {
		spawnCloud();
	}
}

function spawnCloud(cloudX = undefined) {
	const parts = [];
	const partCount = randIntRange(MIN_CLOUD_PARTS, MAX_CLOUD_PARTS);
	const SPREAD = 0.005 * partCount;
	while (parts.length < partCount) {
		const width = randRange(0.01, 0.1);
		const height = randRange(0.01, width);
		const x = randRange(0, SPREAD);
		const y = randRange(0, SPREAD);
		const partBrightness = Math.min(1, CLOUD_BASE_BRIGHTNESS + randRange(-0.1, 0.1));
		parts.push(new CloudPart(x, y, width, height, randRange(0.75, 1), partBrightness));
	}
	const cloud = new Cloud(cloudX, randRange(0, 0.75), parts);
	if (cloud.x === undefined) cloud.x = WIND_SPEED > 0 ? -cloud.width : 1 + cloud.width;
	clouds.push(cloud);
}

function spawnLightning(cloud, w, h) {
	const start = new Point(
		cloud.x * w + cloud.width / 2,
		cloud.y * h + cloud.height / 2
	);
	let done = false;
	const points = [start];
	let lastPoint = start;
	while (!done && points.length < 25) {
		const length = randRange(5, 250);
		const angle = randRange(-Math.PI / 6, 7 * Math.PI / 6);
		const p = new Point(
			lastPoint.x + length * Math.cos(angle),
			lastPoint.y + length * Math.sin(angle)
		);
		points.push(p);
		lastPoint = p;
		if (p.x < 0 || p.x > w || p.y < 0 || p.y > h) {
			done = true;
		}
	}
	lightnings.push(new Lightning(points, randRange(1, 10), randRange(10, 200)));
}

function getSkyColor(t) {
	if (t >= 0.35 && t < 0.65) {
		return SKY_DAY;
	} else if (t >= 0.85 || t < 0.15) {
		return SKY_MIDNIGHT;
	} else if (t >= 0.15 && t < 0.25) {
		return interpolateColor(SKY_MIDNIGHT, SKY_DAWN, t, 0.15, 0.25);
	} else if (t >= 0.25 && t < 0.35) {
		return interpolateColor(SKY_DAWN, SKY_DAY, t, 0.25, 0.35);
	} else if (t >= 0.65 && t < 0.75) {
		return interpolateColor(SKY_DAY, SKY_DUSK, t, 0.65, 0.75)
	} else if (t >= 0.75 && t < 0.85) {
		return interpolateColor(SKY_DUSK, SKY_MIDNIGHT, t, 0.75, 0.85);
	}
	return [0, 0, 0];
}

function interpolateColor(c1, c2, t, start, stop) {
	let factor = (t - start) / (stop - start);
	let result = c1.slice();
	for (let i = 0; i < 3; i++) {
		result[i] = Math.round(result[i] + factor * (c2[i] - c1[i]));
	}
	return result;
}
