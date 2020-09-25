const
core = require('./core'),
del = require('del'),
errors = require('./errors.json'),
gulp = require('gulp'),
{ logger } = require('./logger'),
newer = require('gulp-newer'),
version = null
;

logger.info('Warming up PHP processor...');
let _paths = core.parseArguments();
_paths = core.setPaths(_paths);

exports.delete = (paths) => {
    return del(`${paths.output_paths.theme}**/*.php`, {force: true});
}

exports.go = () => {
    if(!_paths) throw errors.path_not_set;

    const
    source = `${_paths.source_paths.src}**/*.php`,
    destination = _paths.output_paths.theme
    ;
    
    logger.info(`Moving files from ${source} to ${destination}`);
    return gulp.src(source)
        .pipe(newer(destination))
        .pipe(gulp.dest(destination));
}
