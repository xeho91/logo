import { readdirSync } from "fs";
import { join } from "path";
import { error, info, success } from "../../utils/log";

import type { ListrTask } from "listr2";
import type { ContextExport } from "../../commands/export";

const { cwd } = process;

export const checkForFiles: ListrTask = {
	title: "Checking if there are generated logo files... ",
	task: async (context: ContextExport, task) => {
		const { flags } = context;

		let inputDirPath;

		if (!flags.input) {
			inputDirPath = await task.prompt([{
				type: "input",
				message: "From which directory with SVG files do you want to export as PNG format?",
				name: "input",
				initial: "./dist/svg",
			}]);

			inputDirPath = join(cwd(), inputDirPath);
		} else {
			inputDirPath = join(cwd(), flags.input);
		}

		task.output = `Input directory: ${info(`file://${inputDirPath}`)}`;
		context.files = readdirSync(inputDirPath).filter((file) => file.endsWith(".svg"));

		if (context.files.length > 0) {
			task.title += success("ok.");
		} else {
			task.title += error("no SVG files!");
			task.output = `Generate the logo SVG files firstly with a command "${
				info("generate")
			}".`;
			throw new Error(
				error("There's nothing to export, process aborted."),
			);
		}
	},
	options: {
		persistentOutput: true,
		showErrorMessage: false,
		collapse: false,
	},
};
