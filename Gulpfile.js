var gulp = require('gulp'),
    babel = require('gulp-babel'),
    run = require('gulp-run');
    concat = require('gulp-concat');
var uglify = require('gulp-uglify');


//gulp.task('transpile-app', function() {
//  return gulp.src('app/index.es6.js')
//    .pipe(babel())
//    .pipe(rename('index.js'))
//    .pipe(gulp.dest('app'));
//});

gulp.task('transpile-app', function () {
    return gulp.src('app/es6/*.js')
        .pipe(babel())
        .pipe(gulp.dest('app/'));
});

/*gulp.task('run', ['default'], function () {
    return run('electron .').exec();
});*/

gulp.task('run', ['default'], function () {
    return run('electron .').exec();
});

gulp.task('concat-app', function() {
    return gulp.src('app/*.js')
        .pipe(concat('application.js'))
        .pipe(uglify())
        .pipe(gulp.dest('app/'));
});

gulp.task('default', ['transpile-app']);
