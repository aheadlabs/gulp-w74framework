const
core = require('./core'),
del = require('del').sync,
errors = require('./errors.json'),
gulp = require('gulp'),
{ logger } = require('./logger'),
processorRootImages = require('./processor-images').rootImagesProcess,
processorAssetsImages = require('./processor-images').assetsImagesProcess,
processorPhp = require('./processor-php').default,
processorStyles = require('./processor-styles').default,
tools = require('./tools')
;

let
browsersync = false,
_paths
;

logger.info('Warming up watching engine...');
_paths = core.getPaths();

exports.do = (done) => {
    // Create and set up BrowserSync instance
    if(!browsersync) {
        browsersync = require('browser-sync').create();

        browsersync.init({
            // files: [
            //     paths.styles.srcScss
            // ],
            ghostMode: {
                clicks: true,
                forms: true,
                location: true,
                scroll: true
            },
            injectChanges: false,
            proxy: _paths.parameters.dev_proxy,
            ui: {
                port: 8000
            }
        });
    }

    // Watch for files and fire actions accordingly
    gulp.watch(
        `${_paths.source_paths.src}**/*.php`, 
        {}, gulp.series(processorPhp, reload)
    );
    gulp.watch([
            `${_paths.source_paths.root}screenshot.png`, 
            `${_paths.source_paths.images}**/*`
        ], 
        {}, gulp.series(processorRootImages, processorAssetsImages, reload)
    );
    gulp.watch(
        `${_paths.source_paths.css}*.*css`, 
        {}, gulp.series(processorStyles, reload)
    );

    done();
};

function reload(done) {
    if (browsersync) {
        browsersync.reload();
        done();
    }
}
