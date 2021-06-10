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
		const outputDir = join(cwd(), "./dist/png");

		if (!existsSync(outputDir)) {
			mkdirSync(outputDir);
		}

		const total = context.files.length;
		let progress = 0;

		for (const logoFile of context.files) {
			progress += 1;

			const baseFileName = basename(logoFile, ".svg");
			const svgFilePath = join(cwd(), "dist/svg", logoFile);
			const pngOutputPath = join(outputDir, `${baseFileName}.png`);

			await exportToPNG(svgFilePath, pngOutputPath);
			task.output = `[${progress}/${total}] Saved as PNG: ${info(`file://${pngOutputPath}`)}`;
		}

		task.title += `${success("done")}.`;
		task.output = `Saved all logo file(s) as PNG to directory: ${
			info(`file://${outputDir}`)
		}.`;
	},
	options: {
		persistentOutput: true,
	},
};
