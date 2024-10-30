const gulp = require('gulp');
const less = require('gulp-less');

// Compile LESS files
function compileLess() {
    return gulp.src('./src/less/**/*.less')
        .pipe(less())
        .pipe(gulp.dest('./src/css'));
}

// Watch for changes in LESS files
function watchFiles() {
    gulp.watch('./src/less/**/*.less', compileLess);
}

// Define the default task
const defaultTask = gulp.series(compileLess, watchFiles);

exports.default = defaultTask;
