const
del = require('del'),
gulp = require('gulp'),
{ logger } = require('./logger'),
newer = require('gulp-newer')
;

exports.delete = (paths) => {
    return del(`${paths.output_paths.theme}**/*.php`, {force: true});
}

exports.go = (paths) => {
    const
    source = `${paths.source_paths.src}**/*.php`,
    destination = paths.output_paths.theme
    ;

    logger.info(`Moving files from ${source} to ${destination}`);
    return gulp.src(source)
        .pipe(newer(destination))
        .pipe(gulp.dest(destination));
}
