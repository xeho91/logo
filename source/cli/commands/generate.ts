import { Command, flags } from "@oclif/command";
import { Listr } from "listr2";
import { generateSVG } from "../tasks/generate/generateSVG";
import { optimizeSVG } from "../tasks/generate/optimizeSVG";
import { saveSVG } from "../tasks/generate/saveSVG";
import { selectVariant } from "../tasks/generate/selectVariant";
// import { setOptions } from "../tasks/generate/setOptions";
import variants from "../variants";

import type { OutputFlags } from "@oclif/parser";

interface Output {
	fileName: string,
	svg: string,
}

export interface ContextGenerate {
	flags: OutputFlags<typeof Generate.flags>;
	target?: "all" | "selected";
	files: string[];
	selected?: string[];
	outputs?: Output[];
}

export default class Generate extends Command {
	static description = "Generate a SVG file for logo.";
	static usage = "generate --output ./dist/svg/xeho91-logo.svg";

	static flags = ({
		"all": flags.boolean({
			char: "a",
			description: "Generate all logo variants.",
		}),
		"output": flags.string({
			char: "o",
			description: "Specify the output directory path.",
		}),
		// "use-default": flags.boolean({
		// 	char: "d",
		// 	description: "Use default options for generating the logo.",
		// }),
		// "color": flags.boolean({
		// 	char: "c",
		// 	description: "Set option 'withColors'.",
		// 	allowNo: true,
		// }),
		// "background": flags.boolean({
		// 	char: "b",
		// 	description: "Set option 'withBackground'.",
		// 	allowNo: true,
		// }),
		// "animated": flags.boolean({
		// 	char: "a",
		// 	description: "Set option 'withAnimation'.",
		// 	allowNo: true,
		// }),
	});

	async run(): Promise<void> {
		const { flags } = this.parse(Generate);
		const context: ContextGenerate = {
			flags,
			files: variants,
		};
		const tasks = new Listr<ContextGenerate>([
			selectVariant,
			// setOptions,
			generateSVG,
			optimizeSVG,
			saveSVG,
		], {
			ctx: context,
			concurrent: false,
		});

		await tasks.run();
	}
}
