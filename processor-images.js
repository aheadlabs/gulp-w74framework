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

exports.rootImagesProcess = () => {
    logger.info(`Processing root image files...`);
     return gulp.src(`${_paths.source_paths.root}screenshot.png`).on('end', function() {
        logger.info(`Deleting image files from ${_paths.output_paths.dist}`);
        return del(`${_paths.output_paths.dist}screenshot.png`, {force: true});
    })
        .pipe(imagemin({verbose: true})).on('end', function() {
             logger.info(`Finished minifying image files.`);
             logger.info(`Moving images from ${_paths.source_paths.root} to ${_paths.output_paths.dist}`);
         })
        .pipe(gulp.dest(`${_paths.output_paths.dist}`)).on('end', function() {
             logger.info(`Finished processing root images`);
         });
}

exports.assetsImagesProcess = () => {
    logger.info(`Processing assets image files...`);
    return gulp.src(`${_paths.source_paths.images}**/*`).on('end', function() {
        logger.info(`Deleting image files from ${_paths.output_paths.images}`);
        return del(`${_paths.output_paths.images}**/*`, {force: true});
    })
        .pipe(imagemin({verbose: true})).on('end', function() {
            logger.info(`Finished minifying image files.`);
            logger.info(`Moving images from ${_paths.source_paths.images} to ${_paths.output_paths.images}`);
        })
        .pipe(gulp.dest(`${_paths.output_paths.images}`));
}


exports.distWordpress = () => {
    // this.delete(`${_paths.output_wordpress_theme.dest}screenshot.png`);
    // this.copy(`${_paths.source_paths.root}screenshot.png`, _paths.output_wordpress_theme.dest);
    // this.delete(`${_paths.output_wordpress_theme.images}`);
    // this.copy(`${_paths.source_paths.images}**/*`, _paths.output_wordpress_theme.images);
}
