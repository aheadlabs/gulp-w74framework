const
core = require('./core'),
gulp = require('gulp'),
{ logger } = require('./logger'),

processorPhp = require('./processor-php'),
processorImages = require('./processor-images'),
processorStyles = require('./processor-styles'),
processorFonts = require('./processor-fonts'),
processorJavascript = require('./processor-javascript')
;

let
browsersync = false,
_paths
;

logger.info('##### WATCH ENGINE #####');
logger.info('Warming up...');
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
        {}, gulp.series(processorPhp.do, reload)
    );
    gulp.watch([
            `${_paths.source_paths.root}screenshot.png`,
            `${_paths.source_paths.images}**/*`
        ],
        {}, gulp.series(processorImages.do, reload)
    );
    gulp.watch(
        `${_paths.source_paths.css}**/*.*css`,
        {}, gulp.series(processorStyles.do, reload)
    );
    gulp.watch(
        `${_paths.source_paths.fonts}*.*`, //{ttf, otf, eot, woff, woff2, svg}
        {}, gulp.series(processorFonts.do, reload)
    );
    gulp.watch(
        `${_paths.source_paths.js}**/*.js`,
        {}, gulp.series(processorJavascript.do, reload)
    );

    done();
};

function reload(done) {
    if (browsersync) {
        browsersync.reload();
        done();
    }
}
