<script>
	export let id;
	export let charData;
	export let color;
	export let duration = 200;
	export let prevChar;

	function parseCoordinate(coordinate) {
		switch (coordinate) {
			case "left":
			case "bottom":
				return "0%";
			case "middle":
			case "center":
				return "50%";
			case "right":
			case "top":
				return "100%";
		}
	}

	function getCoordinates(from, to) {
		let [ startX, startY ] = from;
		let [ endX, endY ] = to;

		let x1 = parseCoordinate(startX);
		let y1 = parseCoordinate(startY);
		let x2 = parseCoordinate(endX);
		let y2 = parseCoordinate(endY);

		return { x1, y1, x2, y2 };
	}

	/*
	 * NOTE: Id must be with underscore, don't add dash.
	 * The reason is that with dash,
	 * it won't be possible to use "animationId.end"
	 */
	function setAnimationId(pathName, charName = id) {
		return `animation_${charName}_${pathName}`;
	}

	function getLastAnimationId(index) {
		const lastPathName = Object.keys(charData)[index - 1];

		if (lastPathName) {
			return `${setAnimationId(lastPathName)}.end`;
		} else if (prevChar) {
			return `${setAnimationId(prevChar.lastPathName, prevChar.charName)}.end`;
		} else {
			return 0;
		}
	}
</script>

<g id="char-animation_{id}">
	{#each Object.keys(charData) as pathName, index}
		<linearGradient
			id="gradient-{id}_{pathName}"
			{...getCoordinates(charData[pathName].from, charData[pathName].to)}
		>
			<stop
				offset="100"
				stop-color={color}
				stop-opacity="0"
			>
				<animate
					id={setAnimationId(pathName)}
					attributeName="offset"
					values="1; 0"
					dur="{duration / 1000}s"
					begin={getLastAnimationId(index)}
					fill="freeze"
				/>
			</stop>

			<stop
				offset="0"
				stop-color={color}
				stop-opacity="1"
			/>
		</linearGradient>
	{/each}
</g>
