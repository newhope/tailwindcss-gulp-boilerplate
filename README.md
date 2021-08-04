# Build Process

```
gulp
--postcss
----tailwindcss
----autoprefix
--imagemin
--concat
--uglify
```

# Default `src` structure

```
css
--styles.css: Main stylesheet that use Tailwind directive, support nested css rules
js
--standalone: Standlone scripts to be proceed individual over to output dir
--mergable: Script that will be merged into "scripts.js" in output dir
img: Images to be optimized
font: Webfont files to be copied over to output dir
vendor: 3rd party libraries lib include of JS & CSS to be merged & optimized over into "vendors.js" and "vendors.css" in output dir
```

All the paths can be configurable within the `gulpfile.js`

&nbsp;

# Commands

## Build assets for production

```bash
npm run build-production
```
Which will:
- Generated purged & minified TailwindCSS
- All the JS & CSS are merged & minified)
- Optimize images
- Copy over webfonts

&nbsp;

## Build assets for development
```bash
npm run build
```
Which will:
- Generate full TailwindCSS
- All the JS & CSS are merged
- Optimize images
- Copy over webfonts

&nbsp;

## Watch for change & Compile
```bash
npm run watch
```
Which will watching for:
- Tailwind's custom style
- JS file in `standalone` & `mergable`

And compile them as `Build assets for development`

&nbsp;

## Build assets for development + watch
```bash
npm run dev
# equal to
# npm run build && npm run watch
```



