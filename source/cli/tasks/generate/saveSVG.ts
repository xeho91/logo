import { outputFileSync } from "fs-extra";
import { join } from "path";
import { error, info, success } from "../../utils/log";

import type { ListrTask } from "listr2";
import type { ContextGenerate } from "../../commands/generate";

export const saveSVG: ListrTask = {
	title: "Saving the output... ",
	task: async (context: ContextGenerate, task) => {
		let { flags: { output } } = context;
		if (!output) {
			output = await task.prompt([{
				type: "input",
				name: "outputPath",
				message: "Where do you want to save the SVG output?",
				initial: "./dist/svg",
				default: "./dist/svg",
			}]);
		}

		const outputDirPath = join(process.cwd(), output);

		if (context.outputs) {
			context.outputs.forEach(({ svg, fileName }) => {
				const outputFilePath = join(outputDirPath, fileName);

				outputFileSync(outputFilePath, svg);
			});
			task.title += `${success("done")}.`;
		} else {
			task.title += `${error("failed")}!`;
			throw new Error(error("Outputs are empty!"));
		}

		task.output = `Saved logo SVG files to: ${
			info(`file://${outputDirPath}`)
		}`;
	},
	options: {
		persistentOutput: true,
	},
};
