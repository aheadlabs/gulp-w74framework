const
core = require('./core'),
del = require('del').sync,
errors = require('./errors.json'),
gulp = require('gulp'),
{ logger } = require('./logger'),
newer = require('gulp-newer'),
postcss = require('gulp-postcss'),
replace = require('gulp-replace'),
sass = require('gulp-sass')
;

logger.info('Warming up styles processor...');
let _paths = core.parseArguments();
_paths = core.setPaths(_paths);
if(!_paths) throw errors.path_not_set;

const cssProcessors = [
    require('autoprefixer')(),
    require('cssnano')
];

exports.default = () => {
    // Get theme version
    const version = core.getVersionFromPackage(_paths.source_paths.root);
    logger.debug(`Theme version is ${version}`);

    let source = [`${_paths.source_paths.css}*.scss`];
    let destination = `${_paths.output_paths.dist}`;

    logger.info(`Processing styles files...`);

    return gulp.src(source).on('end', function() {
        logger.info(`Deleting styles files from ${destination}`);
        return del(`${destination}*.css`, {force: true});
    })
        .pipe(sass({
            outputStyle: 'compressed'
        })).on('end', function() {
            logger.info(`Transpiling sass files...`);
        })
        .pipe(replace('{{version}}', `${version}`)).on('end', function() {
            logger.info(`Replacing version with value: ${version}`);
        })
        .pipe(postcss(cssProcessors)).on('end', function() {
            logger.info(`Moving styles files from ${source} to ${destination}`);
        })
        .pipe(gulp.dest(destination)).on('end', function() {
            logger.info(`Finished processing styles files.`);
        });
};

exports.distWordpress = () => {
    // this.delete(`${_paths.output_wordpress_theme.dest}*.css`);
    // this.copy(`${_paths.output_paths.dist}*.css`, _paths.output_wordpress_theme.dest);
}
