var gulp = require('gulp'), // Подключаем Gulp
    sass = require('gulp-sass'), //Подключаем Sass пакет,
    browserSync = require('browser-sync'), // Подключаем Browser Sync (сервер)
    include = require('gulp-include'), // Подключаем gulp-include (для объединения файлов)
    uglify = require('gulp-uglifyjs'), // Подключаем gulp-uglifyjs (для сжатия JS)
    minifycss = require('gulp-minify-css'), // Подключаем gulp-minify-css (для сжатия css)
    cleancss = require('gulp-clean-css'), // Подключаем gulp-clean-css (для разворачивания css из сжатого вида)
    autoprefixer = require('gulp-autoprefixer'), // Подключаем gulp-autoprefixer (автоматически добавляет префиксы в css)
    sourcemaps = require('gulp-sourcemaps');

var path = {
    dist: { //Тут мы укажем куда складывать готовые после сборки файлы
        html: 'dist/',
        js: 'dist/js/',
        css: 'dist/css/',
        img: 'dist/img/',
        fonts: 'dist/fonts/'
    },
    app: { //Пути откуда брать исходники
        html: 'app/*.html', //Синтаксис app/*.html говорит gulp что мы хотим взять все файлы с расширением .html
        js: 'app/js/main.js', //В стилях и скриптах нам понадобятся только main файлы
        scss: 'app/scss/main.scss',
        img: 'app/img/**/*.*', //Синтаксис img/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
        fonts: 'app/fonts/**/*.*'
    },
    watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
        html: 'app/**/*.html',
        js: 'app/js/**/*.js',
        scss: 'app/scss/**/*.scss',
        img: 'app/img/**/*.*',
        fonts: 'app/fonts/**/*.*'
    }
};

gulp.task('html', function() {
    console.log("-- gulp is running task 'html'");
    return gulp.src(path.app.html) //Выберем файлы по нужному пути
        .on('error', console.log)
        .pipe(include())
        .pipe(gulp.dest(path.dist.html)); //Выгружаем их в папку dist
});

gulp.task('sass', function() { // Создаем таск "sass"
    console.log("-- gulp is running task 'sass'");
    return gulp.src(path.app.scss) // Берем источник
        .on('error', console.log)
        .pipe(include())
        .pipe(sass()) // Преобразуем Sass в CSS посредством gulp-sass
        .pipe(autoprefixer({ // Вставляем префиксы для кроссбраузерности
            browsers: ['last 4 versions'],
            cascade: false
        }))
        .pipe(minifycss()) // Сжимаем CSS 
        .pipe(gulp.dest(path.dist.css)) // Выгружаем результаты в папку dist
        .pipe(browserSync.reload({ stream: true })); // Обновляем CSS на странице при изменении
});

gulp.task("js", function() {
    console.log("-- gulp is running task 'js'");
    return gulp.src(path.app.js)
        .on('error', console.log)
        .pipe(include())
        .pipe(uglify()) // Сжимаем JS файл
        .pipe(gulp.dest(path.dist.js)); // Выгружаем результаты в папку dist
});

gulp.task('browser-sync', function() { // Создаем таск browser-sync
    browserSync({ // Выполняем browser Sync
        server: { // Определяем параметры сервера
            baseDir: 'dist' // Директория для сервера - app
        },
        notify: false // Отключаем уведомления
    });
});

gulp.task('watch', ['browser-sync', 'sass'], function() {
    gulp.watch(path.watch.scss, ['sass']); // Наблюдение за scss файлами в папке scss
    gulp.watch(path.watch.html, ['html']); // Наблюдение за HTML файлами в корне проекта
    gulp.watch(path.watch.js, ['js']); // Наблюдение за JS файлами в папке js
});

/* Осталось добавить импорт и выгрузку картинок, создание спрайтов
Выгрузку шрифтов
разделить файлы и подгружать только используемое
*/