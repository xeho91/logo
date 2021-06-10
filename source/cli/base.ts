import { Command, flags } from "@oclif/command";
import type { Input, OutputArgs, OutputFlags } from "@oclif/parser";

export abstract class BaseCommand extends Command {
	static flags = {
		help: flags.help({ char: "h" }),
		version: flags.help({ char: "v" }),
	};

	// static args = [];

	protected parsedArgs?: OutputArgs<any>;
	protected parsedFlags?: OutputFlags<typeof BaseCommand.flags>;

	async init(): Promise<void> {
		const { args, flags } = this.parse(
			this.constructor as Input<typeof BaseCommand.flags>,
		);

		this.parsedArgs = args;
		this.parsedFlags = flags;
	}
}
