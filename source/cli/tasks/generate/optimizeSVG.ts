import { join } from "path";
import { loadConfig as loadSVGOconfig, optimize } from "svgo";
import { error, success } from "../../utils/log";

import type { ListrTask } from "listr2";
import type { ContextGenerate } from "../../commands/generate";

export const optimizeSVG: ListrTask = {
	title: "Optimizing the SVG output(s)... ",
	task: async (context: ContextGenerate, task) => {
		const config = await loadSVGOconfig(
			join(process.cwd(), "./svgo.config.js"),
		);

		if (context.outputs) {
			context.outputs = context.outputs.map(({ fileName, svg }) => {
				return  { fileName, svg: optimize(svg, config).data }
			});
			task.title += `${success("done")}.`;
		} else {
			task.title += `${error("failed")}!`;
			throw new Error(error("Outputs are empty!"));
		}

	},
	options: {
		persistentOutput: true,
	},
};
