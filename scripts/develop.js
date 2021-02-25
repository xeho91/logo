// NOTE:
// I left this script as example to remind myself why `fs.watch()` is unstable.
// It fires three times, on Windows 10
var path = require("path");
var fs = require("fs");

var buildSVG = require("./buildSVG.js");

const directoryToWatch = path.resolve(".", "source");

console.log(`Watching files in "${directoryToWatch}" for changes...`);
fs.watch(directoryToWatch, function watcher(eventType, filename) {
	if (eventType === "change") {
		console.log(`File "${filename}" has changed!`);
		buildSVG(filename);
	}
});
