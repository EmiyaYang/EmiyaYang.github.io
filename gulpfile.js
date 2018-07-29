const gulp = require('gulp');
const del = require('del');
const gulplog = require('gulplog');
const env = process.env.NODE_ENV || 'development';
const isProduction = () => env === 'production';

const runSequence = require('run-sequence');

const gulpLoadPlugins = require('gulp-load-plugins');
const plugins = gulpLoadPlugins();

gulp.task('clean', () => del(['./dist/**']));

gulp.task('extras', () => {
   return gulp.src('src/lib/**/*.js')
       .pipe(gulp.dest('dist/lib'));
});

gulp.task('compile:js', () => {
    return gulp.src(['src/**/*.js','!src/lib/**/*.js'])
        .pipe(plugins.babel({
            presets: ['env'],
            compact: false
        }))
        .on('error', function (err) {
            gulplog.error(err.toString());
        })
        .pipe(plugins.if(isProduction, plugins.uglify()))
        .pipe(gulp.dest('dist'));
});

gulp.task('compile:json', () => {
    return gulp.src(['src/**/*.json'])
        .pipe(plugins.jsonminify())
        .on('error', function (err) {
            gulplog.error(err.toString());
        })
        .pipe(gulp.dest('dist'))
});

gulp.task('compile:img', () => {
    return gulp.src(['src/**/*.{jpg,jpeg,png,gif,svg}'])
        .pipe(plugins.imagemin())
        .on('error', function (err) {
            gulplog.error(err.toString());
        })
        .pipe(gulp.dest('dist'));
});

gulp.task('compile:css', () => {
    return gulp.src(['src/**/*.css'])
        .pipe(plugins.cssnano())
        .on('error', function (err) {
            gulplog.error(err.toString());
        })
        .pipe(gulp.dest('dist'));
});

gulp.task('build', (callback) => {
    return runSequence(
        'clean',
        [
            'compile:json',
            'compile:js',
            'compile:css',
            'compile:img'
        ],
        'extras',
        callback
    );
});

gulp.task('watch', ['build'], () => {
    gulp.watch('src/**/*.js', ['compile:js']);
    gulp.watch('src/**/*.css', ['compile:css']);
    gulp.watch('src/**/*.json', ['compile:json']);
    gulp.watch('src/**/*.{jpe?g,png,gif,svg}', ['compile:img']);
});