// export { run } from "@oclif/command";
import { Listr } from "listr2";
import { BaseCommand } from "../base";
import Export from "./export";
import Generate from "./generate";

import { info } from "../utils/log";

export default class Base extends BaseCommand {
	async run(): Promise<void> {
		const tasks = new Listr([{
			task: async (_, task) => {
				const command = await task.prompt({
					type: "select",
					message: "What do you want to do?",
					choices: [
						{
							message: "Generate a SVG file with the logo.",
							name: "generate",
						},
						{
							message: "Export generated SVG logo file(s) to PNG format.",
							name: "export",
						},
						{
							message: "Do nothing.",
							name: "quit",
						},
					],
				});

				if (command === "quit") {
					this.exit(0);
				} else {
					task.output = `Executing the command: "${info(command)}".`;
				}

				switch (command) {
					case "generate":
						Generate.run();
						break;

					case "export":
						Export.run();
						break;
				}
			},
			options: {
				persistentOutput: true,
			},
		}], {
			// tasks shared options
		});

		await tasks.run();
	}
}
