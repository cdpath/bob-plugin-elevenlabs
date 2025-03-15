const fs = require('fs');
const path = require('path');

// Get version from command line argument
const newVersion = process.argv[2];
const description = process.argv[3];
const sha256Hash = process.argv[4];

if (!newVersion || !description || !sha256Hash) {
    console.error('Please provide all required arguments:');
    console.error('node bump-version.js <version> <description> <sha256>');
    process.exit(1);
}

// Update info.json
const infoPath = path.join(__dirname, '../src/info.json');
const info = JSON.parse(fs.readFileSync(infoPath, 'utf8'));
info.version = newVersion;
fs.writeFileSync(infoPath, JSON.stringify(info, null, 4));

// Update appcast.json
const appcastPath = path.join(__dirname, '../appcast.json');
const appcast = JSON.parse(fs.readFileSync(appcastPath, 'utf8'));

// Add new version at the beginning of versions array
appcast.versions.unshift({
    version: newVersion,
    desc: description,
    sha256: sha256Hash,
    url: `https://github.com/cdpath/bob-plugin-elevenlabs/releases/download/v${newVersion}/bob-plugin-elevenlabs.bobplugin`,
    minBobVersion: "0.5.0",
    timestamp: Date.now()
});

fs.writeFileSync(appcastPath, JSON.stringify(appcast, null, 4)); 