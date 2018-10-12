/*
 * Before you run this command, be sure the Mongo container is up and running.
 * 
 * The purpose of this script is to update a pre-0.3.10 Unfetter database to 0.3.10.
 */

const mongoose = require('mongoose');
const argv = require('./cli.service').argv;

/**
 * Required schemas for this update.
 */
const CapabilitySchema = mongoose.Schema({
    stix: {
        id: String,
        name: {
            type: String,
            required: [true, 'name is required'],
            index: true
        },
        category: String
    },
});


/*
 * The purpose of this function is to correct the omission of the category attribute in the Autologon capability
 * within the DoDCAR sample assessments data.
 */
function updateCapabilities(capCorrection) {
    console.log('Starting sample capability correction');
    const Capabilities = mongoose.connection.model('Stix', CapabilitySchema, capCorrection.collection);
    return new Promise((resolve, reject) => {
        Capabilities.find(capCorrection.search, (err, capabilities) => {
            if (capCorrection.testFailure === true) {
                reject('Deliberate test failure');
            } else if (err) {
                reject(`Error retrieving capabilities data: ${err}`);
            } else {
                Promise
                    .all(
                        capabilities.map(capability => new Promise((res, rej) => updateCapability(Capabilities, capability, res, rej)))
                    )
                    .then(
                        result => resolve({ migration: capCorrection.name, success: true, detail: result }),
                        error => reject({ migration: capCorrection.name, success: false, detail: error })
                    )
                    .catch(error => reject({ migration: capCorrection.name, success: false, detail: error }))
                    .finally(() => console.log('Corrections to sample capabilities complete.'));
            }
        });
    });
}

async function updateCapability(Capabilities, capability, resolve, reject) {
    await Capabilities.update(
        { 'stix.id': capability.stix.id },
        {
            $set: { 'stix.category': 'x-unfetter-category--77815162-52a2-4ce6-b5ad-b88105b6f63d' },
        }
    );
    resolve({ capability: capability.name });
}

const MIGRATIONS = [
    {
        name: 'MissingCategories',
        collection: 'stix',
        search: { 'stix.id' : 'x-unfetter-capability--46d585a6-7480-415c-b29b-5c719934f519' },
        migrator: updateCapabilities,
        testFailure: false
    },
];

(() => {

    // The maximum amount of tries mongo will attempt to connect
    const MAX_NUM_CONNECT_ATTEMPTS = argv.attempts;

    // The amount of time between each connection attempt in ms
    const CONNECTION_RETRY_TIME = argv.interval * 1000;

    let connInterval;
    let connAttempts = 0;

    // Wait for mongoose to connect before processing
    mongoose.connection.on('connected', () => {
        console.log('Connected to mongodb...');
        mongoose.set('debug', true);
        clearInterval(connInterval);
        let returnCode = 0;
        Promise.all(MIGRATIONS.map(migration => migration.migrator(migration)))
            .then(
                result => { console.debug('fulfilled', result); },
                error => { console.error('failed', error); }
            )
            .catch(error => {
                console.error(error);
                returnCode = 1;
            })
            .finally(() => {
                mongoose.connection.close(() => console.log('Mongoose connection closed.'));
                process.exit(returnCode);
            });
    });

    mongoose.connection.on('error', (err) => {
        console.log(`Mongoose connection error: ${err}`);
        if (connAttempts >= MAX_NUM_CONNECT_ATTEMPTS) {
            clearInterval(connInterval);
            console.log('Maximum number of connection attempts exceeded. Terminating program.');
            process.exit(1);
        }
    });

    connInterval = setInterval(() => {
        connAttempts += 1;
        mongoose.connect(`mongodb://${argv.host}:${argv.port}/${argv.database}`, { useMongoClient: true });
    }, CONNECTION_RETRY_TIME);

})();
