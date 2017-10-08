var gulp = require('gulp'), // Подключаем Gulp
    sass = require('gulp-sass'), //Подключаем Sass пакет,
    browserSync = require('browser-sync'); // Подключаем Browser Sync

var path = {
    dist: { //Тут мы укажем куда складывать готовые после сборки файлы
        html: 'dist/',
        js: 'dist/js/',
        css: 'dist/css/',
        img: 'dist/img/',
        fonts: 'dist/fonts/'
    },
    app: { //Пути откуда брать исходники
        html: 'app/**/*.html', //Синтаксис app/*.html говорит gulp что мы хотим взять все файлы с расширением .html
        js: 'app/js/**/*.js', //В стилях и скриптах нам понадобятся только main файлы
        scss: 'app/scss/**/*.scss',
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
    gulp.src(path.app.html) //Выберем файлы по нужному пути
        .pipe(gulp.dest(path.dist.html)); //Выгружаем их в папку dist
});


gulp.task('sass', function() { // Создаем таск "sass"
    return gulp.src(path.app.scss) // Берем источник
        .pipe(sass()) // Преобразуем Sass в CSS посредством gulp-sass
        .pipe(gulp.dest('app/css')) // Выгружаем результата в папку app/css
        .pipe(browserSync.reload({ stream: true })) // Обновляем CSS на странице при изменении
});

gulp.task('watch:html', ['browser-sync', 'html'], function() {
    gulp.watch(path.watch.html, ['html']); // Наблюдение за html файлами
    // Наблюдение за другими типами файлов
});

gulp.task('watch:sass', ['browser-sync', 'sass'], function() {
    gulp.watch(path.watch.scss, ['scss']); // Наблюдение за sass файлами
    // Наблюдение за другими типами файлов
});

gulp.task('browser-sync', function() { // Создаем таск browser-sync
    browserSync({ // Выполняем browser Sync
        server: { // Определяем параметры сервера
            baseDir: 'app' // Директория для сервера - app
        },
        notify: false // Отключаем уведомления
    });
});