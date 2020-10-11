const
core = require('./core'),
filter = require('gulp-filter'),
gulp = require('gulp'),
imagemin = require('gulp-imagemin'),
{ logger } = require('./logger'),
print = require('gulp-print').default
;

let 
_paths,
_source,
_destination_root,
_destination_assets,
_wordpress_root,
_wordpress_assets,
_onlyScreenshot,
_onlyScreenshotWp,
_allButScreenshot,
_allButScreenshotWp
;

exports.deployToWordpress = gulp.series(deleteWordpressFiles, copyWordpressFiles);
exports.do = gulp.series(up, deleteDistFiles, processDistFiles, this.deployToWordpress, down);

function up(done) {
    logger.info('##### IMAGES #####');
    logger.info('Warming up...');
    _paths = core.getPaths();
    _source = [
        `${_paths.source_paths.root}screenshot.png`,
        `${_paths.source_paths.images}**/*`
    ];
    _destination_root = `${_paths.output_paths.dist}`;
    _destination_assets = `${_paths.output_paths.images}`;
    _wordpress_root = `${_paths.output_wordpress_theme.dest}`;
    _wordpress_assets = `${_paths.output_wordpress_theme.images}`;
    _onlyScreenshot = filter(['screenshot.png'], { restore: true });
    _onlyScreenshotWp = filter(['**/screenshot.png'], { restore: true });
    _allButScreenshot = filter(['**/*', '!**/screenshot.png']);
    _allButScreenshotWp = filter(['**/*', '!**/screenshot.png']);
    done();
}

function down(done) {
    logger.info('##### --- #####');
    done();
}

function deleteDistFiles(done) {
    core.deleteFiles(_destination_root, 'screenshot.png');
    core.deleteFiles(_destination_assets, '**/*');
    done();
}

function processDistFiles() {
    return gulp.src(_source)
        .on('end', () => logger.info('Compressing images...'))
        .pipe(imagemin({verbose: true}))
        .on('end', () => logger.info(`Copying images to ${_destination_root}...`))
        .pipe(_onlyScreenshot)
        .pipe(gulp.dest(_destination_root))
        .pipe(_onlyScreenshot.restore)
        .on('end', () => logger.info(`Copying images to ${_destination_assets}...`))
        .pipe(_allButScreenshot)
        .pipe(gulp.dest(_destination_assets))
        .on('end', () => logger.info(`Finished processing images.`))
    ;
}

function deleteWordpressFiles(done) {
    core.deleteFiles(_wordpress_root, 'screenshot.png');
    core.deleteFiles(_wordpress_assets, '**/*');
    done();
}

function copyWordpressFiles() {
    logger.info(_destination_root);
    logger.info(_wordpress_root);
    return gulp.src([
            `${_destination_root}screenshot.png`,
            `${_destination_assets}**/*`
        ])
        .on('end', () => logger.info(`Copying screenshot.png to WordPress...`))
        .pipe(_onlyScreenshotWp)
        .pipe(gulp.dest(_wordpress_root))
        .pipe(_onlyScreenshotWp.restore)
        .on('end', () => logger.info(`Copying asset images to WordPress...`))
        .pipe(_allButScreenshotWp)
        .pipe(gulp.dest(_wordpress_assets))
        .on('end', () => logger.info('Finished deployment of images.'))
    ;
}
