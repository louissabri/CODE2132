const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000; // You can change this port if necessary

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Serve static files from the current directory
app.use(express.static(__dirname));

// Debounced file watchers to prevent rapid calls
let fileWatcherTimeout;
function debounceFileWatcher(callback, delay) {
    clearTimeout(fileWatcherTimeout);
    fileWatcherTimeout = setTimeout(callback, delay);
}

// Endpoint to handle updating the config file
app.post('/update-config', (req, res) => {
    const config = req.body;

    fs.writeFile(path.join(__dirname, 'assets/config.json'), JSON.stringify(config, null, 2), (err) => {
        if (err) {
            console.error('Failed to write config:', err);
            res.status(500).send('Failed to write config');
            return;
        }
        res.send('Config updated successfully');

        // Notify the client after writing the file
        debounceFileWatcher(() => {
            if (sseResponse) {
                sseResponse.write('event: model-update\n');
                sseResponse.write('data: Model updated\n\n');
            }
        }, 1000); // Adjust delay as needed
    });
});

// Endpoint to handle updating the floor config file
app.post('/update-floor-config', (req, res) => {
    const configFloors = req.body;

    fs.writeFile(path.join(__dirname, 'assets/config-floors.json'), JSON.stringify(configFloors, null, 2), (err) => {
        if (err) {
            console.error('Failed to write floor config:', err);
            res.status(500).send('Failed to write floor config');
            return;
        }
        res.send('Floor config updated successfully');
    });
});

let sseResponse = null;

// SSE endpoint for notifying about model changes
app.get('/events', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();
    sseResponse = res;

    // Watch the model JSON file
    const watcher = fs.watch(path.join(__dirname, 'assets/analysis_data.json'), () => {
        debounceFileWatcher(() => {
            res.write('event: model-update\n');
            res.write('data: Model updated\n\n');
        }, 1000); // Adjust delay as needed
    });

    // Clean up watcher on client disconnect
    req.on('close', () => {
        watcher.close();
        sseResponse = null;
        res.end();
    });
});

// Fallback to index.html for any other requests
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
