function draw(c, w, h, t) {
	drawSky(c, w, h, t);
	drawSun(c, w, h, t);
	drawForeground(c, w, h, t);
}

function drawSun(c, w, h, t) {
	let date = new Date();
	let theta = t * 2 * Math.PI + Math.PI - (Math.PI / 2);
	let rX = 0.95 * (w / 2);
	let rY = 0.95 * (h / 2);
	let size = 0.05 * ((w + h) / 2);
	let sunX = rX * Math.cos(theta) + (w / 2);
	let sunY = rY * Math.sin(theta) + (0.95 * h);
	if (sunY + size / 2 > h) {
		return;
	}
	c.fillStyle = "#ffc400";
	c.beginPath();
	c.arc(sunX, sunY, size, 0, 2 * Math.PI, false);
	c.fill();

	c.fillStyle = "#000";
	c.textAlign = "center";
	c.font = "14px Work Sans";
	c.textBaseline = "middle";
	c.fillText(date.toLocaleTimeString("en-NL"), sunX, sunY);
}

function drawSky(c, w, h, t) {
	let g = c.createLinearGradient(0, 0, 0, h);
	g.addColorStop(1, "#87CEEB");
	g.addColorStop(0, "#EEE");
	c.fillStyle = g;
	c.fillRect(0, 0, w, h);
}

function drawTree(c, x, y) {
	c.fillStyle = "#3d2200";
	c.fillRect(x, y, 10, 50);
	c.fillStyle = "#c2ff1c";
	c.beginPath();
	c.arc(x + 5, y - 25, 50, 0, 2 * Math.PI, false);
	c.fill();
}

function drawForeground(c, w, h, t) {
	c.fillStyle = "#006911";
	c.fillRect(0, h - 0.05 * h, w, 0.05 * h);
	drawTree(c, 100, h - 90);
}
