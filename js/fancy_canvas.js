const canvas = document.querySelector(".background_canvas");
const c = canvas.getContext("2d");

function resizeCanvas() {
	c.canvas.width = window.innerWidth;
	c.canvas.height = window.innerHeight;
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
resizeCanvas();
window.addEventListener("resize", resizeCanvas, false);
window.setInterval(updateCanvas, 1000);
