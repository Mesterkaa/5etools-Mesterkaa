import winston from "winston"

export var logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(info => {
            return `${info.timestamp} ${info.level}: ${info.message}`;
        })
    ),
    transports: [
		new winston.transports.Console({
			level: 'info',
			format: winston.format.combine(
			  winston.format.colorize(),
			  winston.format.simple()
			)
		 }),
        new winston.transports.File({ filename: '../app.log' })
    ]
});
