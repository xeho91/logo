var path = require("path");
var fs = require("fs");
var postHTML = require("posthtml");
var postHTML_transform = require("posthtml-transform");
var yargs = require("yargs");

var colorsJSON = require("@xeho91/colors/colors.json");

const colorPrimary = colorsJSON.terracotta.HSLA;
const colorBackground = colorsJSON.clairvoyant.HSLA;
const shadowColor = colorsJSON.shadow.color;
const shadowOpacity = colorsJSON.shadow.opacity;
const animationDuration = "0.2s";

function buildSVG(filePath) {
	const buildPath = path.join(".", "build");

	console.info(`Building a new SVG output from "${filePath}"...`);

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
			const outputPath = `${buildPath}/${path.basename(filePath)}`;

			console.log(`Saving it into path: "${outputPath}".`);
			return fs.writeFileSync(outputPath, newSVG);
		});
}

module.exports = buildSVG;

// Allow using from CLI quickly
const pathsFromCLI = yargs.argv._;


if (pathsFromCLI) {
	for (const filePath of pathsFromCLI) {
		buildSVG(filePath);
	}
}
