const
config = require('./config.json'),
winston = require('winston')
;

exports.logger = winston.createLogger({
    level: config.debug.level,
    format: winston.format.combine(
        winston.format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss.SSSSS'
        }),
        winston.format.label({label: config.debug.label}),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.cli(),
        winston.format.printf(({level, message, label, timestamp}) => {
            return `[${timestamp}] [${label}] [${level}]: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console()
    ]    
});
