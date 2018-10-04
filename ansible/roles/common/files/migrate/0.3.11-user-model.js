/*
 * Before you run this command, be sure the Mongo container is up and running.
 * 
 * The purpose of this script is to update a pre-0.3.11 Unfetter database to 0.3.11.
 */

const mongoose = require('mongoose');
const argv = require('./cli.service').argv;

/* Array of NTCTF attack patterns mapped to ATT&CK attack patterns */
const mappedDict = [
    { "ntctf_phase_name": "presence - installation | execution", "ntctf_ap_name": "Command line", "attack_phase_name": "execution", "attack_ap_name": "Command-Line Interface" },
    { "ntctf_phase_name": "presence - installation | execution", "ntctf_ap_name": "OS APIs to facilitate launch", "attack_phase_name": "execution", "attack_ap_name": "Execution through API" },
    { "ntctf_phase_name": "presence - installation | execution", "ntctf_ap_name": "Scheduled task", "attack_phase_name": "execution", "attack_ap_name": "Scheduled Task" },
    { "ntctf_phase_name": "presence - installation | execution", "ntctf_ap_name": "Execute via service controller", "attack_phase_name": "execution", "attack_ap_name": "Service Execution" },
    { "ntctf_phase_name": "presence - installation | execution", "ntctf_ap_name": "Third party software", "attack_phase_name": "execution", "attack_ap_name": "Third-party Software" },
    { "ntctf_phase_name": "presence - installation | execution", "ntctf_ap_name": "Use trusted application to execute untrusted code", "attack_phase_name": "execution", "attack_ap_name": "Trusted Developer Utilities" },
    { "ntctf_phase_name": "presence - installation | execution", "ntctf_ap_name": "Enabled by user", "attack_phase_name": "execution", "attack_ap_name": "User Execution" },
    { "ntctf_phase_name": "presence - installation | execution", "ntctf_ap_name": "Use remote management services", "attack_phase_name": "execution", "attack_ap_name": "Windows Remote Management" },
    { "ntctf_phase_name": "presence - persistence", "ntctf_ap_name": "Accessibility features", "attack_phase_name": "persistence", "attack_ap_name": "Accessibility Features" },
    { "ntctf_phase_name": "presence - persistence", "ntctf_ap_name": "Automatic loading at startup", "attack_phase_name": "persistence", "attack_ap_name": "AppInit DLLs" },
    { "ntctf_phase_name": "presence - persistence", "ntctf_ap_name": "Edit MBR", "attack_phase_name": "persistence", "attack_ap_name": "Bootkit" },
    { "ntctf_phase_name": "presence - persistence", "ntctf_ap_name": "Edit file type associations", "attack_phase_name": "persistence", "attack_ap_name": "Change Default File Association" },
    { "ntctf_phase_name": "presence - persistence", "ntctf_ap_name": "Library search hijack", "attack_phase_name": "persistence", "attack_ap_name": "DLL Search Order Hijacking" },
    { "ntctf_phase_name": "presence - persistence", "ntctf_ap_name": "Install hypervisor rootkit", "attack_phase_name": "persistence", "attack_ap_name": "Hypervisor" },
    { "ntctf_phase_name": "presence - persistence", "ntctf_ap_name": "Employ logon scripts", "attack_phase_name": "persistence", "attack_ap_name": "Logon Scripts" },
    { "ntctf_phase_name": "presence - persistence", "ntctf_ap_name": "Modify existing services", "attack_phase_name": "persistence", "attack_ap_name": "Modify Existing Service" },
    { "ntctf_phase_name": "presence - persistence", "ntctf_ap_name": "Create new service", "attack_phase_name": "persistence", "attack_ap_name": "New Service" },
    { "ntctf_phase_name": "presence - persistence", "ntctf_ap_name": "Path interception", "attack_phase_name": "persistence", "attack_ap_name": "Path Interception" },
    { "ntctf_phase_name": "presence - persistence", "ntctf_ap_name": "Scheduled task", "attack_phase_name": "persistence", "attack_ap_name": "Scheduled Task" },
    { "ntctf_phase_name": "presence - persistence", "ntctf_ap_name": "Modify service configuration", "attack_phase_name": "persistence", "attack_ap_name": "Service Registry Permissions Weakness" },
    { "ntctf_phase_name": "presence - persistence", "ntctf_ap_name": "Link modification", "attack_phase_name": "persistence", "attack_ap_name": "Shortcut Modification" },
    { "ntctf_phase_name": "presence - persistence", "ntctf_ap_name": "Web shell", "attack_phase_name": "persistence", "attack_ap_name": "Web Shell" },
    { "ntctf_phase_name": "presence - privilege escalation", "ntctf_ap_name": "Accessibility Features", "attack_phase_name": "privilege-escalation", "attack_ap_name": "Accessibility Features" },
    { "ntctf_phase_name": "presence - privilege escalation", "ntctf_ap_name": "Automatic loading at startup", "attack_phase_name": "privilege-escalation", "attack_ap_name": "AppInit DLLs" },
    { "ntctf_phase_name": "presence - privilege escalation", "ntctf_ap_name": "Manipulate trusted process", "attack_phase_name": "privilege-escalation", "attack_ap_name": "Bypass User Account Control" },
    { "ntctf_phase_name": "presence - privilege escalation", "ntctf_ap_name": "Library search hijack", "attack_phase_name": "privilege-escalation", "attack_ap_name": "DLL Search Order Hijacking" },
    { "ntctf_phase_name": "presence - privilege escalation", "ntctf_ap_name": "Create new service", "attack_phase_name": "privilege-escalation", "attack_ap_name": "New Service" },
    { "ntctf_phase_name": "presence - privilege escalation", "ntctf_ap_name": "Path interception", "attack_phase_name": "privilege-escalation", "attack_ap_name": "Path Interception" },
    { "ntctf_phase_name": "presence - privilege escalation", "ntctf_ap_name": "Process injection", "attack_phase_name": "privilege-escalation", "attack_ap_name": "Process Injection" },
    { "ntctf_phase_name": "presence - privilege escalation", "ntctf_ap_name": "Scheduled task", "attack_phase_name": "privilege-escalation", "attack_ap_name": "Scheduled Task" },
    { "ntctf_phase_name": "presence - privilege escalation", "ntctf_ap_name": "Modify service configuration", "attack_phase_name": "privilege-escalation", "attack_ap_name": "Service Registry Permissions Weakness" },
    { "ntctf_phase_name": "ongoing processes - evasion", "ntctf_ap_name": "Binary padding", "attack_phase_name": "defense-evasion", "attack_ap_name": "Binary Padding" },
    { "ntctf_phase_name": "ongoing processes - evasion", "ntctf_ap_name": "Manipulate trusted process", "attack_phase_name": "defense-evasion", "attack_ap_name": "Bypass User Account Control" },
    { "ntctf_phase_name": "ongoing processes - evasion", "ntctf_ap_name": "Use signed content", "attack_phase_name": "defense-evasion", "attack_ap_name": "Code Signing" },
    { "ntctf_phase_name": "ongoing processes - evasion", "ntctf_ap_name": "Disable security products", "attack_phase_name": "defense-evasion", "attack_ap_name": "Disabling Security Tools" },
    { "ntctf_phase_name": "ongoing processes - evasion", "ntctf_ap_name": "Block indicators on host", "attack_phase_name": "defense-evasion", "attack_ap_name": "Indicator Blocking" },
    { "ntctf_phase_name": "ongoing processes - evasion", "ntctf_ap_name": "Impersonate legitimate file", "attack_phase_name": "defense-evasion", "attack_ap_name": "Masquerading" },
    { "ntctf_phase_name": "ongoing processes - evasion", "ntctf_ap_name": "Employ anti-reverse engineering measures", "attack_phase_name": "defense-evasion", "attack_ap_name": "Obfuscated Files or Information" },
    { "ntctf_phase_name": "ongoing processes - evasion", "ntctf_ap_name": "Process injection", "attack_phase_name": "defense-evasion", "attack_ap_name": "Process Hollowing" },
    { "ntctf_phase_name": "ongoing processes - evasion", "ntctf_ap_name": "Employ rootkit", "attack_phase_name": "defense-evasion", "attack_ap_name": "Rootkit" },
    { "ntctf_phase_name": "ongoing processes - evasion", "ntctf_ap_name": "Use trusted application to execute untrusted code", "attack_phase_name": "defense-evasion", "attack_ap_name": "Rundll32" },
    { "ntctf_phase_name": "ongoing processes - evasion", "ntctf_ap_name": "Software packing", "attack_phase_name": "defense-evasion", "attack_ap_name": "Software Packing" },
    { "ntctf_phase_name": "presence - credential access", "ntctf_ap_name": "Add or modify credentials", "attack_phase_name": "credential-access", "attack_ap_name": "Account Manipulation" },
    { "ntctf_phase_name": "presence - credential access", "ntctf_ap_name": "Password cracking ", "attack_phase_name": "credential-access", "attack_ap_name": "Brute Force" },
    { "ntctf_phase_name": "presence - credential access", "ntctf_ap_name": "Credential dumping", "attack_phase_name": "credential-access", "attack_ap_name": "Credential Dumping" },
    { "ntctf_phase_name": "presence - credential access", "ntctf_ap_name": "Find credentials in file", "attack_phase_name": "credential-access", "attack_ap_name": "Credentials in Files" },
    { "ntctf_phase_name": "presence - credential access", "ntctf_ap_name": "Keylogging", "attack_phase_name": "credential-access", "attack_ap_name": "Input Capture" },
    { "ntctf_phase_name": "presence - credential access", "ntctf_ap_name": "Network sniffing", "attack_phase_name": "credential-access", "attack_ap_name": "Network Sniffing" },
    { "ntctf_phase_name": "presence - credential access", "ntctf_ap_name": "Hijack active credential", "attack_phase_name": "credential-access", "attack_ap_name": "Two-Factor Authentication Interception" },
    { "ntctf_phase_name": "presence - internal reconnaissance", "ntctf_ap_name": "Account enumeration", "attack_phase_name": "discovery", "attack_ap_name": "Account Discovery" },
    { "ntctf_phase_name": "presence - internal reconnaissance", "ntctf_ap_name": "Window enumeration", "attack_phase_name": "discovery", "attack_ap_name": "Application Window Discovery" },
    { "ntctf_phase_name": "presence - internal reconnaissance", "ntctf_ap_name": "File system enumeration", "attack_phase_name": "discovery", "attack_ap_name": "File and Directory Discovery" },
    { "ntctf_phase_name": "presence - internal reconnaissance", "ntctf_ap_name": "Group permission enumeration", "attack_phase_name": "discovery", "attack_ap_name": "Permission Groups Discovery" },
    { "ntctf_phase_name": "presence - internal reconnaissance", "ntctf_ap_name": "Process Enumeration", "attack_phase_name": "discovery", "attack_ap_name": "Process Discovery" },
    { "ntctf_phase_name": "presence - internal reconnaissance", "ntctf_ap_name": "Software enumeration", "attack_phase_name": "discovery", "attack_ap_name": "Security Software Discovery" },
    { "ntctf_phase_name": "presence - internal reconnaissance", "ntctf_ap_name": "Operating system enumeration", "attack_phase_name": "discovery", "attack_ap_name": "System Network Connections Discovery" },
    { "ntctf_phase_name": "presence - internal reconnaissance", "ntctf_ap_name": "Owner/User enumeration", "attack_phase_name": "discovery", "attack_ap_name": "System Owner/User Discovery" },
    { "ntctf_phase_name": "presence - internal reconnaissance", "ntctf_ap_name": "Service enumeration", "attack_phase_name": "discovery", "attack_ap_name": "System Service Discovery" },
    { "ntctf_phase_name": "presence - internal reconnaissance", "ntctf_ap_name": "Activate recording", "attack_phase_name": "discovery", "attack_ap_name": "System Time Discovery" },
    { "ntctf_phase_name": "presence - lateral movement", "ntctf_ap_name": "Application deployment software", "attack_phase_name": "lateral-movement", "attack_ap_name": "Application Deployment Software" },
    { "ntctf_phase_name": "presence - lateral movement", "ntctf_ap_name": "Employ logon scripts", "attack_phase_name": "lateral-movement", "attack_ap_name": "Logon Scripts" },
    { "ntctf_phase_name": "presence - lateral movement", "ntctf_ap_name": "Pass the Hash", "attack_phase_name": "lateral-movement", "attack_ap_name": "Pass the Hash" },
    { "ntctf_phase_name": "presence - lateral movement", "ntctf_ap_name": "Pass the Ticket", "attack_phase_name": "lateral-movement", "attack_ap_name": "Pass the Ticket" },
    { "ntctf_phase_name": "presence - lateral movement", "ntctf_ap_name": "Remote interactive logon", "attack_phase_name": "lateral-movement", "attack_ap_name": "Remote Desktop Protocol" },
    { "ntctf_phase_name": "presence - lateral movement", "ntctf_ap_name": "Remote services", "attack_phase_name": "lateral-movement", "attack_ap_name": "Remote Services" },
    { "ntctf_phase_name": "presence - lateral movement", "ntctf_ap_name": "Replication through removable media", "attack_phase_name": "lateral-movement", "attack_ap_name": "Replication Through Removable Media" },
    { "ntctf_phase_name": "presence - lateral movement", "ntctf_ap_name": "Shared webroot", "attack_phase_name": "lateral-movement", "attack_ap_name": "Shared Webroot" },
    { "ntctf_phase_name": "presence - lateral movement", "ntctf_ap_name": "Taint shared content", "attack_phase_name": "lateral-movement", "attack_ap_name": "Taint Shared Content" },
    { "ntctf_phase_name": "presence - lateral movement", "ntctf_ap_name": "Remote file shares", "attack_phase_name": "lateral-movement", "attack_ap_name": "Windows Admin Shares" },
    { "ntctf_phase_name": "presence - lateral movement", "ntctf_ap_name": "Use remote management services", "attack_phase_name": "lateral-movement", "attack_ap_name": "Windows Remote Management" },
    { "ntctf_phase_name": "effect - exfiltrate", "ntctf_ap_name": "Scripted exfiltration", "attack_phase_name": "exfiltration", "attack_ap_name": "Automated Exfiltration" },
    { "ntctf_phase_name": "effect - exfiltrate", "ntctf_ap_name": "Compress data", "attack_phase_name": "exfiltration", "attack_ap_name": "Data Compressed" },
    { "ntctf_phase_name": "effect - exfiltrate", "ntctf_ap_name": "Exfil over non-C2 channel", "attack_phase_name": "exfiltration", "attack_ap_name": "Exfiltration Over Alternative Protocol" },
    { "ntctf_phase_name": "effect - exfiltrate", "ntctf_ap_name": "Exfil over C2 channel", "attack_phase_name": "exfiltration", "attack_ap_name": "Exfiltration Over Command and Control Channel" },
    { "ntctf_phase_name": "effect - exfiltrate", "ntctf_ap_name": "Exfiltration over other network medium", "attack_phase_name": "exfiltration", "attack_ap_name": "Exfiltration Over Other Network Medium" },
    { "ntctf_phase_name": "effect - exfiltrate", "ntctf_ap_name": "Exfil over physical medium", "attack_phase_name": "exfiltration", "attack_ap_name": "Exfiltration Over Physical Medium" },
    { "ntctf_phase_name": "effect - exfiltrate", "ntctf_ap_name": "Scheduled transfer", "attack_phase_name": "exfiltration", "attack_ap_name": "Scheduled Transfer" },
    { "ntctf_phase_name": "ongoing processes - command & control (C2)", "ntctf_ap_name": "Commonly used port", "attack_phase_name": "command-and-control", "attack_ap_name": "Commonly Used Port" },
    { "ntctf_phase_name": "ongoing processes - command & control (C2)", "ntctf_ap_name": "Use removable media", "attack_phase_name": "command-and-control", "attack_ap_name": "Communication Through Removable Media" },
    { "ntctf_phase_name": "ongoing processes - command & control (C2)", "ntctf_ap_name": "Use peer connections", "attack_phase_name": "command-and-control", "attack_ap_name": "Connection Proxy" },
    { "ntctf_phase_name": "ongoing processes - command & control (C2)", "ntctf_ap_name": "Use custom encryption", "attack_phase_name": "command-and-control", "attack_ap_name": "Custom Cryptographic Protocol" },
    { "ntctf_phase_name": "ongoing processes - command & control (C2)", "ntctf_ap_name": "Fallback channels", "attack_phase_name": "command-and-control", "attack_ap_name": "Fallback Channels" },
    { "ntctf_phase_name": "ongoing processes - command & control (C2)", "ntctf_ap_name": "Use chained protocols", "attack_phase_name": "command-and-control", "attack_ap_name": "Multi-Stage Channels" },
    { "ntctf_phase_name": "ongoing processes - command & control (C2)", "ntctf_ap_name": "Multiband comm", "attack_phase_name": "command-and-control", "attack_ap_name": "Multiband Communication" },
    { "ntctf_phase_name": "ongoing processes - command & control (C2)", "ntctf_ap_name": "Use multilayer encryption", "attack_phase_name": "command-and-control", "attack_ap_name": "Multilayer Encryption" },
    { "ntctf_phase_name": "ongoing processes - command & control (C2)", "ntctf_ap_name": "Standard app layer protocol", "attack_phase_name": "command-and-control", "attack_ap_name": "Standard Application Layer Protocol" },
    { "ntctf_phase_name": "ongoing processes - command & control (C2)", "ntctf_ap_name": "Use standard encryption", "attack_phase_name": "command-and-control", "attack_ap_name": "Standard Cryptographic Protocol" },
    { "ntctf_phase_name": "ongoing processes - command & control (C2)", "ntctf_ap_name": "Standard non-app layer protocol", "attack_phase_name": "command-and-control", "attack_ap_name": "Standard Non-Application Layer Protocol" },
    { "ntctf_phase_name": "ongoing processes - command & control (C2)", "ntctf_ap_name": "Uncommonly used port", "attack_phase_name": "command-and-control", "attack_ap_name": "Uncommonly Used Port" }
];

