const fs = require('fs');
const path = require('path');
const https = require('https');

// Get API key from command line argument
const apiKey = process.argv[2];
if (!apiKey) {
    console.error('Please provide your ElevenLabs API key as an argument (e.g., node update-models.js YOUR_API_KEY)');
    process.exit(1);
}

// Helper function to make HTTPS requests
function makeRequest(url) {
    return new Promise((resolve, reject) => {
        const options = {
            headers: {
                'xi-api-key': apiKey
            }
        };

        https.get(url, options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    resolve(JSON.parse(data));
                } else {
                    reject(new Error(`Request failed with status ${res.statusCode}: ${data}`));
                }
            });
        }).on('error', reject);
    });
}

async function main() {
    try {
        // Fetch models and voices
        const [models, voicesResponse] = await Promise.all([
            makeRequest('https://api.elevenlabs.io/v1/models'),
            makeRequest('https://api.elevenlabs.io/v1/voices')
        ]);

        // Read current info.json
        const infoPath = path.join(__dirname, '../src/info.json');
        const info = JSON.parse(fs.readFileSync(infoPath, 'utf8'));

        // Update models
        const modelOptions = info.options.find(opt => opt.identifier === 'model');
        modelOptions.menuValues = models
            .filter(model => model.can_do_text_to_speech)
            .map(model => ({
                title: `${model.name} (${model.description})`,
                value: model.model_id
            }));

        // Update voices
        const voiceOptions = info.options.find(opt => opt.identifier === 'voice');
        voiceOptions.menuValues = voicesResponse.voices
            .filter(voice => voice.category === 'premade' || voice.category === 'professional')
            .map(voice => {
                const labels = voice.labels || {};
                const title = `${voice.name} (${labels.gender || 'Unknown'}, ${labels.accent || 'No accent'}, ${labels.description || 'No description'})`;
                return {
                    title: title,
                    value: voice.voice_id
                };
            });

        // Write updated info.json
        fs.writeFileSync(infoPath, JSON.stringify(info, null, 4));
        console.log('Successfully updated models and voices in info.json');

    } catch (error) {
        console.error('Error updating models and voices:', error);
        process.exit(1);
    }
}

main(); 