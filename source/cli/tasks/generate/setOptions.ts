import { success } from "../../utils/log";

import type { ListrTask } from "listr2";
import type { PromptOptions } from "listr2";
import type { ContextGenerate } from "../../commands/generate";


export const setOptions: ListrTask = {
	title: "Setting up the options for generating the SVG logo... ",
	task: async (context: ContextGenerate, task) => {
		const { flags } = context;
		const { "use-default": useDefault, all, output, ...other } = flags;
		const isAnyOptPassed = Object.keys(other).length > 0;

		if (!useDefault && !isAnyOptPassed) {
			context.useDefault = await task.prompt([{
				type: "confirm",
				name: "useDefault",
				message: "Do you want to use the default options?",
				initial: true,
			}]);
		} else {
			context.useDefault = true;
		}

		if (!all) {
			context.target = await task.prompt([{
				type: "select",
				name: "generateTarget",
				message: "",
				choices: [
					{ message: "All possible variants (slow)", name: "all" },
					{ message: "Pick from the list (fast)", name: "pick" },
					{ message: "Individual variant (fast)", name: "individual" },
				],
				initial: "all",
			}]);
		} else {
			context.useDefault = true;
		}

		const defaultOpts: GenerateOptions = {
			withColors: true,
			altForeground: false,
			withBackground: true,
			backgroundType: "normal",
			withAnimations: false,
		};

		const questions: PromptOptions<true>[] = [
			{
				skip: () => typeof flags.color === "boolean",
				type: "confirm",
				name: "withColors",
				message: "Generate with colors?",
				initial: defaultOpts.withColors,
			},
			{
				type: "confirm",
				name: "altForeground",
				message: ({ answers }) => {
					return `Use alternative foreground color (for the logotype)?\n${
						answers.withColors
							? "Replace terracotta (orange) with violet (clairvoyant)?"
							: "Use white instead of black?"
					}`;
				},
				initial: defaultOpts.altForeground,
			},
			{
				skip: () => typeof flags.background === "boolean",
				type: "confirm",
				name: "withBackground",
				message: "Generate with background?",
				initial: defaultOpts.withBackground,
			},
			{
				skip() {
					return !this.state.answers.withBackground;
				},
				type: "select",
				name: "backgroundType",
				message: "Which background type to use?",
				choices: [
					{ message: "Normal", name: "normal" },
					{ message: "Gradient", name: "gradient" },
				],
				initial: flags.color ? defaultOpts.backgroundType : "normal",
			},
			{
				skip: () => typeof flags.animated === "boolean",
				type: "confirm",
				name: "withAnimations",
				message: "Generate with animations?",
				initial: defaultOpts.withAnimations,
			},
		];

		context.generateOptions = context.useDefault
			? defaultOpts
			: await task.prompt(questions);

		task.title += `${success("done")}.`;
	},
	options: {
		persistentOutput: true,
	},
};
