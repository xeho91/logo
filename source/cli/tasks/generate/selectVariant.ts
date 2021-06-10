import { info } from "../../utils/log";

import type { ListrTask } from "listr2";
import type { ContextGenerate } from "../../commands/generate";

interface Choice {
	name: string;
	value: string;
	selected: boolean;
}

function createMessage(fileName: string) {
	const description = [];

	// Foreground
	if (fileName.includes("alt")) description.push("Alternative");
	else if (fileName.includes("white")) description.push("White");
	else if (fileName.includes("black")) description.push("Black");
	else description.push("Default");

	// Background
	if (fileName.includes("gradient")) {
		description.push("Gradient background");
	} else if (fileName.includes("nobg")) {
		description.push("No background");
	} else description.push("Normal background");

	return description.join(" | ");
}

function createChoices(
	list: string[],
	group: "default" | "alt" | "white" | "black",
) {
	const isDefault = (name: string) => {
		return (
			!name.includes("alt")
			&& !name.includes("white")
			&& !name.includes("black")
		);
	};

	return list
		.filter((fileName) => {
			const isAnimated = fileName.includes("animated");

			return !isAnimated && (
				group === "default"
					? isDefault(fileName)
					: fileName.includes(group)
			);
		}).map((fileName) => {
			return {
				message: createMessage(fileName),
				name: fileName,
			};
		});
}
export const selectVariant: ListrTask = {
	title: "Selecting the logo variant(s) to generate... ",
	task: async (context: ContextGenerate, task) => {
		const { flags } = context;
		const { all } = flags;

		if (all) {
			context.target = "all";
		} else {
			context.target = await task.prompt([{
				type: "select",
				name: "target",
				message: "Which logo variant(s) do you want to generate?",
				choices: [
					{ message: "All possible variants.", name: "all" },
					{
						message: "Select from the list of possible variants.",
						name: "selected",
					},
				],
				initial: "selected",
			}]);
		}

		task.title += `${info(context.target)}.`;

		if (context.target === "all") {
			context.selected = context.files;
		} else if (context.target === "selected") {
			context.selected = await task.prompt([{
				type: "multiselect",
				name: "selected",
				message: "Which one of these variants to generate?",
				choices: [
					// Default - colored
					{
						message:
							"Default - colored (uses orange as foreground - logotype)",
						role: "separator",
					},
					...createChoices(context.files, "default"),

					// Alternative - colored
					{
						message:
							"Alternative - colored (use violet as foreground - logotype)",
						role: "separator",
					},
					...createChoices(context.files, "alt"),

					// White
					{
						message: "White foreground (logotype)",
						role: "separator",
					},
					...createChoices(context.files, "white"),

					// Black
					{
						message: "Black foreground (logotype)",
						role: "separator",
					},
					...createChoices(context.files, "black"),
				],
				validate(choices: Choice[]) {
					return choices.find(({ selected }) => !selected)
						? true
						: "Select at least one logo file (with space) to continue.";
				},
			}]);

			type Animations = "only" | "include" | "exclude";

			const animations: Animations = await task.prompt([{
				type: "select",
				message: "What about animations?",
				name: "animations",
				choices: [
					{
						message: "Generate animated only.",
						name: "only",
					},
					{
						message: "Include animated (generate both).",
						name: "include",
					},
					{
						message: "Exclude animated.",
						name: "exclude",
					},
				],
			}]);

			if (context.selected && animations !== "exclude") {
				const animatedVariants = context.selected.map((selection) => {
					return selection.replace(".svg", ".animated.svg");
				});

				if (animations === "only") {
					context.selected = animatedVariants;
				} else if (animations === "include") {
					context.selected = [
						...context.selected,
						...animatedVariants,
					];
				}
			}

			// Output a formatted list of selected variants
			task.output = `${info("Selected variants")}:\n- ${
				context.selected?.join(",\n- ")
			}`;
		}
	},
	options: {
		persistentOutput: true,
	},
};
