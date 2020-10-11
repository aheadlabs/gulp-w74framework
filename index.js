const
gulp = require('gulp'),
{ logger } = require('./logger'),
processorPhp = require('./processor-php'),
processorImages = require('./processor-images'),
watcher = require('./watcher').default
;

exports.build = gulp.series(
    processorPhp.do,
    processorImages.do/*,
    require('./processor-styles').default,
    require('./processor-javascript').default*/
);

exports.watch = gulp.series(
    this.build,
    watcher
);

// TODO We are not deleting files from destination that are not in the Vinyl source, so newer() is useless.
