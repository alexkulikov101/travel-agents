"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber"); /// если ошибка в коде то после исправление gulp продолжит работу
var postcss = require("gulp-postcss"); ///нужен для работы autoprefixer
var autoprefixer = require("autoprefixer");
var minify = require("gulp-csso"); /// минификация css
var rename = require("gulp-rename"); /// переименование файла в min.css
var imagemin = require("gulp-imagemin"); /// минификация изображении
var webp = require("gulp-webp"); /// Изображения в WEBP
var svgstore = require("gulp-svgstore"); /// Спрайты SVG
var posthtml = require("gulp-posthtml"); /// Шаблонизация HTML-файлов
var include = require("posthtml-include"); /// Шаблонизация HTML-файлов
var server = require("browser-sync").create();
var run = require("run-sequence"); /// Плагин который позволяет запускать задачи последовательно
var del = require("del");
var htmlmin = require("gulp-htmlmin"); /// Минификация HTML
var uglify = require("gulp-uglify"); /// Минификация JS

///Задача для SASS
gulp.task("style", function() {
  gulp
    .src("scss/style.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([autoprefixer()]))
    .pipe(gulp.dest("build/css"))
    .pipe(minify())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

/// Минификация изображении
gulp.task("images", function() {
  return gulp
    .src("img/**/*.{png,jpg,svg}")
    .pipe(
      imagemin([
        imagemin.optipng({ optimizationLevel: 3 }), //max сжатие=1, min сжатие=10
        imagemin.jpegtran({ progressive: true }), ///прогресивный png
        imagemin.svgo() ///сжимаем svg
      ])
    )
    .pipe(gulp.dest("img"));
});

/// Перевод изображения в WEBP
gulp.task("webp", function() {
  return gulp
    .src("img/**/*.{png,jpg}")
    .pipe(webp({ quality: 90 })) /// качество
    .pipe(gulp.dest("img"));
});

/// Спрайты SVG
gulp.task("sprite", function() {
  return gulp
    .src("img/icon-*.svg")
    .pipe(
      svgstore({
        inlineSvg: true ///При создании спрайта что бы не появлялись различные символы в верстке
      })
    )
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"));
});

/// Вставка Спрайта в Html
gulp.task("html", function() {
  return gulp
    .src("*.html")
    .pipe(
      posthtml([
        include() ////плагин include чтобы работал posthtml
      ])
    )
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("build"))
    .pipe(server.stream());
});

/*<div style="display:none">
  <include src="build/img/sprite.svg"></include>
</div>
///вставка в html*/

///Копирование
gulp.task("copy", function() {
  return gulp
    .src(["fonts/**/*.{woff,woff2}", "img/**", "js/**"], {
      base: "." /// что бы при копировании складывал в папку img(к примеру)  а не в корень build набросал картинки
    })
    .pipe(gulp.dest("build"));
});

///Удаление
gulp.task("clean", function() {
  return del("build");
});

///Brouser-sync
gulp.task("serve", function() {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  ///Следим за файлами
  gulp.watch("scss/**/*.scss", ["style"]);
  gulp.watch("*.html", ["html"]);
  gulp.watch("js/*.js", ["js"]);
});

///Минификация JS
gulp.task("js", function() {
  gulp
    .src("js/*.js")
    .pipe(gulp.dest("build/js"))
    .pipe(uglify())
    .pipe(
      rename({
        suffix: ".min"
      })
    )
    .pipe(gulp.dest("build/js"))
    .pipe(server.stream());
});

///Запуск
gulp.task("build", function(done) {
  run("clean", "copy", "style", "sprite", "html", "js", done);
});
