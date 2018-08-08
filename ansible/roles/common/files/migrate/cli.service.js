const yargs = require('yargs');

yargs
    .alias('h', 'host')
    .describe('h', 'Host name or IP address for MongoDB')
    .default('h', process.env.MONGO_HOST || 'localhost')

    .alias('p', 'port')
    .describe('p', 'Port for MongoDB')
    .default('p', process.env.MONGO_PORT || 27017)

    .alias('d', 'database')
    .describe('d', 'Database for MongoDB')
    .default('d', process.env.MONGO_DB || 'stix')

    .describe('attempts', 'Maximum number of tries to connect to Mongo')
    .default('attempts', process.env.MAX_NUM_CONNECT_ATTEMPTS || 10)

    .describe('interval', 'How many seconds between connection retries')
    .default('interval', process.env.CONNECTION_RETRY_TIME || 5)

    .help('help');

const argv = yargs.argv;

module.exports = { argv };
