const fs = require('fs');
const path = require('path');

// Get version and SHA256 from command line arguments
const version = process.argv[2];
const sha256Hash = process.argv[3];

if (!version || !sha256Hash) {
    console.error('Please provide all required arguments:');
    console.error('node update-sha256.js <version> <sha256>');
    process.exit(1);
}

// Update appcast.json
const appcastPath = path.join(__dirname, '../appcast.json');
const appcast = JSON.parse(fs.readFileSync(appcastPath, 'utf8'));

// Find and update the SHA256 for the specified version
const versionEntry = appcast.versions.find(v => v.version === version);
if (!versionEntry) {
    console.error(`Version ${version} not found in appcast.json`);
    process.exit(1);
}

versionEntry.sha256 = sha256Hash;
fs.writeFileSync(appcastPath, JSON.stringify(appcast, null, 4)); 