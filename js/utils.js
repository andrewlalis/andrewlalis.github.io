/* Utility methods */
function randRange(min, max) {
	return Math.random() * (max - min) + min;
}

function randIntRange(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min) + min);
}

/**
 * Adds a removeIf method to arrays based on a boolean callback.
 * @param {function} callback
 */
Array.prototype.removeIf = function(callback) {
	let i = this.length;
	while (i--) {
		if (callback(this[i], i)) {
			this.splice(i, 1);
		}
	}
};
