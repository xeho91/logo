import { Command, flags } from "@oclif/command";
import { outputFile } from "fs-extra";
import { join } from "path";
import * as prompts from "prompts";
import { loadConfig as loadSVGOconfig, optimize } from "svgo";

export default class Generate extends Command {
	static description = "Generate a SVG file for logo.";

	static usage = "generate --output ./dist/xeho91-logo.svg";

	static flags = ({
		help: flags.help({ char: "h" }),
		version: flags.version({ char: "v" }),
		output: flags.string({
			char: "o",
			description: "Specify the output file path.",
		}),
	});

	async run() {
		const { flags } = this.parse(Generate);
		const questions: prompts.PromptObject[] = [
			{
				type: "confirm",
				name: "withColors",
				message: "Generate with colors?",
				initial: true,
			},
			{
				type: "confirm",
				name: "reverseColors",
				message: "Reverse the colors?",
				initial: false,
			},
			{
				type: "confirm",
				name: "withBackground",
				message: "Generate with Background?",
				initial: true,
			},
			{
				type: (_, { withBackground }) => {
					return withBackground ? "select" : null;
				},
				name: "backgroundType",
				message: "Specify the background type",
				choices: [
					{
						title: "Normal",
						description: "one color",
						value: "normal",
					},
					{
						title: "Gradient",
						description: "colored",
						value: "gradient",
					},
				],
				initial: 1,
			},
			{
				type: "confirm",
				name: "withAnimations",
				message: "Generate with animations?",
				initial: true,
			},
			{
				type: () => {
					return flags.output ? null : "text";
				},
				name: "output",
				message: "Where do you want to save the generated output?",
				initial: "./dist/xeho91-logo.svg",
			},
		];
		const response = await prompts.prompt(questions);

		let output: string;
		const { cwd } = process;
		const outputPath = join(cwd(), flags.output ?? response.output);

		function generateSVG() {
			require("svelte/register");

			const Logo = require("../../logo/Logo.svelte").default;
			const { html } = Logo.render(response);

			output = html;
		}

		async function optimizeSVG() {
			const config = await loadSVGOconfig(
				join(cwd(), "./svgo.config.js"),
			);

			const optimized = optimize(output, config);

			output = optimized.data;
		}

		const Listr = require("listr");

		const tasks = new Listr([
			{
				title: "Generating SVG output from Svelte component...",
				task: () => generateSVG(),
			},
			{
				title: "Optimizing the SVG output with SVGO...",
				task: () => optimizeSVG(),
			},
			{
				title: `Saving the SVG output to file (${outputPath})...`,
				task: async () => outputFile(outputPath, output),
			},
			{
				title: "Done!",
				task: () => true,
			},
		]);

		return tasks.run();
	}
}
