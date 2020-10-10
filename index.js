const
gulp = require('gulp'),
{ logger } = require('./logger'),
watcher = require('./watcher').default
;

exports.build = gulp.series(
    require('./processor-php').default,
    require('./processor-images').rootImagesProcess,
    require('./processor-images').assetsImagesProcess,
    require('./processor-styles').default,
    require('./processor-javascript').default/*,
    require('./processor-wordpress').default*/
);

exports.watch = gulp.series(
    this.build,
    watcher
);

// TODO We are not deleting files from destination that are not in the Vinyl source, so newer() is useless.
