var config = require('./config.js');

function supportLanguages() {
    return config.supportedLanguages.map(([standardLang]) => standardLang);
}

function tts(query, completion) {
    (async () => {
        try {
            // Check if API key is provided
            if (!$option.apiKey) {
                throw {
                    type: 'missing-api-key',
                    message: 'Please provide your ElevenLabs API key in the plugin settings'
                };
            }

            // Get target language
            const targetLanguage = config.langMap.get(query.lang);
            if (!targetLanguage) {
                throw {
                    type: 'unsupported-language',
                    message: 'Language not supported'
                };
            }

            // Make API request to ElevenLabs
            const resp = await $http.request({
                method: "POST",
                url: `${config.API_URL}/text-to-speech/${$option.voice}`,
                header: {
                    'xi-api-key': $option.apiKey,
                    'Content-Type': 'application/json'
                },
                body: {
                    text: query.text,
                    model_id: $option.model,
                    voice_settings: {
                        stability: 0.5,
                        similarity_boost: 0.75
                    }
                }
            });

            // Convert response to base64
            let audioData = $data.fromData(resp.rawData);
            
            completion({
                result: {
                    "type": "base64",
                    "value": audioData.toBase64(),
                    "raw": {}
                }
            });

        } catch (err) {
            completion({
                error: {
                    type: err.type || 'unknown',
                    message: err.message || 'Unknown error occurred',
                    addition: err
                }
            });
        }
    })();
}

exports.supportLanguages = supportLanguages;
exports.tts = tts; 