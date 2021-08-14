const { watch, series, src, dest } = require("gulp");
var postcss = require("gulp-postcss");
const tinypng = require('gulp-tinypng-compress');
let concat = require("gulp-concat");
let uglify = require('gulp-uglify');
let plumber = require('gulp-plumber');
let gulpIf = require('gulp-if');

// Setup & config path
let baseInputDir = './src';
let baseOutputDir = './assets';
let baseNPMDir = './node_modules';
let baseVendorDir = baseInputDir + '/vendor';

// src file & folder
let cssFiles = [
		baseInputDir + '/css'
	],
	cssMainEntry = baseInputDir + '/css/styles.css',
	jsStandaloneFiles = [
		baseInputDir + '/js/standalone/**.js'
	],
	jsMergableFiles = [
		baseInputDir + '/js/mergable/**.js'
	],
	imgFiles = [baseInputDir + '/img/**.*'],
	fontFiles = [
		baseInputDir + '/font/**.*',
		//baseNPMDir + '/font-awesome/fonts/**.*' 
	],
	jsVendorFiles = [
		baseVendorDir + '/**/*.js',
		//baseNPMDir + '/lodash/lodash.js',
	],
	cssVendorFiles = [
		baseVendorDir + '/**/*.css',
		//baseNPMDir + '/font-awesome/css/font-awesome.css',
	];

// "dest" folders
let outputCSSDir = baseOutputDir + '/css',
	outputJSDir = baseOutputDir + '/js',
	outputFontDir = baseOutputDir + '/font',
	outputImgDir = baseOutputDir + '/img';

// "dest" files
let mergedVendorCSSFile = 'vendors.css',
	mergedVendorJSFile = 'vendors.js',
	mergedJSFile = 'scripts.js';

const isProduction = process.env.NODE_ENV === 'production';

console.log('Is production: ', isProduction);


function cssTask(cb) {

	return src(cssMainEntry) // read the main entry css file
		.pipe(postcss()) // compile using postcss
		.pipe(dest(outputCSSDir));
}


function jsSATask(cb) {

	return src(jsStandaloneFiles)
		.pipe(plumber())
		.pipe( gulpIf(isProduction, uglify()) )
		.pipe(dest(outputJSDir));
}


function jsMergeTask(cb) {

	return src(jsMergableFiles)
		.pipe(plumber())
		.pipe(concat(mergedJSFile))
		.pipe( gulpIf(isProduction, uglify()) )
		.pipe(dest(outputJSDir));
}


// Task for minifying images
function tinypngTask(cb) {

	let tinypng_api_key = process.env.TINYPNG_API_KEY;
	if ( ! tinypng_api_key) {
		throw 'No TINYPNG_API_KEY found in the environment';
	}

	tinypng_api_key = tinypng_api_key.split(',');
	tinypng_api_key.map(item => item.trim()); // trim white space

	let random_key = tinypng_api_key.length === 1 ? 0 : Math.floor(Math.random()*tinypng_api_key.length);
	console.log('Found ' + tinypng_api_key.length + ' key(s)');
	console.log('Randomized Tinypng api key', random_key, tinypng_api_key[random_key]);
	
	return src(imgFiles)
		.pipe(tinypng({
			key: tinypng_api_key[random_key],
			sigFile: baseInputDir + '/.tinypng-sigs',
			log: true
		}))
		.pipe(dest(outputImgDir));	
}

function fontTask(cb) {
	
	let extraFonts = [
		//baseNPMDir + '/font-awesome/fonts/**.*' 
	];

	return src(fontFiles.concat(extraFonts))
		.pipe(dest(outputFontDir));
}

function jsVendorTask(cb) {

	return src(jsVendorFiles)
		.pipe(concat(mergedVendorJSFile))
		.pipe(plumber())
		.pipe( gulpIf(isProduction, uglify()) )
		.pipe(dest(outputJSDir));
}

function cssVendorTask(cb) {

	return src(cssVendorFiles)
		.pipe(plumber())
		.pipe(concat(mergedVendorCSSFile))
		.pipe(dest(outputCSSDir));
}


function watchTask(cb) {
	watch(cssFiles, cssTask);
	watch(jsStandaloneFiles, jsSATask);
	watch(jsMergableFiles, jsMergeTask);

	cb();
}


exports.default = series(cssTask, jsSATask, jsMergeTask, tinypngTask, fontTask, jsVendorTask, cssVendorTask);
exports.dev = series(cssTask, jsSATask, jsMergeTask, tinypngTask, fontTask, jsVendorTask, cssVendorTask, watchTask);
exports.css = cssTask;
exports.image = tinypngTask;
exports.font = fontTask;
exports.js = series(jsSATask, jsMergeTask);
exports.vendor = series(jsVendorTask, cssVendorTask);
exports.watch = watchTask;
