var path = require("path");
var fs = require("fs");
var yargs = require("yargs");
var postHTML = require("posthtml");
var postHTML_transform = require("posthtml-transform");
var svgo = require("svgo");

var SVGO = new svgo(require("../config/svgo.json"));
var colorsJSON = require("../source/colors/colors.json");

var { terracotta: colorPrimary, clairvoyant: colorBackground } = colorsJSON;
var attributesToFill = [
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
		value: colorPrimary,
		selector: "#shadow_color",
	},
	{
		attr: "flood-opacity",
		value: colorsJSON.shadowOpacity,
		selector: "#shadow_color",
	},
];

function buildSVG(filePath) {
	const buildPath = path.join(".", "build");

	console.info(`Building a new SVG output from "${filePath}" ...`);

	return postHTML()
		.use(postHTML_transform(attributesToFill))
		.process(fs.readFileSync(path.resolve(".", filePath)))
		.then(async function writeOutput({ html: newSVG }) {
			console.log("Optimizing the changes with SVGO...");
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
