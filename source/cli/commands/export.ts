import { Command, flags } from "@oclif/command";
import { Listr } from "listr2";
import { checkForFiles } from "../tasks/export/checkForFiles";
import { chooseLogoFiles } from "../tasks/export/chooseLogoFiles";
import { exportToFile } from "../tasks/export/exportToFile";

import type { OutputFlags } from "@oclif/parser";

export interface ContextExport {
	flags: OutputFlags<typeof Export.flags>;
	isFilesGenerated: boolean;
	files: string[];
}

export default class Export extends Command {
	static description =
		"Convert a logo(s) to one of raster file formats (PNG, AVIF)";

	static usage = "export --output ./dist/png/xeho91-logo.png";

	static flags = ({
		input: flags.string({
			char: "i",
			description: "Specify the input directory path.",
		}),
		output: flags.string({
			char: "o",
			description: "Specify the output directory path.",
		}),
	});

	async run(): Promise<void> {
		const { flags } = this.parse(Export);
		const context: ContextExport = {
			flags,
			isFilesGenerated: false,
			files: [],
		};
		const tasks = new Listr<ContextExport>([
			checkForFiles,
			chooseLogoFiles,
			exportToFile,
		], {
			ctx: context,
			concurrent: false,
		});

		await tasks.run();
	}
}
