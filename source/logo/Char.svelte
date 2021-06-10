<script>
	export let id;
	export let charData;
	export let withAnimation;
</script>

<g id="char_{id}">
	{#each Object.keys(charData) as pathName}
		<path
			id="{id}-{pathName}"
			d={charData[pathName].d}
			fill={withAnimation ? `url(#gradient-${id}_${pathName})` : undefined}
		/>
	{/each}
</g>
