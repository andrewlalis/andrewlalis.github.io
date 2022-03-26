const canvas = document.querySelector(".background_canvas");
const c = canvas.getContext("2d");

function resizeCanvas() {
	c.canvas.width = window.innerWidth;
	c.canvas.height = document.documentElement.scrollHeight;
	var body = document.body, html = document.documentElement;
	c.canvas.height = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
	updateCanvas();
}

function updateCanvas() {
	let w = c.canvas.width;
	let h = c.canvas.height;
	let date = new Date();
	let secondsInADay = 60 * 60 * 24;
	let secondsPassed = date.getHours() * 60 * 60 + date.getMinutes() * 60 + date.getSeconds();
	let t = secondsPassed / secondsInADay;
	c.clearRect(0, 0, w, h);
	draw(c, w, h, t);
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
	let now = Date.now();
	updateObjects(c, c.canvas.width, c.canvas.height, (now - lastUpdate) / 1000);
	updateCanvas();
	lastUpdate = now;
}, 100);
