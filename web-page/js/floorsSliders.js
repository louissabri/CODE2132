// Configuration object
let floorsConfig = {
    gridDivsNum: 5,
    cullCrvScale: 0.85,
    minOfficeSize: 0,
    liftX: 1.4,
    liftY: 1.6,
    pathSubD: 200
};

// Load existing floorsConfig from floorsConfig.json
async function loadConfig() {
    try {
        const response = await fetch('assets/floorsConfig.json');
        if (response.ok) {
            const data = await response.json();
            floorsConfig.gridDivsNum = parseInt(data.gridDivsNum);
            floorsConfig.cullCrvScale = parseFloat(data.cullCrvScale, 0.85);
            floorsConfig.minOfficeSize = parseInt(data.minOfficeSize, 0);
            floorsConfig.liftX = parseFloat(data.liftX);
            floorsConfig.liftY = parseFloat(data.liftY);
            floorsConfig.pathSubD = parseInt(data.pathSubD);

            document.getElementById('gridDivsNum').value = floorsConfig.gridDivsNum;
            document.getElementById('cullCrvScale').value = floorsConfig.cullCrvScale;
            document.getElementById('minOfficeSize').value = floorsConfig.minOfficeSize;
            document.getElementById('liftX').value = floorsConfig.liftX;
            document.getElementById('liftY').textContent = floorsConfig.liftY;
            document.getElementById('pathSubD').textContent = floorsConfig.pathSubD;
        } else {
            console.error('Failed to load floorsConfig');
        }
    } catch (error) {
        console.error('Error fetching floorsConfig:', error);
    }
}

// Update the JSON floorsConfig file
async function updateJsonFile() {
    const response = await fetch('/update-floorsConfig', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(floorsConfig, null, 2)
    });
    if (response.ok) {
        console.log('FloorsConfig updated successfully');
    } else {
        console.error('Failed to update floorsConfig');
    }
}

// Slider functionality
document.getElementById('gridDivsNum').addEventListener('input', function(event) {
    document.getElementById('value1').textContent = event.target.value;
    floorsConfig.gridDivsNum = parseInt(event.target.value);
    console.log('updated gridDivsNum:', floorsConfig.gridDivsNum); // Debugging
});

document.getElementById('cullCrvScale').addEventListener('input', function(event) {
    document.getElementById('value2').textContent = event.target.value;
    floorsConfig.cullCrvScale = parseFloat(event.target.value, 10);
    console.log('updated cullCrvScale:', floorsConfig.cullCrvScale); // Debugging
});

document.getElementById('minOfficeSize').addEventListener('input', function(event) {
    document.getElementById('value3').textContent = event.target.value;
    floorsConfig.minOfficeSize = parseInt(event.target.value, 10);
    console.log('updated minOfficeSize:', floorsConfig.minOfficeSize); // Debugging
});

document.getElementById('liftX').addEventListener('input', function(event) {
    document.getElementById('value4').textContent = event.target.value;
    floorsConfig.liftX = parseFloat(event.target.value);
    console.log('updated liftX:', floorsConfig.liftX); // Debugging
});

document.getElementById('liftY').addEventListener('input', function(event) {
    document.getElementById('value5').textContent = event.target.value;
    floorsConfig.liftY = parseFloat(event.target.value);
    console.log('updated liftY:', floorsConfig.liftY); // Debugging
});

document.getElementById('pathSubD').addEventListener('input', function(event) {
    document.getElementById('value6').textContent = event.target.value;
    floorsConfig.pathSubD = parseInt(event.target.value);
    console.log('updated pathSubD:', floorsConfig.pathSubD); // Debugging
});

// Save settings button
document.getElementById('saveButton').addEventListener('click', function() {
    console.log('Settings saved:', floorsConfig);
    updateJsonFile(floorsConfig);
});

// Load floorsConfig on page load
loadConfig();

// Refresh button functionality
document.getElementById('refreshButton').addEventListener('click', async function() {
    if (window.refreshModelAndAnalysis) {
        window.refreshModelAndAnalysis();
    }
});
