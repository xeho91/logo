<script>
	import { readJSONSync } from "fs-extra";

	import * as chars from "./paths.js";
	import Char from "./Char.svelte";
	import CharAnimation from "./CharAnimation.svelte";

	export let id = "xeho91-logo";

	export let withColors;

	export let altForeground;

	export let withBackground;
	export let backgroundType;

	export let gradientDirection = "vertical";

	export let withAnimation = false;
	export let animationDuration = 3000;

	function getCharactersCount() {
		let count = 0;

		Object.keys(chars).forEach((charName) => {
			count += Object.values(chars[charName]).length;
		});

		return count;
	}

	const duration = animationDuration / getCharactersCount();

	const colors = readJSONSync("node_modules/@xeho91/colors/dist/colors.json");
	const black = "hsla(0deg, 0% , 0%, 1)";
	const white = "hsla(0deg, 0% , 100%, 1)";

	function getHSLA(colorData) {
		const { alpha } = colorData;
		const { hue, saturation, lightness } = colorData.HSL;
		const hsla = `hsla(${hue}deg, ${saturation}%, ${lightness}%, ${alpha})`;

		return hsla;
	}

	let colorForeground;
	let colorBackground;
	let colorShadow;

	// Set the foreground (logotype) color and shadow
	if (withColors) {
		if (altForeground) {
			colorForeground = getHSLA(colors.brand.clairvoyant);
		} else {
			colorForeground = getHSLA(colors.brand.terracotta);
		}

		colorShadow = getHSLA(colors.supplementary.kilamanjaro);
	} else {
		if (altForeground) {
			colorForeground = white;
		} else {
			colorForeground = black;
		}

		colorShadow = black;
	}

	function getGradient() {
		const gradientColors = [
			colors.brand.clairvoyant,
			...Object.values(colors.gradient),
			colors.brand.terracotta,
		];

		return altForeground ? gradientColors.reverse() : gradientColors;
	};

	const getGradientTransform = () => {
		switch(gradientDirection) {
			case "horizontal":
				return 0;
			case "diagonal":
				return 45;
			case "vertical":
			default:
				return 90;
		}
	};

	const withGradient = withColors && backgroundType === "gradient";
	const gradient = getGradient();
	const gradientTransform = getGradientTransform();

	// Set the background
	if (withColors) {
		if (withGradient) {
			colorBackground = `url(#${id}_gradient)`;
		} else {
			if (altForeground) {
				colorBackground = getHSLA(colors.brand.terracotta);
			} else {
				colorBackground = getHSLA(colors.brand.clairvoyant);
			}
		}
	} else {
		if (altForeground) {
			colorBackground = black;
		} else {
			colorBackground = white;
		}
	}

	const width = 1200;
	const height = 630;

	const shadow = {
		color: colorShadow,
		opacity: 0.75,
		offset: { x: 0, y: 5 },
		blur: 10,
	};

	function getLastPathNameOfPrevChar(index) {
		const charName = Object.keys(chars)[index - 1];
		const pathNames = Object.keys(chars[charName]);
		const lastPathName = pathNames[pathNames.length - 1];

		return { charName, lastPathName };
	}
</script>

<svg
	{id}
	xmlns="http://www.w3.org/2000/svg"
	viewBox="0 0 {width} {height}"
	preserveAspectRatio="xMinYMin meet"
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

		<filter id="{id}_shadow" filterUnits="userSpaceOnUse">
			<feDropShadow
				dx={shadow.offset.x}
				dy={shadow.offset.y}
				stdDeviation={shadow.blur}
				flood-color={shadow.color}
				flood-opacity={shadow.opacity}
			/>
		</filter>

		{#if withAnimation}
			<g id="{id}_animations">
				{#each Object.keys(chars) as charName, index}
					<CharAnimation
						id={charName}
						charData={chars[charName]}
						color={colorForeground}
						{duration}
						prevChar={
							index === 0
								? undefined
								: getLastPathNameOfPrevChar(index)
						}
					/>
				{/each}
			</g>
		{/if}

		<symbol id="{id}_logomark">
			{#each Object.keys(chars) as charName}
				<Char
					id={charName}
					charData={chars[charName]}
					{withAnimation}
				/>
			{/each}
		</symbol>
	</defs>

	{#if withBackground}
		<use href="#{id}_background" fill={colorBackground} />
	{/if}

	<use
		href="#{id}_logomark"
		fill={colorForeground}
		filter="url(#{id}_shadow)"
	/>
</svg>
