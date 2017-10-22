/*

Gulp build 
by Helen Gaiuk
helengaiuk.github.io

*/


var gulp = require('gulp'), // Connect Gulp
    sass = require('gulp-sass'), //Connect Sass package,
    browserSync = require('browser-sync'), // Connect Browser Sync live realtime desktop http server
    include = require('gulp-include'), // Connect gulp-include (to merge files)
    uglify = require('gulp-uglifyjs'), // Connect gulp-uglifyjs (to minify JS)
    minifycss = require('gulp-minify-css'), // Connect gulp-minify-css (to compressed css)
    cleancss = require('gulp-clean-css'), // Connect gulp-clean-css (makes normall full view css from a compressed view)
    autoprefixer = require('gulp-autoprefixer'), // Connect gulp-autoprefixer (automatically adds prefixes to css)
    del = require('del'), // Connect the library to delete files and folders;
    imagemin = require('gulp-imagemin'), // Image Compression
    pngquant = require('imagemin-pngquant'), // Addition to the previous plugin with the ability to compress png
    spritesmith = require('gulp.spritesmith'), // Creating sprites
    svgSprite = require("gulp-svg-sprites"), // Creating svg sprites
    svgmin = require('gulp-svgmin'), // compress svg sprites
    uncss = require('gulp-uncss'), //Removes unused in project css code 
    sourcemaps = require('gulp-sourcemaps'),
    fs = require('fs'); //node filesystem

var path = {
    dist: { //folder of the finished project - distributive
        html: 'dist/',
        js: 'dist/js/',
        css: 'dist/css/',
        img: 'dist/img/',
        sprite_css: 'app/scss/partials/',
        sprite_svg: 'dist/img/sprite.svg',
        sprite_svg_css: 'app/scss/partials/_sprite_svg.scss',
        fonts: 'dist/fonts/'
    },
    app: { //folder of working files of the project - application
        html: [
            'app/**/*.html', //include all html files in all folders
            '!app/_template/*.*' //exclude templates folder
        ],
        js: 'app/js/main.js', //include only the main js file, which is already compiled from other files
        scss: 'app/scss/main.scss', //include only the main scss file, which is already compiled from other files
        img: [
            'app/img/**/*.*', //include all files in the child directories in the 'img' folder
            '!app/img/sprite/*.*' //exclude 'sprite' folder
        ],
        sprite: [
            'app/img/sprite/**/*.*', //include all image files in the child directories in the 'sprite' folder
            '!app/img/sprite/**/*.svg' //exclude 'svg' files
        ],
        sprite2x: 'app/img/sprite/**/*@2x.*', //include all retina image files in the child directories in the 'sprite' folder with this mask 
        sprite_svg: 'app/img/sprite/**/*.svg', //include all svg image files in the 'sprite' folder
        fonts: 'app/fonts/**/*.*' //include all files in the child directories in the 'fonts' folder
    },
    watch: { //what files we want to watch
        html: 'app/**/*.html', //watch all html files in all folders
        js: 'app/js/**/*.js', //watch all files in the child directories in the 'js' folder
        scss: [
            'app/scss/**/*.scss', //watch all scss files in the child directories in the 'scss' folder
            '!app/scss/**/_*.scss' //except 'mixins' files
        ],
        img: [
            'app/img/**/*.*', //watch all files in the child directories in the 'img' folder
            '!app/img/sprite/**/*.*' //except 'sprite' folder
        ],
        sprite: [
            'app/img/sprite/**/*.*' //watch all files in the child directories in the 'sprite' folder
            //'!app/img/sprite/**/*.svg' //except 'svg' files
        ],
        //sprite_svg: 'app/img/sprite/**/*.svg', //watch all svg files in the 'sprite' folder
        fonts: 'app/fonts/**/*.*' //watch all files in the child directories in the 'fonts' folder
    }
};

gulp.task('html', function() { //create task 'html', that deploy html files from the templates
    console.log("-- gulp is running task 'html'");
    return gulp.src(path.app.html) //take all source html files (templates or full, no matter)
        .on('error', console.log) //if an error write log to console
        .pipe(include()) //run plugin that merge templates
        .pipe(gulp.dest(path.dist.html)) //save all merged files to distributive
        .pipe(browserSync.reload({ stream: true })); //reaload server to see changes in browser
});

gulp.task('sass', function() { //create task 'sass', that deploy sass files from the partials and mixins and finaly compile to css
    console.log("-- gulp is running task 'sass'");
    return gulp.src(path.app.scss) //take main scss file
        .on('error', console.log)
        .pipe(include()) //run plugin that merge mixins and partials to main file
        .pipe(sass()) //compile css file from sass
        .pipe(autoprefixer([ //add prefixes
            'Android 2.3',
            'Android >= 4',
            'Chrome >= 20',
            'Firefox >= 24', // Firefox 24 is the latest ESR
            'Explorer >= 8',
            'iOS >= 6',
            'Opera >= 12',
            'Safari >= 6'
        ]))
        .pipe(gulp.dest(path.dist.css)) //save merged main file to distributive
        .pipe(browserSync.reload({ stream: true })); //reaload server to see changes in browser
});

