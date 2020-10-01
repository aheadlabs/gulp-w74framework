const
core = require('./core'),
del = require('del').sync,
errors = require('./errors.json'),
gulp = require('gulp'),
imagemin = require('gulp-imagemin'),
{ logger } = require('./logger'),
newer = require('gulp-newer')
;

logger.info('Warming up image processor...');
let _paths = core.parseArguments();
_paths = core.setPaths(_paths);
if(!_paths) throw errors.path_not_set;

exports.default = (done) => {
    // Copy screenshot image
    this.delete(`${_paths.output_paths.theme}screenshot.png`);
    this.copy(`${_paths.source_paths.root}screenshot.png`, `${_paths.output_paths.theme}`);

    // Copy asset images
    this.delete(`${_paths.output_paths.images}`);
    this.copy(`${_paths.source_paths.images}**/*`, `${_paths.output_paths.images}`);

    done();
};

exports.delete = (path) => {
    logger.info(`Deleting image files from ${path}`);
    return del(path, {force: true});
}

exports.copy = (source, destination) => {    
    logger.info(`Compressing and moving images from ${source} to ${destination}`);
    return gulp.src(source)
        .pipe(newer(destination))
        .pipe(imagemin({verbose: true}))
        .pipe(gulp.dest(destination));
}
