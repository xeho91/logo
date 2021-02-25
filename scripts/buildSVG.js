var path = require("path");
var fs = require("fs");
var postHTML = require("posthtml");
var postHTML_transform = require("posthtml-transform");
var svgo = require("svgo");
var yargs = require("yargs");

var SVGO = new svgo(require("../config/svgo.json"));

var colorsJSON = require("../source/colors/colors.json");

const colorPrimary = colorsJSON.terracotta.HSLA;
const colorBackground = colorsJSON.clairvoyant.HSLA;
const shadowColor = colorsJSON.shadow.color;
const shadowOpacity = colorsJSON.shadow.opacity;
const animationDuration = "0.2s";

function buildSVG(filePath) {
	const buildPath = path.join(".", "build");

	console.info(`Building a new SVG output from "${filePath}" ...`);

	return postHTML()
		.use(
			postHTML_transform([
				{
					attr: "fill",
					value: colorBackground,
					selector: "#logo_background",
				},
				{
					attr: "fill",
					value: colorPrimary,
					selector: "#logo_logomark",
				},
				{
					attr: "stop-color",
					value: colorPrimary,
					selector: ".gradient-color",
				},
				{
					attr: "flood-color",
					value: shadowColor,
					selector: "#shadow_color",
				},
				{
					attr: "flood-opacity",
					value: shadowOpacity,
					selector: "#shadow_color",
				},
				{
					attr: "dur",
					value: animationDuration,
					selector: ".character-animation",
				},
			])
		)
		.process(fs.readFileSync(path.resolve(".", filePath)))
		.then(async function writeOutput({ html: newSVG }) {
			console.log("Optimizing the new build with SVGO...");
			const optimizedSVG = (await SVGO.optimize(newSVG)).data;

			console.log(`Saving it into the "./${buildPath}/" directory.`);
			return fs.writeFileSync(
				`${buildPath}/${path.basename(filePath, ".svg")}.min.svg`,
				optimizedSVG
			);
		});
}

module.exports = buildSVG;

// Allow using from CLI quickly
const pathFromCLI = yargs.argv._[0];

if (pathFromCLI) {
	buildSVG(pathFromCLI);
}
