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

const fontSrc       = './assets/font/*';
const fontDest      = './_site/assets/font';

const jsSrc         = './assets/js/*';
const jsDest        = './_site/assets/js';

const styleSrc      = './assets/sass/**/*';
const styleDev      = './assets/css/';
const styleDest     = './_site/assets/css';

const ready         = './_site/';

//

function doDeploy() {

    return src(ready)
        .pipe(ghPages());

}

function doBrowser() {

    browserSync.init({
        server: {
            baseDir: ready
        },
        port: 2323
    });

}

function doReload(cb) {

    browserSync.reload();

    cb();

}

function doImg(cb) {

    return src(imgSrc)
        .pipe(
            imagemin([
                imagemin.gifsicle({ interlaced: true }),
                imagemin.jpegtran({ progressive: true }),
                imagemin.optipng({ optimizationLevel: 5 }),
                imagemin.svgo({
                  plugins: [
                    {
                      removeViewBox: false,
                      collapseGroups: true
                    }
                  ]
                })
            ])
        )
        .pipe(dest(imgDest));

    cb();

}

function doFont(cb) {

    return src(fontSrc)
        .pipe(dest(fontDest));

    cb();

}

function doJS(cb) {

    // Get Javascript, uglify it and then move to ready.

    return src(jsSrc)
        .pipe(sourceMap.init())
        .pipe(terser())
        .pipe(sourceMap.write())
        .pipe(dest(jsDest));

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

    doBrowser();

    watch(styleSrc, doCSS);
    watch(jsSrc, doJS);
    watch(imgSrc, doImg);
    watch(fontSrc, doFont);

    watch(
        [
            './_includes/**/*',
            './_layouts/**/*',
            './_posts/**/*',
            './_work/**/*',
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