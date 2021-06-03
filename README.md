# xeho91's logo

Logo build with **SVG** technology.\
Firstly it was done in Inkscape graphic editor, then the output _(code)_ was
optimized for developing purposes.

Animation was coded with using **[SMIL]**, which stands for _Synchronized
Multimedia Integration Language_.

[SMIL]: https://developer.mozilla.org/docs/Web/SVG/SVG_animation_with_SMIL

## Details

This package contains logo assets resources. [Jump to previews](#logo-previews).\
And also CLI. [Jump to the usage example](#cli-usage).

### Logo

The logo component is made with [**Svelte**](https://github.com/svelte).
The component files are available in [./source/logo](./source/logo).

### CLI

To speed up logo distribution, usage, I wrote CLI which is coded in TypeScript
with:

- [oclif](https://github.com/oclif/oclif)
- [prompts](https://github.com/terkelg/prompts)
- [Listr](https://github.com/SamVerschueren/listr)

## Logo previews

A few examples on of how this logo can be generated.

### Standard

![xeho91's logo](./dist/xeho91-logo.svg)

### Animated

Is possible to adjust the **animation time**, and the character's strokes
filling **directions**. The details are in
[./source/logo/paths.json](./source/logo/paths.json).

![xeho91's animated logo](./dist/xeho91-logo.animated.svg)

### Black

![xeho91's logo without colors and black](./dist/xeho91-logo.black.svg)

### White

![xeho91's logo without colors and white](./dist/xeho91-logo.white.svg)

### CLI usage

1. Install the package globally with any Node.JS package manager of your
   choice. I use [pnpm](https://github.com/pnpm/pnpm).

```sh
pnpm i -g @xeho91/logo
```

2. Call the command to print the help with available commands/flags:

```sh
xeho91-logo --help
```

## LICENSE

The **code** is licensed under [MIT](./LICENSE).

The **logo** is licensed under [CC BY-SA 4.0](./CC_BY-SA_4.0).\
[Link to more information](https://creativecommons.org/licenses/by-sa/4.0/) about **CC BY-SA 4.0**.
