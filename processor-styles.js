const
core = require('./core'),
del = require('del').sync,
gulp = require('gulp'),
{ logger } = require('./logger'),
newer = require('gulp-newer'),
postcss = require('gulp-postcss'),
replace = require('gulp-replace'),
sass = require('gulp-sass')
;

let _paths;

logger.info('Warming up styles processor...');
_paths = core.getPaths();

const cssProcessors = [
    require('autoprefixer')(),
    require('cssnano')
];

exports.default = () => {
    logger.info('##### STYLES #####');

    // Get theme version
    const version = core.getVersionFromPackage(_paths.source_paths.root);
    logger.debug(`Theme version is ${version}`);

    let source = [`${_paths.source_paths.css}*.scss`];
    let destination = `${_paths.output_paths.dist}`;

    logger.info(`Processing styles files...`);

    return gulp.src(source).on('end', () => {
            logger.info(`Deleting styles files from ${destination}`);
            return del(`${destination}*.css`, {force: true});
        }).on('end', () => logger.info('Transpiling SASS files...'))
        .pipe(sass({
            outputStyle: 'compressed'
        })).on('end', function() {
            logger.info('Transpiled SASS files');
        })
        .pipe(replace('{{version}}', `${version}`)).on('end', () => {
            logger.info(`Replacing version with value: ${version}`);
        })
        .pipe(postcss(cssProcessors)).on('end', () => {
            logger.info(`Moving styles files from ${source} to ${destination}`);
        })
        .pipe(gulp.dest(destination)).on('end', () => {
            logger.info(`Finished processing style files.`);
        });
};

exports.distWordpress = () => {
    this.delete(`${_paths.output_wordpress_theme.dest}*.css`);
    this.copy(`${_paths.output_paths.dist}*.css`, _paths.output_wordpress_theme.dest);
}
