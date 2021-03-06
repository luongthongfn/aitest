var gulp = require('gulp'),
    sass = require('gulp-sass'),
    bulkSass = require('gulp-sass-bulk-import'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    includeTag = require('gulp-include-tag'),
    browserSync = require('browser-sync').create(),
    htmlbeautify = require('gulp-html-beautify'),

    babel = require('gulp-babel'),
    rename = require("gulp-rename"),

    rootProjectPath = '', /*path from root*/
    currentPath = '.',
    sassPath,
    cssPath,
    cssDestPath,
    imgPath,
    htmlPath,
    jsPath;



/*======================================================================= TASK ====*/

//get path frome agrument when call task ___ eg:  $ gulp -p t5/adone
gulp.task('setPath', function () {
    // console.log("~~",process.argv,'~~');
    rootProjectPath = rootProjectPath + process.argv[3];
    sassPath        = (currentPath || rootProjectPath) + '/scss/**/*.scss';
    includePath     = (currentPath || rootProjectPath) + '/layouts/**/*.html';
    cssPath         = (currentPath || rootProjectPath) + '/css/**/*/.css';
    cssDestPath     = (currentPath || rootProjectPath) + '/css';
    imgPath         = (currentPath || rootProjectPath) + '/img';
    htmlPath        = (currentPath || rootProjectPath) + '/*.{html,htm}';
    jsPath          = (currentPath || rootProjectPath) + '/js/*.js';
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function () {
    return gulp.src(sassPath)
        .pipe(bulkSass())
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 5 version', '> 5%']
        }))
        .pipe(sourcemaps.write('../maps'))
        .pipe(gulp.dest(cssDestPath))
        .pipe(browserSync.stream());
});


gulp.task('include', function () {
    return gulp.src('layouts/page/*.html')
        .pipe(includeTag())
        .pipe(htmlbeautify({
            indentSize: 4
        }))
        .pipe(gulp.dest('./'))
        .pipe(browserSync.stream());
});

//js
gulp.task('babel', () =>
    gulp.src('js/test.js')
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(rename(function (path) {
            path.basename += ".dist";
          }))
        .pipe(gulp.dest('js'))
);

// watch
gulp.task('watch', ['setPath', 'sass', 'include'], function () {
    // Static Server + watching scss/html/js files
    browserSync.init({
        server: currentPath || rootProjectPath,
        reloadDelay: 500
    });

    gulp.watch(sassPath, ['sass']);
    gulp.watch(includePath, ['include']);
    // gulp.watch(cssPath).on('change', browserSync.reload);
    gulp.watch(sassPath).on('change', browserSync.reload);
    gulp.watch(imgPath).on('change', browserSync.reload);
    // gulp.watch(htmlPath).on('change', browserSync.reload);
    gulp.watch(jsPath).on('change', browserSync.reload);

});

gulp.task('build', ['setPath', 'sass']);
gulp.task('default', ['watch']);