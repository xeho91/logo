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

**NOTE:** For `export`ting, it uses [svgexport] temporarily, until `feDropShadow`
is supported by [librsvg].\
Once the support has arrived, I will migrate to [sharp].\
[svgexport] uses puppeteer to opens every SVG file in the browser, in order to
save it as PNG, hence why it could be slow.\

[svgexport]: https://github.com/shakiba/svgexport
[librsvg]: https://gitlab.gnome.org/GNOME/librsvg/-/issueos/743
[sharp]: https://github.com/lovell/sharp

## Logo previews

A few examples on of how this logo can be generated.

The whole list of available variants is available in:

- SVG files in [./dist/svg](./dist/svg)
- PNG files in [./dist/png](./dist/png)

### Default

![xeho91's logo - default version](./dist/svg/xeho91-logo.svg)

### Animated

Is possible to adjust the **animation time**, and the character's strokes
filling **directions**.\
The paths details are in [./source/logo/paths.js](./source/logo/paths.js).

![xeho91's animated logo](./dist/svg/xeho91-logo.animated.svg)

### Black

![xeho91's logo - black version](./dist/svg/xeho91-logo.black.svg)

### White

![xeho91's logo - white version](./dist/svg/xeho91-logo.white.svg)

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
[Link to more information](https://creativecommons.org/licenses/by-sa/4.0/)
about **CC BY-SA 4.0**.
