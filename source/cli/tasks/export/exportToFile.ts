import { existsSync, mkdirSync } from "fs";
import { basename, join } from "path";
import * as svgexport from "svgexport";
import { info, success } from "../../utils/log";

import type { ListrTask } from "listr2";
import type { ContextExport } from "../../commands/export";

const { cwd } = process;

async function exportToPNG(input: string, output: string) {
	try {
		await svgexport.render({ input, output });
	} catch (error) {
		throw new Error(error);
	}

	return `Saved as PNG file: ${info(`file://${output}`)}`;
}

export const exportToFile: ListrTask = {
	title: "Exporting the selected SVG logo file(s) to PNG format... ",
	task: async (context: ContextExport, task) => {
		const { flags } = context;

		let outputDirPath;

		if (!flags.output) {
			outputDirPath = await task.prompt([{
				type: "input",
				message: "Where do you want to save the output?",
				name: "outputDirPath",
				initial: "./dist/png",
			}]);

			outputDirPath = join(cwd(), outputDirPath);
		} else {
			outputDirPath = join(cwd(), flags.output);
		}

		if (!existsSync(outputDirPath)) {
			mkdirSync(outputDirPath);
		}

		const total = context.files.length;
		let progress = 0;

		for (const logoFile of context.files) {
			progress += 1;

			const baseFileName = basename(logoFile, ".svg");
			const svgFilePath = join(cwd(), "dist/svg", logoFile);
			const pngOutputPath = join(outputDirPath, `${baseFileName}.png`);

			await exportToPNG(svgFilePath, pngOutputPath);
			task.output = `[${progress}/${total}] Saved as PNG: ${info(`file://${pngOutputPath}`)}`;
		}

		task.title += `${success("done")}.`;
		task.output = `Saved all logo file(s) as PNG to directory: ${
			info(`file://${outputDirPath}`)
		}.`;
	},
	options: {
		persistentOutput: true,
	},
};
