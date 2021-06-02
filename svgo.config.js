module.exports = {
	plugins: [
		{
			name: "removeUnknownsAndDefaults",
			active: false,
		},
		{
			name: "cleanupIDs",
			active: false,
		},
		{
			name: "cleanupNumericValues",
			params: { leadingZero: false },
		},
		{
			name: "convertShapeToPath",
			active: false,
		},
	],
};
