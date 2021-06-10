import { join } from "path";

import type { ListrTask } from "listr2";
import type { ContextExport } from "../../commands/export";

// TODO: Import it from Listr2/Enquirer?
interface Choices {
	name: string,
	value: string,
	selected: boolean,
}

export const chooseLogoFiles: ListrTask = {
	title: "Choosing the SVG logo files to export...",
	task: async (context: ContextExport, task) => {
		context.files = await task.prompt({
			type: "multiselect",
			name: "files",
			message: "Which logo files do you want to export?",
			choices: [
				...context.files.map((fileName) => {
					return {
						name: fileName,
						value: join(process.cwd(), "./dist/svg", fileName),
					};
				}),
			],
			validate: (choices: Choices[]) => {
				const selectedFiles = choices.map(({ selected }) => selected);

				if (selectedFiles.length > 0) {
					return true;
				} else {
					return "Select at least one logo file to continue!";
				}
			}
		});
	},
};
