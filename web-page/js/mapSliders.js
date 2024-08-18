// Configuration object
let mapConfig = {
    maxWalkTime: 10.0,
    maxBlockSize: 8000,
    minBlockSize: 1000
};

// Load existing mapConfig from mapConfig.json
async function loadConfig() {
    try {
        const response = await fetch('assets/mapConfig.json');
        if (response.ok) {
            const data = await response.json();
            mapConfig.maxWalkTime = parseFloat(data.maxWalkTime);
            mapConfig.minBlockSize = parseInt(data.minBlockSize);
            mapConfig.maxBlockSize = parseInt(data.maxBlockSize);

            document.getElementById('walkRadius').value = mapConfig.maxWalkTime;
            document.getElementById('value1').textContent = mapConfig.maxWalkTime;

            document.getElementById('minBlockSize').value = mapConfig.minBlockSize;
            document.getElementById('value2').textContent = mapConfig.minBlockSize;

            document.getElementById('maxBlockSize').value = mapConfig.maxBlockSize;
            document.getElementById('value3').textContent = mapConfig.maxBlockSize;
        } else {
            console.error('Failed to load mapConfig');
        }
    } catch (error) {
        console.error('Error fetching mapConfig:', error);
    }
}

// Update the JSON mapConfig file
async function updateJsonFile() {
    const response = await fetch('/update-mapConfig', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(mapConfig, null, 2)
    });
    if (response.ok) {
        console.log('mapConfig updated successfully');
    } else {
        console.error('Failed to update mapConfig');
    }
}

// Slider functionality
document.getElementById('walkRadius').addEventListener('input', function(event) {
    document.getElementById('value1').textContent = event.target.value;
    mapConfig.maxWalkTime = parseFloat(event.target.value);
    console.log('updated maxWalkTime:', mapConfig.maxWalkTime); // Debugging
});

document.getElementById('minBlockSize').addEventListener('input', function(event) {
    document.getElementById('value2').textContent = event.target.value;
    mapConfig.minBlockSize = parseInt(event.target.value);
    console.log('updated minBlockSize:', mapConfig.minBlockSize); // Debugging
});

document.getElementById('maxBlockSize').addEventListener('input', function(event) {
    document.getElementById('value3').textContent = event.target.value;
    mapConfig.maxBlockSize = parseInt(event.target.value);
    console.log('updated maxBlockSize:', mapConfig.maxBlockSize); // Debugging
});

// Save settings button
document.getElementById('saveButton').addEventListener('click', function() {
    console.log('Settings saved:', mapConfig);
    updateJsonFile(mapConfig);
});

// Load mapConfig on page load
loadConfig();

// Refresh button functionality
document.getElementById('refreshButton').addEventListener('click', async function() {
    if (window.refreshModelAndAnalysis) {
        window.refreshModelAndAnalysis();
    }
});
