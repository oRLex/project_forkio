const {
  src,
  dest,
  watch,
  series
} = require('gulp');
const delFolder = require('del');
const sass = require("gulp-sass");
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const imagemin = require('gulp-imagemin');
const jsMinify = require('gulp-js-minify');
const fileinclude = require('gulp-file-include');
const browserSync = require('browser-sync').create();


const path = {
  src: {
    server: './src',
    styles: './src/scss',
    js: './src/js',
    img: './src/assets/img',
    icons: './src/assets/icons/',
    html: './src/templates'

  },
  dest: {
    server: './dist/',
    styles: './dist/css',
    js: './dist/js',
    img: './dist/assets/img',
    icons: './dist/assets/icons'
  },
};


const del = function (cd) {
    cd()
  return delFolder.sync([path.dest.server]);

};

const serve = function () {
  browserSync.init({
    server: {
      baseDir: './dist',
    },
    port: 5500,
    browser: 'firefox',
  });
};

const scriptsDev = function (cb) {
  return src(path.src.server + '/**/*.js')
    .pipe(concat('scripts.min.js'))
    .pipe(dest(path.dest.js));
    cb();
};
const scriptsProd = function (cb) {
  return src(path.src.server + '/**/*.js')
    .pipe(jsMinify())
    .pipe(concat('scripts.min.js'))
    .pipe(dest(path.dest.js));
    cb();
};

const minifyImages = function (cb) {
  return src(path.src.img + '/*')
    .pipe(imagemin())
    .pipe(dest(path.dest.img));
    cb();
};
const minifyIcons = function (cb) {
  return src(path.src.icons + '/*')
    .pipe(imagemin())
    .pipe(dest(path.dest.icons));
    cb();
};

const sassDev = function (cb) {
  return src(path.src.styles + "/**/*.scss")
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: "compressed"
    }).on("error", sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(concat('styles.min.css'))
    .pipe(cleanCSS())
    .pipe(dest(path.dest.styles));
    cb();
};

const sassProd = function (cb) {
  return src(path.src.styles + "/**/*.scss")
    .pipe(sass({
      outputStyle: "compressed"
    }).on("error", sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(concat('styles.min.css'))
    .pipe(dest(path.dest.styles));
    cb();
};

const htmlInclude = function (cb) {
  return src(['./index.html'])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(dest(path.dest.server));
    cb();
};

const watchers = function () {

  watch(path.src.html + "/**/*.html", function (cb) {
        browserSync.reload();
        cb();
    });
  watch(path.src.html + "/**/*.html", function () {
            htmlInclude();
            browserSync.reload();
          cb();
      });
  watch(path.src.styles + "/**/*.scss", function (cb) {
             sassDev();
             browserSync.reload();
             cb();
  });
  watch(path.src.js + "/**/*.js", function (cb) {
           scriptsDev();
           browserSync.reload();
          cb();
      });

};

exports.dev = series(serve, htmlInclude, sassDev, scriptsDev, minifyImages, minifyIcons, watchers);
exports.build = series(del, htmlInclude, sassProd, scriptsProd, minifyImages, minifyIcons);