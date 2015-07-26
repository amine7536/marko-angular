var gulp = require('gulp'),
    babel = require('gulp-babel'),
    run = require('gulp-run'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps');


//gulp.task('transpile-app', function() {
//  return gulp.src('app/index.es6.js')
//    .pipe(babel())
//    .pipe(rename('index.js'))
//    .pipe(gulp.dest('app'));
//});

gulp.task('transpile-app', function () {
    return gulp.src('app/*.es6.js')
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(concat('index.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('app'));
});

/*gulp.task('run', ['default'], function () {
    return run('electron .').exec();
});*/

gulp.task('run', function () {
    return run('electron .').exec();
});

gulp.task('default', ['transpile-app']); 
