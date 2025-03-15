const fs = require('fs');
const path = require('path');

// Get version from command line argument
const newVersion = process.argv[2];
if (!newVersion) {
    console.error('Please provide a version number (e.g., node bump-version.js 0.1.1)');
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
    desc: process.argv[3] || `Update to version ${newVersion}`,
    sha256: "will be updated by GitHub Actions",
    url: `https://github.com/cdpath/bob-plugin-elevenlabs/releases/download/v${newVersion}/bob-plugin-elevenlabs.bobplugin`,
    minBobVersion: "0.5.0",
    timestamp: Date.now()
});

fs.writeFileSync(appcastPath, JSON.stringify(appcast, null, 4)); 