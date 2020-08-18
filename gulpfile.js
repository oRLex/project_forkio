const {
  src,
  dest,
  watch
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


const del = function(){
 return  delFolder.sync([path.dest.server]);
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

const scriptsDev = function () {
  return src(path.src.server + '/**/*.js')
    .pipe(concat('scripts.min.js'))
    .pipe(dest(path.dest.js));
};
const scriptsProd = function () {
  return src(path.src.server + '/**/*.js')
    .pipe(jsMinify())
    .pipe(concat('scripts.min.js'))
    .pipe(dest(path.dest.js));
};

const minifyImages = function () {
  return src(path.src.img + '/*')
    .pipe(imagemin())
    .pipe(dest(path.dest.img));
};
const minifyIcons = function () {
  return src(path.src.icons + '/*')
    .pipe(imagemin())
    .pipe(dest(path.dest.icons));
};

const sassDev = function () {
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
};

const sassProd = function(){
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
};

const htmlInclude = function(){
  return src(['./index.html'])
  .pipe(fileinclude({
    prefix: '@@',
    basepath: '@file'
  }))
  .pipe(dest(path.dest.server));
};

const defaultTask = function () {
  htmlInclude();
  minifyImages();
  minifyIcons();
  sassDev();
  scriptsDev();
  serve();

  watch(path.src.html +"/**/*.html").on('change', function () {
    browserSync.reload();
  });
  watch(path.src.html + "/**/*.html").on('change', function () {
      htmlInclude();
      browserSync.reload();
      console.log('watch html');
    });

  watch(path.src.html + "/**/*.html").on('change', function () {
        htmlInclude();
        browserSync.reload();
      });

  watch(path.src.styles + "/**/*.scss").on('change', function () {
    sassDev();
    browserSync.reload();
  });

  watch(path.src.js + "/**/*.js").on('change', function () {
    scriptsDev();
    browserSync.reload();
  });
};


const prodcutionTask = function(cb){
  del();
  sassProd();
  scriptsProd();
  minifyImages();
  minifyIcons();
  cb();
};

exports.default = defaultTask;
exports.prod = prodcutionTask;
