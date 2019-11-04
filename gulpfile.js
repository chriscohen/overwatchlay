'use strict';

let gulp = require('gulp');
let sass = require('gulp-sass');

gulp.task('sass', function() {
    gulp.src('scss/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('public/stylesheets'));
});