gulp.task("js", function() { //create task 'js', that deploy js files from the partials and mixins 
    console.log("-- gulp is running task 'js'");
    return gulp.src(path.app.js) //take main js file
        .on('error', console.log)
        .pipe(include()) //run plugin that merge partials to main file
        .pipe(gulp.dest(path.dist.js)) //save merged main file to distributive
        .pipe(browserSync.reload({ stream: true })); //reaload server to see changes in browser
});

gulp.task('img', function() { //create task 'img', that transfer images from application to distributive
    console.log("-- gulp is running task 'img'");
    gulp.src(path.app.img) //take all files in the 'img' folder except sprite folder
        .pipe(gulp.dest(path.dist.img)) //save they to distributive
        .pipe(browserSync.reload({ stream: true })); //reaload server to see changes in browser
});

gulp.task('sprite:img', function() { //create task 'sprite', that generate one image sprite from many image files
    console.log("-- gulp is running task 'sprite:img'");
    var spriteData = gulp.src(path.app.sprite) //take all files in the 'sprite' 
        .pipe(spritesmith({ //using the spritesmith plugin
            retinaSrcFilter: path.app.sprite2x, //filter for retina images
            imgName: 'sprite.png', //sprite image file name
            retinaImgName: 'sprite@2x.png', //retina sprite image file name
            //cssFormat: 'scss', //format of the sprite stylesheet
            cssName: '_sprite.scss', //sprite stylesheet file name 
        }));
    spriteData.img
        .pipe(gulp.dest(path.dist.img)) //save generated sprite image to distributive
        .pipe(browserSync.reload({ stream: true })); //reaload server to see changes in browser
    spriteData.css
        .pipe(gulp.dest(path.dist.sprite_css)); //save sprite stylesheet to distributive

});

gulp.task('sprite:svg', function() {
    console.log("-- gulp is running task 'sprite:svg'");
    var test = gulp.src(path.dist.sprite_svg);
    gulp.src(path.app.sprite_svg)
        .pipe(svgSprite({
            templates: { scss: true },
            cssFile: "../" + path.dist.sprite_svg_css,
            svg: {
                sprite: "../" + path.dist.sprite_svg
            },
            preview: false
        }))
        .pipe(gulp.dest(path.dist.html));
});

gulp.task('sprite', ['sprite:img', 'sprite:svg']);

gulp.task('fonts', function() { //create task 'fonts', that transfer fonts from application to distributive
    console.log("-- gulp is running task 'fonts'");
    gulp.src(path.app.fonts) //take all files in the 'fonts' folder
        .pipe(gulp.dest(path.dist.fonts)) //save they to distributive
        .pipe(browserSync.reload({ stream: true })); //reaload server to see changes in browser
});

gulp.task('clean', function() { //create task 'clean' which cleans distributive folder before compilation
    del.sync('dist'),
        del.sync(path.dist.sprite_css + "*sprite*.*"); //delete the dist folder    
});

gulp.task('browser-sync', function() { //create task 'browser-sync' which starts the server
    browserSync({ //start browser Sync
        server: { //define server parameters
            baseDir: 'dist' //server folder - distributive
        },
        notify: false //disable notifications
    });
});

gulp.task('build', [ //create task 'build' which compile project to distributive
    'clean',
    'browser-sync',
    'html',
    'img',
    'sprite',
    'sass',
    'js',
    'fonts'
]);


gulp.task('watch', ['build'], function() { //create MAIN TASK 'watch' which compile project to distributive and watching out for changes in real time. Compile fast but there is no filesize optimization
    gulp.watch(path.watch.img, ['img']);
    gulp.watch(path.watch.sprite, ['sprite']);
    gulp.watch(path.watch.scss, ['sass']);
    gulp.watch(path.watch.html, ['html']);
    gulp.watch(path.watch.js, ['js']);
});

gulp.task('final', ['build'], function() { //create MAIN TASK 'final' which compile project to distributive, compress all images, js and css files, and also removes unused classes from stylesheet 
    console.log("-- gulp is running task 'minimize:img'");
    gulp.src(path.dist.img + '**/*.*') //take all image files from distributive
        .pipe(imagemin({ //compress images
            progressive: true,
            svgoPlugins: [{ removeViewBox: false }],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.dist.img)); //save they to distributive

    console.log("-- gulp is running task 'minimize:svg'");
    gulp.src(path.dist.img + '**/*.svg') //take all svg files from distributive
        .pipe(svgmin()) //compress svg images
        .pipe(gulp.dest(path.dist.img)); //save they to distributive

    console.log("-- gulp is running task 'minimize:css'");
    gulp.src(path.dist.css + '**/*.*') //take css files from distributive
        .pipe(uncss({ html: [path.dist.html + '**/*.html'] })) //this plugin see all used stylesheet classes in html files and also removes unused classes from css
        .pipe(minifycss()) //compress css
        .pipe(gulp.dest(path.dist.css)) //save to distributive

    console.log("-- gulp is running task 'minimize:js'"); //take js files from distributive
    gulp.src(path.dist.js + '**/*.*')
        .pipe(uglify()) // compress js
        .pipe(gulp.dest(path.dist.js)); //save to distributive
});