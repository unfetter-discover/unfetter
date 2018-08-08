/*
 * Before you run this command, be sure the Mongo container is up and running.
 * 
 * The purpose of this script is to update a pre-0.3.9 Unfetter database to 0.3.9.
 */

const mongoose = require('mongoose');
const argv = require('./cli.service').argv;

/**
 * Required schemas for this update.
 */
const UserSchema = mongoose.Schema({
    userName: { type: String, index: true },
    email: { type: String, index: true },
    role: { type: String, index: true },
    oauth: String,
    github: {
        id: String,
        userName: String,
        avatar_url: String
    },
    gitlab: {
        id: String,
        userName: String,
        avatar_url: String
    },
    auth: {
        service: { type: String, index: true },
        id: { type: String, index: true },
        userName: String,
        avatar_url: String
    }
});

/*
 * The purpose of this function is to update a pre-0.3.9 Unfetter user collection to 0.3.9 document model structure.
 * 
 * The old document model had these obsolete properties:
 * - `auth`       Used by the UI to determine the authentication service you used, only so it could display your avatar
 * - `github`     Data specific to your github account
 * - `gitlab`     Data specific to your gitlab account
 * 
 * Under the new document model, we recognize Unfetter will not be managing users' multiple login services. An Unfetter
 * user will only be linked to a single authentication service. The UI should not have to be informed of which service
 * you used to log in with (a process that happens in the discover-api). With that in mind, the User model now only has
 * a login (open to a better name) property:
 * - login {
 * --- service      only keeping this for re-authentication purposes
 * --- id           the ID the service knows you by; we could munge service and id together, but I like cleaner data :)
 * --- userName     the userid you identified yourself as with the service (e.g., your GitHub account name)
 * --- avatar_url   optional
 * --- auths        (open to a better name) a list of strings of what data you can access
 * }
 * 
 * The `auths` list would correspond to the `object_marking_refs` (and potentially `granular_markings`) on a STIX
 * domain object. Note the `auths` list does not include restrictions based on whatever Unfetter organizations you are
 * a member of.
 * 
 * This function will remove the `auth` property, and convert the `github` or `gitlab` property into a `login`
 * property, adding `'github'` or `'gitlab'`, respectively, as the value of the `service` property. _If it finds both
 * properties_ in the user document, it will **have** to choose one (it will go with GitHub, since it has tenure),
 * because of the uniqueness constraints on the schema (`email` and `userName`, specifically). We could add a
 * Notification to the user to let them know of a loss to one of their logins, but the feature is so young, and the
 * only people that could really use it were those that had direct access to Mongo, so I don't think we need it.
 */
function updateUserAuths(userMigration) {
    console.log('Starting user auth migrations');
    const Users = mongoose.connection.model('User', UserSchema, userMigration.collection);
    return new Promise((resolve, reject) => {
        Users.find(userMigration.search, (err, users) => {
            if (userMigration.testFailure === true) {
                reject('Deliberate test failure');
            } else if (err) {
                reject(`Error retrieving users data: ${err}`);
            } else {
                Promise
                    .all(
                        users.map(user => new Promise((res, rej) => updateUserAuth(Users, user, res, rej)))
                            .concat(new Promise((res, rej) => updateUserIndexes(Users, res, rej)))
                    )
                    .then(
                        result => resolve({ migration: userMigration.name, success: true, detail: result }),
                        error => reject({ migration: userMigration.name, success: false, detail: error })
                    )
                    .catch(error => reject({ migration: userMigration.name, success: false, detail: error }))
                    .finally(() => console.log('User auth migrations completed.'));
            }
        });
    });
}

async function updateUserAuth(Users, user, resolve, reject) {
    let login = undefined;
    if (user.github.id) {
        login = {
            service: 'github',
            id: user.github.id,
            userName: user.github.userName,
            avatar_url: user.github.avatar_url
        };
    } else if (user.gitlab.id) {
        login = {
            service: 'gitlab',
            id: user.gitlab.id,
            userName: user.gitlab.userName,
            avatar_url: user.gitlab.avatar_url
        };
    }
    if (login !== undefined) {
        await Users.update(
            { _id: user._id },
            {
                $set: { auth: login },
                $unset: { oauth: '', github: '', gitlab: '' }
            }
        );
        resolve({ user: user.userName });
    }
}

async function updateUserIndexes(Users, resolve, reject) {
    await Users.collection.dropAllIndexes((err, res) => {
        if (err) {
            reject(`Error dropping user collection indexes: ${err}`);
        }
    });
    await Users.ensureIndexes(err => {
        if (err) {
            reject(`Error recreating user collection indexes: ${err}`);
        }
    });
    resolve('User collection reindexed');
}

const MIGRATIONS = [
    {
        name: 'UserAuths',
        collection: 'user',
        search: { $or: [{ github: { $exists: true } }, { gitlab: { $exists: true } }] },
        migrator: updateUserAuths,
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
