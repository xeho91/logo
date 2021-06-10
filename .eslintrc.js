/** @type { import("eslint/rules").ESLintRules } */
var rulesFromESLint = {
	// https://eslint.org/docs/rules

	"indent": [
		"warn",
		"tab",
		{
			SwitchCase: 1,
		},
	],

	"max-len": [
		"error",
		{
			code: 100,
			tabWidth: 4,
			ignoreStrings: true,
			ignoreTemplateLiterals: true,
			ignoreUrls: true,
		},
	],

	"quotes": ["warn", "double", { avoidEscape: true }],

	"no-console": ["warn"],

	"no-alert": ["error"],

	"no-debugger": ["error"],
};

var rulesFromPlugins = {
	//
};

/** @type { import("eslint").Linter.Config } */
module.exports = {
	extends: [
		// https://github.com/eslint/eslint/blob/master/conf/eslint-recommended.js
		"eslint:recommended",

		// https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/src/configs/recommended.ts
		"plugin:@typescript-eslint/recommended",

		// https://github.com/nodesecurity/eslint-plugin-security
		"plugin:security/recommended",

		// https://github.com/xjamundx/eslint-plugin-promise
		"plugin:promise/recommended",
	],

	parser: "@typescript-eslint/parser",

	parserOptions: {
		project: "./tsconfig.json",
		sourceType: "module",
		ecmaVersion: 2020,
	},

	plugins: [
		// https://github.com/typescript-eslint/typescript-eslint
		"@typescript-eslint",

		// https://github.com/nodesecurity/eslint-plugin-security
		"security",

		// https://github.com/xjamundx/eslint-plugin-promise
		"promise",

		// https://github.com/BenoitZugmeyer/eslint-plugin-html
		"html",

		// https://github.com/sveltejs/eslint-plugin-svelte3
		"svelte3",
	],

	overrides: [
		{
			files: ["*.svelte"],
			processor: "svelte3/svelte3",
		},
	],

	env: {
		es2020: true,
		node: true,
	},

	rules: {
		...rulesFromESLint,
		...rulesFromPlugins,
	},

	settings: {
		// https://github.com/sveltejs/eslint-plugin-svelte3#configuration
		"svelte3/ignore-styles": () => true,
		"svelte3/typescript": require("typescript"),
	},
};
