import gulp from "gulp";
import htmltidy from "gulp-htmltidy";
import csslint from "gulp-csslint";
import jshint from "gulp-jshint";
import autoprefixer from "gulp-autoprefixer";
import babel from "gulp-babel";

export function htmlTidy() {
  return gulp.src("*.html")
    .pipe(htmltidy({ doctype: 'html5', hideComments: false, indent: true }))
    .pipe(gulp.dest("dist"));
}

export function cssLint() {
  return gulp.src("*.css")
    .pipe(csslint())
    .pipe(csslint.formatter());
}

export function jsHint() {
  return gulp.src("*.js")
    .pipe(jshint())
    .pipe(jshint.reporter("default"));
}

export function cssPrefix() {
  return gulp.src("*.css")
    .pipe(autoprefixer({ cascade: false }))
    .pipe(gulp.dest("dist"));
}

export function jsTranspile() {
  return gulp.src("*.js")
    .pipe(babel({ presets: ["@babel/preset-env"] }))
    .pipe(gulp.dest("dist"));
}

export default gulp.series(
  htmlTidy,
  cssLint,
  jsHint,
  cssPrefix,
  jsTranspile
);

