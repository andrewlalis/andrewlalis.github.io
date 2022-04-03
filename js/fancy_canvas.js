const canvas = document.querySelector(".background_canvas");
/**
 * @param {CanvasRenderingContext2D}
 */
const c = canvas.getContext("2d");

function resizeCanvas() {
	c.canvas.width = window.innerWidth;
	c.canvas.height = document.documentElement.scrollHeight;
	const body = document.body, html = document.documentElement;
	c.canvas.height = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
	updateCanvas();
}

function updateCanvas() {
	const w = c.canvas.width;
	const h = c.canvas.height;
	const date = new Date();
	const millisecondsInADay = 60 * 60 * 24 * 1000;
	const millisecondsPassed = date.getHours() * 60 * 60 * 1000 + date.getMinutes() * 60 * 1000 + date.getSeconds() * 1000 + date.getMilliseconds();
	const t = millisecondsPassed / millisecondsInADay;
	c.clearRect(0, 0, w, h);
	const tTest = (date.getSeconds() * 1000 + date.getMilliseconds()) / (1000 * 60);
	draw(c, w, h, tTest);
}

if (typeof draw === "undefined") {
	throw new Error("Undefined draw method. Please add a script which implements draw(ctx, w, h, t).");
}
if (typeof updateObjects === "undefined") {
	throw new Error("Undefined updateObjects method. Please add a script which implements updateObjects(ctx, w, h, dt).");
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas, false);
let lastUpdate = Date.now();
window.setInterval(() => {
	const now = Date.now();
	updateObjects(c, c.canvas.width, c.canvas.height, (now - lastUpdate) / 1000.0);
	updateCanvas();
	lastUpdate = now;
}, 30);
