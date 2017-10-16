var gulp = require('gulp'), // Подключаем Gulp
    sass = require('gulp-sass'), //Подключаем Sass пакет,
    browserSync = require('browser-sync'), // Подключаем Browser Sync (сервер)
    include = require('gulp-include'), // Подключаем gulp-include (для объединения файлов)
    uglify = require('gulp-uglifyjs'), // Подключаем gulp-uglifyjs (для сжатия JS)
    minifycss = require('gulp-minify-css'), // Подключаем gulp-minify-css (для сжатия css)
    cleancss = require('gulp-clean-css'), // Подключаем gulp-clean-css (для разворачивания css из сжатого вида)
    autoprefixer = require('gulp-autoprefixer'), // Подключаем gulp-autoprefixer (автоматически добавляет префиксы в css)
    del = require('del'), // Подключаем библиотеку для удаления файлов и папок;
    imagemin = require('gulp-imagemin'), // Сжатие картинок
    pngquant = require('imagemin-pngquant'), // Дополнение к предыдущему плагину с возможностью сжимать png
    spritesmith = require('gulp.spritesmith'), // Создание спрайтов
    sourcemaps = require('gulp-sourcemaps');

var path = {
    dist: { //Тут мы укажем куда складывать готовые после сборки файлы
        html: 'dist/',
        js: 'dist/js/',
        css: 'dist/css/',
        img: 'dist/img/',
        sprite_css: 'app/scss/partials',
        temp: 'dist/temp/', //Временная директория, после сборки удаляется
        fonts: 'dist/fonts/'
    },
    app: { //Пути откуда брать исходники
        html: 'app/*.html', //Синтаксис app/*.html говорит gulp что мы хотим взять все файлы с расширением .html
        js: 'app/js/main.js', //В стилях и скриптах нам понадобятся только main файлы
        scss: 'app/scss/main.scss',
        img: 'app/img/**/*.*', //Синтаксис img/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
        sprite: 'app/img_sprite/**/*.*', //Синтаксис img/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
        fonts: 'app/fonts/**/*.*'
    },
    watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
        html: 'app/**/*.html',
        js: 'app/js/**/*.js',
        scss: 'app/scss/**/*.scss',
        img: 'app/img/**/*.*',
        sprite: 'app/img_sprite/**/*.*',
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
        .pipe(gulp.dest(path.dist.css)) // Выгружаем результаты в папку dist
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task("js", function() {
    console.log("-- gulp is running task 'js'");
    return gulp.src(path.app.js)
        .on('error', console.log)
        .pipe(include())
        .pipe(gulp.dest(path.dist.js)); // Выгружаем результаты в папку dist
});

gulp.task('sprite', function() {
    console.log("-- gulp is running task 'sprite'");
    var spriteData = gulp.src(path.app.sprite) // путь, откуда берем картинки для спрайта
        .pipe(spritesmith({
            imgName: 'sprite.png',
            cssFormat: 'scss',
            cssName: 'sprite.scss',
        }));
    spriteData.img.pipe(gulp.dest(path.dist.img)); // путь, куда сохраняем спрайт
    spriteData.css.pipe(gulp.dest(path.dist.sprite_css)); // путь, куда сохраняем стили
});

gulp.task('img', function() {
    console.log("-- gulp is running task 'img'");
    gulp.src(path.app.img)
        .pipe(gulp.dest(path.dist.img)); //Перебрасываем все картинки в dist
});

gulp.task('fonts', function() {
    console.log("-- gulp is running task 'fonts'");
    gulp.src(path.app.fonts)
        .pipe(gulp.dest(path.dist.fonts)); //Перебрасываем все шрифты в dist
});

gulp.task('browser-sync', function() { // Создаем таск browser-sync
    browserSync({ // Выполняем browser Sync
        server: { // Определяем параметры сервера
            baseDir: 'dist' // Директория для сервера - app
        },
        notify: false // Отключаем уведомления
    });
});

gulp.task('clean', function() {
    return del.sync('dist'); // Удаляем папку dist перед сборкой
});

gulp.task('build', [
    'clean',
    'browser-sync',
    'html',
    'img',
    'sprite',
    'sass',
    'js',
    'fonts'
]);


gulp.task('minimize:all', function() {
    console.log("-- gulp is running task 'minimize:img'");
    gulp.src(path.dist.img + '**/*.*') //Выберем наши картинки в dist
        .pipe(imagemin({ //Сожмем их
            progressive: true,
            svgoPlugins: [{ removeViewBox: false }],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.dist.img)); //И бросим туда же

    console.log("-- gulp is running task 'minimize:css'");
    gulp.src(path.dist.css + '**/*.*')
        .pipe(minifycss()) // Сжимаем CSS 
        .pipe(gulp.dest(path.dist.css)) //И бросим туда же


    console.log("-- gulp is running task 'minimize:js'");
    gulp.src(path.dist.js + '**/*.*')
        .pipe(uglify()) // Сжимаем JS файл
        .pipe(gulp.dest(path.dist.js)); // Выгружаем результаты назад в папку dist
});

gulp.task('watch:all', function() {
    gulp.watch(path.watch.img, ['img']); // Наблюдение за картинками в папке img
    gulp.watch(path.watch.sprite, ['sprite']); // Наблюдение за картинками в папке img_sprite
    gulp.watch(path.watch.scss, ['sass']); // Наблюдение за scss файлами в папке scss
    gulp.watch(path.watch.html, ['html']); // Наблюдение за HTML файлами в корне проекта
    gulp.watch(path.watch.js, ['js']); // Наблюдение за JS файлами в папке js
    gulp.watch(path.watch.fonts, ['fonts']); // Наблюдение за fonts файлами в папке js
});

gulp.task('watch', [
    'build',
    'watch:all'
]);

gulp.task('final', [
    'build',
    'minimize:all'
]);

/* 
разделить файлы css и js и подгружать только используемое
*/