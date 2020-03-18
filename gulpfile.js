const { src, dest, watch, series, parallel } = require('gulp');

const sass          = require('gulp-sass');
const cleanCSS      = require('gulp-clean-css');
const sourceMap     = require('gulp-sourcemaps');
const browserSync   = require('browser-sync').create();
const imagemin      = require('gulp-imagemin');
const terser        = require('gulp-terser');
const ghPages       = require('gulp-gh-pages');
const rename        = require('gulp-rename');
const cp            = require("child_process");

sass.compiler = require('node-sass');

//

const imgSrc        = './assets/img/**/*';
const imgDest       = './_site/assets/img';

const pdfSrc        = './assets/pdf/*.pdf';
const pdfDest       = './_site/assets/pdf';

const dataSrc       = './assets/data/*';
const dataDest      = './_site/assets/data';

const fontSrc       = './assets/font/*';
const fontDest      = './_site/assets/font';

const jsSrc         = './assets/js/*.js';
const jsDest        = './_site/assets/js';

const styleSrc      = './assets/sass/**/*.sass';
const styleDev      = './assets/css/';
const styleDest     = './_site/assets/css';

const ready         = './_site/';

//

function doBrowser() {

    // Initiate local server

    browserSync.init({
        server: {
            baseDir: ready
        },
        port: 2323
    });

}

function doDeploy() {

    // Deploy to gh-Pages branch on github

    return src(ready)
        .pipe(ghPages());

}

function doReload(cb) {

    // Refresh browser

    browserSync.reload();

    cb();

}

function doData(cb) {

    // Move data files to ready

    return src(dataSrc)
        .pipe(dest(dataDest))
        .pipe(browserSync.stream());

    cb();

}

function doPDF(cb) {

    // Move PDF to ready

    return src(pdfSrc)
        .pipe(dest(pdfDest))
        .pipe(browserSync.stream());

    cb();

}

function doImg(cb) {

    // Minify images and move to ready

    return src(imgSrc)
        .pipe(imagemin())
        .pipe(dest(imgDest))
        .pipe(browserSync.stream());

    cb();

}

function doFont(cb) {

    // Move to ready

    return src(fontSrc)
        .pipe(dest(fontDest))
        .pipe(browserSync.stream());

    cb();

}

function doJS(cb) {

    // Get Javascript, uglify it and then move to ready.

    return src(jsSrc)
        .pipe(sourceMap.init())
        .pipe(terser())
        .pipe(sourceMap.write())
        .pipe(dest(jsDest))
        .pipe(browserSync.stream());

    cb();

}

function doCSS(cb) {

    // Get Sass and turn into CSS, create sourcemaps and then move to ready.

    return src(styleSrc)
        .pipe(sourceMap.init())
        .pipe(sass())
        .pipe(dest(styleDev))
        .pipe(cleanCSS())
        .pipe(sourceMap.write())
        .pipe(dest(styleDest))
        .pipe(browserSync.stream());

    cb();

}

function doJekyll(cb) {

    // Build jekyll

    return cp.spawn("bundle", ["exec", "jekyll", "build"], { stdio: "inherit" });

    cb();

}

function watchAll() {

    // Watch stuff, then do stuff

    doBrowser();

    watch(styleSrc, doCSS);
    watch(jsSrc, doJS);
    watch(pdfSrc, doPDF);
    watch(imgSrc, doImg);
    watch(fontSrc, doFont);
    watch(dataSrc, doData);

    watch(
        [
            './_includes/**/*',
            './_layouts/**/*',
            './_posts/**/*',
            './_pages/**/*',
            './*.md',
            './*.html'
        ],
        series(doJekyll, doReload)
    );

}

//
exports.default = function() {

    watchAll();

}

exports.deploy = doDeploy