const SKY_MIDNIGHT = [41, 20, 100];
const SKY_DAWN = [255, 149, 145];
const SKY_DAY = [255, 255, 230];
const SKY_DUSK = [255, 177, 33];

const SUN_COLOR = "#ffc400";

function draw(c, w, h, t) {
	drawSky(c, w, h, t);
	drawSun(c, w, h, t);
	//drawForeground(c, w, h, t);
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
	let g = c.createRadialGradient(sunX, sunY, size / 2, sunX, sunY, size);
	g.addColorStop(0, SUN_COLOR);
	g.addColorStop(1, "rgba(255, 196, 0, 0)");
	c.fillStyle = g;


	c.arc(sunX, sunY, size, 0, 2 * Math.PI, false);
	c.fill();

	// c.fillStyle = "#000";
	// c.textAlign = "center";
	// c.font = "14px Work Sans";
	// c.textBaseline = "middle";
	// c.fillText(date.toLocaleTimeString("en-NL"), sunX, sunY);
}

function drawSky(c, w, h, t) {
	let g = c.createLinearGradient(0, 0, 0, h);
	let skyColor = getSkyColor(t);
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

function drawForeground(c, w, h, t) {
	c.fillStyle = "#006911";
	c.fillRect(0, h - 0.05 * h, w, 0.05 * h);
}

function updateObjects(c, dt) {
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
