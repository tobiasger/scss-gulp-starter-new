const gulp = require('gulp');
const sass = require('gulp-sass');
const del = require('del');
var gulp_concat = require('gulp-concat');
var gulp_rename = require('gulp-rename');
var gulp_uglify = require('gulp-uglify');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var pipeline = require('readable-stream').pipeline;

gulp.task('styles', () => {
    return gulp.src('src/sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./css/'));
});

gulp.task('css-uglify', () => {
    return gulp.src('css/*.css')
    .pipe(autoprefixer({
        cascade: false}))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('./css'));
})

gulp.task('js-uglify', function(){
    return gulp.src(['./src/js/**/*.js']) //Use wildcards to select all files in a particular folder or be specific
        .pipe(gulp_concat('concat.js')) //this will concat all the files into concat.js
        .pipe(gulp.dest('./js/temp/')) //this will save concat.js in a temp directory defined above
        .pipe(gulp_rename('app.js')) //this will rename concat.js to app.js
        .pipe(gulp_uglify()) //this will uglify/minify app.js
        .pipe(gulp.dest('./js/')); //this will save app.js into destination Directory defined above
});

gulp.task('clean', () => {
    return del([
        'css/main.css'
    ]);
});

gulp.task('remove-js-temp', () => {
    return del([
        'js/temp'
    ])
})

gulp.task('default', gulp.series(['clean', 'styles', 'css-uglify', 'js-uglify']));

gulp.task('watch', () => {
    gulp.watch('src/sass/**/*.scss', (done) => {
        gulp.series(['clean', 'styles', 'css-uglify'])(done);
    });
    gulp.watch('src/js/**/*.js', (done) => {
        gulp.series(['js-uglify', 'remove-js-temp'])(done);
    });
});