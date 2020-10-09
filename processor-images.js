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

exports.default = () => {

    // Set the source and destination files
    let source = [`${_paths.source_paths.root}screenshot.png`, `${_paths.source_paths.images}**/*`]
    let destination = [`${_paths.output_paths.dist}`, `${_paths.output_paths.images}`]

    logger.info(`Processing images...`);

    // Process
    return gulp.src(source).on('end', function() {
        logger.info(`Deleting image files...`);
        return del(source, {force: true});
    }).pipe(imagemin({verbose: true}))
        .pipe(gulp.dest(destination[0]))
        .pipe(gulp.dest(destination[1]));

    // Copy screenshot image
    // await this.delete(`${_paths.output_paths.dist}screenshot.png`);
    // await this.copy(`${_paths.source_paths.root}screenshot.png`, `${_paths.output_paths.dist}`);

    // Copy asset images
    // await this.delete(`${_paths.output_paths.images}`);
    // await this.copy(`${_paths.source_paths.images}**/*`, `${_paths.output_paths.images}`);
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

exports.distWordpress = () => {
    this.delete(`${_paths.output_wordpress_theme.dest}screenshot.png`);
    this.copy(`${_paths.source_paths.root}screenshot.png`, _paths.output_wordpress_theme.dest);
    this.delete(`${_paths.output_wordpress_theme.images}`);
    this.copy(`${_paths.source_paths.images}**/*`, _paths.output_wordpress_theme.images);
}
