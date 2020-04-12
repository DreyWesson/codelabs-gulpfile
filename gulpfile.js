const { series, src, dest, watch, parallel } = require("gulp");
const browserSync = require("browser-sync");
const babel = require("gulp-babel");
const uglify = require("gulp-uglify");
const rename = require("gulp-rename");
const cleanCSS = require("gulp-clean-css");

function copy() {
  return src(["app/*.html", "app/**/*.jpg"]).pipe(dest("build"));
}
exports.copy = copy;

function serve() {
  return browserSync.init({
    server: "build",
    open: false,
    port: 3000,
  });
}
exports.serve = serve;

function processJs() {
  return src("app/scripts/*.js")
    .pipe(
      babel({
        presets: ["env"],
      })
    )
    .pipe(uglify())
    .pipe(
      rename({
        suffix: ".min",
      })
    )
    .pipe(dest("build/scripts"));
}
exports.processJs = processJs;

function watchIt() {
  watch("app/scripts/*.js", processJs);
  watch("app/styles/*.css", processCss);
}
exports.watchIt = watchIt;

function processCss() {
  return src("app/styles/*.css")
    .pipe(cleanCSS({ compatibility: "ie8" }))
    .pipe(
      rename({
        suffix: ".min",
      })
    )
    .pipe(dest("build/styles"));
}
exports.processCss = processCss;

exports.default = series(
  parallel(copy, processCss, processJs),
  parallel(serve, watchIt)
);
