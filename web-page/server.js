const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 2000; // Default to 2000, can be overridden by environment

// Middleware to parse JSON bodies
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Serve static files from the current directory
app.use(express.static(path.join(__dirname)));

// Debounced file watchers to prevent rapid calls
let fileWatcherTimeout;
function debounceFileWatcher(callback, delay) {
    clearTimeout(fileWatcherTimeout);
    fileWatcherTimeout = setTimeout(callback, delay);
}

// Endpoints for saving data
app.post('/save-osm-highways', (req, res) => {
    const data = req.body;
    const filePath = path.join(__dirname, 'assets', 'highway_data.geojson');
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    res.sendStatus(200);
});

app.post('/save-osm-buildings', (req, res) => {
    const data = req.body;
    const filePath = path.join(__dirname, 'assets', 'building_data.geojson');
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    res.sendStatus(200);
});

app.post('/save-osm-transport', (req, res) => {
    const data = req.body;
    const filePath = path.join(__dirname, 'assets', 'transport_data.geojson');
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    res.sendStatus(200);
});

app.post('/save-point', (req, res) => {
    const data = req.body;
    const filePath = path.join(__dirname, 'assets', 'point.json');
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    res.sendStatus(200);
});

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
        }, 1000);
    });
});

// Endpoint to handle updating the floorsConfig file
app.post('/update-floorsConfig', (req, res) => {
    const floorsConfig = req.body;

    fs.writeFile(path.join(__dirname, 'assets/floorsConfig.json'), JSON.stringify(floorsConfig, null, 2), (err) => {
        if (err) {
            console.error('Failed to write floorsConfig:', err);
            res.status(500).send('Failed to write floorsConfig');
            return;
        }
        res.send('floorsConfig updated successfully');

        // Notify the client after writing the file
        debounceFileWatcher(() => {
            if (sseResponse) {
                sseResponse.write('event: model-update\n');
                sseResponse.write('data: Model updated\n\n');
            }
        }, 1000);
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
        }, 1000);
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
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
