<script>
	export let withAnimation;
	export let id;
	export let d;
	export let color;
	export let duration = "1s";
</script>

<path
	{id}
	fill={withAnimation && "gradient_{id}"}
	{d}
>
	{#if withAnimation}
		<linearGradient
			id="gradient_one_bottom"
			x1="100%"
			y1="50%"
			x2="0%"
			y2="50%"
		>
			<stop
				offset="100"
				stop-color={color}
				stop-opacity="0"
			>
				<animate
					id="animation_{id}"
					attributeName="offset"
					values="1; 0"
					dur={duration}
					begin="animation_{id}.end"
					fill="freeze"
				/>
			</stop>

			<stop
				offset="0"
				stop-color={color}
				stop-opacity="1"
			/>
		</linearGradient>
	{/if}
</path>