/**
 * Required schemas for this update.
 */
const AttackPatternSchema = mongoose.Schema({
    stix: {
        id: String,
        name: {
            type: String,
            required: [true, 'name is required'],
            index: true
        },
        kill_chain_phases: [
            {
                kill_chain_name: {
                    type: String,
                    required: [true, 'kill_chain_name is required']
                },
                phase_name: {
                    type: String,
                    required: [true, 'phase_name is required'],
                    index: true
                }
            }
        ],
        type: {
            type: String,
            enum: ['attack-pattern'],
            default: 'attack-pattern'
        }
    }
});

/*
 * The purpose of this function is to correct the omission of the category attribute in the Autologon capability
 * within the DoDCAR sample assessments data.
 */
function updateAttackPatterns(apQuery) {
    console.log('Starting attack pattern consolidation');
    const AttackPatterns = mongoose.connection.model('Stix', AttackPatternSchema, apQuery.collection);
    return new Promise((resolve, reject) => {
        AttackPatterns.find(apQuery.search, (err, attackPatterns) => {
            if (apQuery.testFailure === true) {
                reject('Deliberate test failure');
            } else if (err) {
                reject(`Error retrieving capabilities data: ${err}`);
            } else {
                Promise
                    .all(
                        attackPatterns.map(attackPattern => {
                            const newKCEntries = mappedDict.find((mapping) => {
                                return mapping.attack_ap_name === attackPattern.stix.name &&
                                       attackPattern.stix.kill_chain_phases.find((kc) => {
                                           return kc.phase_name === mapping.attack_phase_name;
                                       }) !== undefined;
                            });
                            if (newKCEntries) {
                                console.log(newKCEntries);
                                new Promise((res, rej) => updateAttackPattern(AttackPatterns, attackPattern, newKCEntries, res, rej));
                            }
                        })
                    )
                    .then(
                        result => resolve({ migration: apQuery.name, success: true, detail: result }),
                        error => reject({ migration: apQuery.name, success: false, detail: error })
                    )
                    .catch(error => reject({ migration: apQuery.name, success: false, detail: error }))
                    .finally(() => console.log('Attack pattern updates complete.'));
            }
        });
    });
}

async function updateAttackPattern(AttackPatterns, attackPattern, newKCEntries, resolve, reject) {
    const stageName = newKCEntries.ntctf_phase_name.substring(0, newKCEntries.ntctf_phase_name.indexOf(' -'));
    console.log("Updating " + attackPattern.stix.name + " with NTCTF phase name " + newKCEntries.ntctf_phase_name + " and NTCTF stage " + stageName);
    await AttackPatterns.update(
        { 'stix.id': attackPattern.id },
        {
            $push: { "stix.kill_chain_phases" : { 'kill_chain_name': 'ntctf', 'phase_name': newKCEntries.ntctf_phase_name, 'x_ntctf_stage': stageName } }
        }
    );
    resolve({ attackPattern: attackPattern.stix.name });
}

const MIGRATIONS = [
    {
        name: 'AttackPatternConsolidation',
        collection: 'stix',
        search: { 'stix.type' : 'attack-pattern' },
        migrator: updateAttackPatterns,
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
