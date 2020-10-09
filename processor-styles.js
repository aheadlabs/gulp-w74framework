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

exports.default = (done) => {
    // Get theme version
    const version = core.getVersionFromPackage(_paths.source_paths.root);
    logger.debug(`Theme version is ${version}`);

    // Delete output files
    this.delete(`${_paths.output_paths.dist}*.css`);

    // Transpile SCSS files
    this.transpileScss(`${_paths.source_paths.css}*.scss`, `${_paths.output_paths.dist}`, version);
    logger.debug('Bootstrap SCSS files are @include-d in the styles.scss file from the node_modules sources.');
    logger.debug('Finished transpilation of styles');

    done();
};

exports.delete = (path) => {
    logger.info(`Deleting CSS files from ${path}`);
    return del(path, {force: true});
}

exports.transpileScss = (source, destination, version) => {
    logger.info(`Transpiling SCSS files from ${source} to ${destination}`);
    return gulp.src(source)
        .pipe(sass({
            outputStyle: 'compressed'
        }))
        .pipe(replace('{{version}}', `${version}`))
        .pipe(postcss(cssProcessors))
        .pipe(newer(destination))
        .pipe(gulp.dest(destination));
}

exports.copy = (source, destination) => {
    logger.info(`Copying styles from ${source} to ${destination}`);
    return gulp.src(source)
        .pipe(newer(destination))
        .pipe(gulp.dest(destination));
}

exports.distWordpress = () => {
    this.delete(`${_paths.output_wordpress_theme.dest}*.css`);
    this.copy(`${_paths.output_paths.dist}*.css`, _paths.output_wordpress_theme.dest);
}
