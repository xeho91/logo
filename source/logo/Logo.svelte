<script>
	import { readFileSync } from "fs";

	import Path from "./Path.svelte";
	import * as chars from "./paths.js";

	export let id = "xeho91-logo";
	export let withColors = false;
	export let reverseColors = false;
	export let withBackground = false;
	export let backgroundType = "gradient";
	export let reverseGradient = false;
	export let gradientDirection = "vertical";
	export let withAnimation = false;

	const withGradient = backgroundType === "gradient";

	function getHSLA(colorData) {
		const { alpha } = colorData;
		const { hue, saturation, lightness } = colorData.HSL;
		const hsla = `hsla(${hue}deg, ${saturation}%, ${lightness}%, ${alpha})`;

		return hsla;
	}

	let colorBackground;
	let colorForeground;

	const colors = JSON.parse(
		readFileSync("node_modules/@xeho91/colors/dist/colors.json")
	);


	function getGradient() {
		const gradientColors = [
			colors.brand[0],
			...colors.gradient,
			colors.brand[1],
		];

		return reverseGradient ? gradientColors.reverse() : gradientColors;
	};

	const gradient = getGradient();

	if (withColors) {
		colorBackground = colors.brand[0];
		colorForeground = colors.brand[1];
	} else {
		colorBackground = "white";
		colorForeground = "black";
	}

	if (reverseColors) {
		const bg = colorBackground;

		colorBackground = colorForeground;
		colorForeground = bg;
	}

	const getGradientTransform = () => {
		switch(gradientDirection) {
			case "horizontal":
				return 0;
			case "diagonal":
				return 45;
			case "vertical":
				return 90;
			default:
				return 90;
		}
	};

	const gradientTransform = getGradientTransform();

	const width = 1200;
	const height = 630;

	const shadow = {
		color: withColors ? colors.supplementary[0] : colorForeground,
		opacity: 0.75,
		offset: {
			x: 0,
			y: 5,
		},
		blur: 10,
	};
</script>

<svg
	{id}
	xmlns="http://www.w3.org/2000/svg"
	viewBox="0 0 {width} {height}"
>
	<defs>
		{#if withBackground}
			<rect id="{id}_background" width={width} height={height} />
		{/if}

		{#if withGradient}
			<linearGradient
				id="{id}_gradient"
				gradientTransform="rotate({gradientTransform})"

			>
				{#each gradient as color, index}
					<stop
						offset={((100 / (gradient.length - 1)) * index) + "%"}
						stop-color={getHSLA(color)}
					/>
				{/each}
			</linearGradient>
		{/if}

		<filter id="{id}_shadow">
			<feDropShadow
				dx={shadow.offset.x}
				dy={shadow.offset.y}
				stdDeviation={shadow.blur}
				flood-color={withColors ? getHSLA(shadow.color) : colorForeground}
				flood-opacity={shadow.opacity}
			/>
		</filter>

		<symbol id="{id}_logomark">
			{#each Object.keys(chars) as charName}
				<g id={charName}>
					{#each Object.keys(chars[charName]) as pathName}
						<Path
							id="{charName}-{pathName}"
							{withAnimation}
							d={chars[charName][pathName]}
						/>
					{/each}
				</g>
			{/each}
		</symbol>
	</defs>

	{#if withBackground}
		<use
			href="#{id}_background"
			fill={
				withColors
					? withGradient ? `url(#${id}_gradient)` : getHSLA(colorBackground)
					: colorBackground
			}
		/>
	{/if}

	<use
		href="#{id}_logomark"
		fill={withColors ? getHSLA(colorForeground) : colorForeground}
		filter="url(#{id}_shadow)"
	/>
</svg>
