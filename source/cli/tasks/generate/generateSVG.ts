import { error, success } from "../../utils/log";

import type { ListrTask } from "listr2";
import type { ContextGenerate } from "../../commands/generate";

export interface LogoOptions {
	withColors: boolean;
	altForeground: boolean;
	withBackground: boolean;
	backgroundType: "normal" | "gradient";
	withAnimation: boolean;
}

function getOptions(fileName: string): LogoOptions {
	return {
		withColors: !fileName.includes("white") && !fileName.includes("black"),
		altForeground: fileName.includes("alt") || fileName.includes("white"),
		withBackground: !fileName.includes("nobg"),
		backgroundType: fileName.includes("gradient") ? "gradient" : "normal",
		withAnimation: fileName.includes("animated"),
	};
}

export const generateSVG: ListrTask = {
	title: "Generating the SVG logo(s)... ",
	task: (context: ContextGenerate, task) => {
		/* eslint-disable @typescript-eslint/no-var-requires */
		require("svelte/register")({
			preserveComments: false,
		});
		const Logo = require("../../../logo/Logo.svelte").default;
		/* eslint-enable @typescript-eslint/no-var-requires */

		if (context.selected) {
			context.outputs = context.selected.map((fileName) => {
				const options = getOptions(fileName);
				const { html } = Logo.render(options);

				return { fileName, svg: html };
			});
			task.title += `${success("done")}.`;
		} else {
			task.title += `${error("failed")}!`;
			throw new Error(error("Selected variants are empty!"));
		}

	},
};
