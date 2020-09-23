const
del = require('del'),
errors = require('./errors.json'),
gulp = require('gulp'),
{ logger } = require('./logger'),
newer = require('gulp-newer')
;

let _paths = null;

exports.paths = (paths) => _paths = paths;

exports.delete = (paths) => {
    return del(`${paths.output_paths.theme}**/*.php`, {force: true});
}

exports.go = () => {    
    const
    source = `${_paths.source_paths.src}**/*.php`,
    destination = _paths.output_paths.theme
    ;

    if(!_paths) throw errors.path_not_set;

    logger.info(`Moving files from ${source} to ${destination}`);
    return gulp.src(source)
        .pipe(newer(destination))
        .pipe(gulp.dest(destination));
}
