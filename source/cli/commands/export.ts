import { Command } from "@oclif/command";

export default class Export extends Command {
	static description = "Generate SVG logo file";

	static examples = [
		"$ xeho91-logo generate",
	];

	async run() {
		// const { flags } = this.parse(Export);
	}
}
