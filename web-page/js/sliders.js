// Configuration object
let config = {
    floorHeight: 3.0,
    floorNum: 16,
    attractorPtSeed: 0,
    attractorPtStrength: 0.12,
    runAnalysis: false,
    showAnalysis: false,
    showFacade: true
};

// Configuration for floors sliders
let configFloors = {
    gridDivisions: 7,
    cullCurveScaleFactor: 0.75,
    minOfficeSize: 13,
    liftX: 1.4,
    liftY: 1.6,
    pathSubD: 200,
    evalPt: "{0.24, 0.82, 0}"
};

// Load existing config from config.json
async function loadConfig() {
    try {
        const response = await fetch('assets/config.json');
        if (response.ok) {
            const data = await response.json();
            config.floorHeight = parseFloat(data.floorHeight);
            config.floorNum = parseInt(data.floorNum, 10);
            config.attractorPtSeed = parseInt(data.attractorPtSeed, 10);
            config.attractorPtStrength = parseFloat(data.attractorPtStrength);
            config.runAnalysis = data.runAnalysis;
            config.showAnalysis = data.showAnalysis;
            config.showFacade = data.showFacade;

            document.getElementById('floorHeight').value = config.floorHeight;
            document.getElementById('floorNum').value = config.floorNum;
            document.getElementById('attractorPtSeed').value = config.attractorPtSeed;
            document.getElementById('attractorPtStrength').value = config.attractorPtStrength;
            document.getElementById('value1').textContent = config.floorHeight;
            document.getElementById('value2').textContent = config.floorNum;
            document.getElementById('value3').textContent = config.attractorPtSeed;
            document.getElementById('value4').textContent = config.attractorPtStrength;

            updateRunAnalysisButton();
            updateToggleButtonState('toggleAnalysisButton', config.showAnalysis, 'Show Analysis', 'Hide Analysis');
            updateToggleButtonState('toggleFacadeButton', config.showFacade, 'Show Facade', 'Hide Facade');
        } else {
            console.error('Failed to load config');
        }
    } catch (error) {
        console.error('Error fetching config:', error);
    }
}

// Load existing floors config from configFloors.json
async function loadFloorConfig() {
    try {
        const response = await fetch('assets/config-floors.json');
        if (response.ok) {
            const data = await response.json();
            configFloors.gridDivisions = parseInt(data.gridDivisions, 10);
            configFloors.cullCurveScaleFactor = parseFloat(data.cullCurveScaleFactor);
            configFloors.minOfficeSize = parseFloat(data.minOfficeSize);
            configFloors.liftX = parseFloat(data.liftX);
            configFloors.liftY = parseFloat(data.liftY);
            configFloors.pathSubD = parseInt(data.pathSubD, 10);
            configFloors.evalPt = data.evalPt;

            document.getElementById('gridDivisions').value = configFloors.gridDivisions;
            document.getElementById('cullCurveScaleFactor').value = configFloors.cullCurveScaleFactor;
            document.getElementById('minOfficeSize').value = configFloors.minOfficeSize;
            document.getElementById('liftX').value = configFloors.liftX;
            document.getElementById('liftY').value = configFloors.liftY;
            document.getElementById('pathSubD').value = configFloors.pathSubD;
            document.getElementById('value1').textContent = configFloors.gridDivisions;
            document.getElementById('value2').textContent = configFloors.cullCurveScaleFactor;
            document.getElementById('value3').textContent = configFloors.minOfficeSize;
            document.getElementById('value4').textContent = configFloors.liftX;
            document.getElementById('value5').textContent = configFloors.liftY;
            document.getElementById('value6').textContent = configFloors.pathSubD;
        } else {
            console.error('Failed to load floor config');
        }
    } catch (error) {
        console.error('Error fetching floor config:', error);
    }
}

// Update the JSON config file
async function updateJsonFile() {
    const response = await fetch('/update-config', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(config, null, 2)
    });
    if (response.ok) {
        console.log('Config updated successfully');
    } else {
        console.error('Failed to update config');
    }
}

// Update the floor JSON config file
async function updateFloorJsonFile() {
    const response = await fetch('/update-floor-config', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(configFloors, null, 2)
    });
    if (response.ok) {
        console.log('Floor config updated successfully');
    } else {
        console.error('Failed to update floor config');
    }
}

// Slider functionality
document.getElementById('floorHeight').addEventListener('input', function(event) {
    document.getElementById('value1').textContent = event.target.value;
    config.floorHeight = parseFloat(event.target.value);
});

document.getElementById('floorNum').addEventListener('input', function(event) {
    document.getElementById('value2').textContent = event.target.value;
    config.floorNum = parseInt(event.target.value, 10);
});

document.getElementById('attractorPtSeed').addEventListener('input', function(event) {
    document.getElementById('value3').textContent = event.target.value;
    config.attractorPtSeed = parseInt(event.target.value, 10);
});

document.getElementById('attractorPtStrength').addEventListener('input', function(event) {
    document.getElementById('value4').textContent = event.target.value;
    config.attractorPtStrength = parseFloat(event.target.value);
});

// Slider functionality for floor config
document.getElementById('gridDivisions').addEventListener('input', function(event) {
    document.getElementById('value1').textContent = event.target.value;
    configFloors.gridDivisions = parseInt(event.target.value, 10);
    updateFloorJsonFile();
});

document.getElementById('cullCurveScaleFactor').addEventListener('input', function(event) {
    document.getElementById('value2').textContent = event.target.value;
    configFloors.cullCurveScaleFactor = parseFloat(event.target.value);
    updateFloorJsonFile();
});

document.getElementById('minOfficeSize').addEventListener('input', function(event) {
    document.getElementById('value3').textContent = event.target.value;
    configFloors.minOfficeSize = parseFloat(event.target.value);
    updateFloorJsonFile();
});

document.getElementById('liftX').addEventListener('input', function(event) {
    document.getElementById('value4').textContent = event.target.value;
    configFloors.liftX = parseFloat(event.target.value);
    updateFloorJsonFile();
});

document.getElementById('liftY').addEventListener('input', function(event) {
    document.getElementById('value5').textContent = event.target.value;
    configFloors.liftY = parseFloat(event.target.value);
    updateFloorJsonFile();
});

document.getElementById('pathSubD').addEventListener('input', function(event) {
    document.getElementById('value6').textContent = event.target.value;
    configFloors.pathSubD = parseInt(event.target.value, 10);
    updateFloorJsonFile();
});

// Load floor config on page load
loadFloorConfig();

// Save settings button
document.getElementById('saveButton').addEventListener('click', function() {
    console.log('Settings saved:', config);
    updateJsonFile();
});

// Toggle run/stop analysis
document.getElementById('runAnalysisButton').addEventListener('click', function() {
    config.runAnalysis = !config.runAnalysis;
    updateRunAnalysisButton();
    updateJsonFile();
});

function updateRunAnalysisButton() {
    const button = document.getElementById('runAnalysisButton');
    button.textContent = config.runAnalysis ? 'Stop Analysis' : 'Run Analysis';
    button.classList.toggle('active', config.runAnalysis);
}

// Toggle Analysis button (controls visibility of analysis mesh)
document.getElementById('toggleAnalysisButton').addEventListener('click', function() {
    const button = this;
    const isActive = button.classList.toggle('active');
    button.textContent = isActive ? 'Hide Analysis' : 'Show Analysis';
    updateAnalysisMeshVisibility(isActive);
    config.showAnalysis = isActive;
    updateJsonFile();
});

// Toggle Facade button
document.getElementById('toggleFacadeButton').addEventListener('click', function() {
    const button = this;
    const isActive = button.classList.toggle('active');
    button.textContent = isActive ? 'Hide Facade' : 'Show Facade';
    updateFacadeVisibility(isActive);
    config.showFacade = isActive;
    updateJsonFile();
});

// Load config on page load
loadConfig();

// Update analysis data on page
async function loadAnalysisData() {
    try {
        const response = await fetch('assets/analysis_data.json');
        if (response.ok) {
            const analysisData = await response.json();
            document.getElementById('numberGlassPanes').textContent = analysisData["number of glass panes"];
            document.getElementById('totalCostPanels').textContent = `$${Number(analysisData["total cost of panels"]).toLocaleString()}`;
            document.getElementById('totalEmbodiedCarbonPanels').textContent = `${Number(analysisData["total embodied carbon of panels"]).toLocaleString()} kg CO2e`;
            document.getElementById('numberMetalFins').textContent = analysisData["number of metal fins"];
            document.getElementById('totalCostMetalFins').textContent = `$${Number(analysisData["total cost of metal fins"]).toLocaleString()}`;
            document.getElementById('totalEmbodiedCarbonFins').textContent = `${Number(analysisData["total embodied carbon of fins"]).toLocaleString()} kg CO2e`;
        } else {
            console.error('Failed to load analysis data');
        }
    } catch (error) {
        console.error('Error fetching analysis data:', error);
    }
}

// Function to update analysis mesh visibility
function updateAnalysisMeshVisibility(isVisible) {
    if (window.updateAnalysisMeshVisibilityInViewer) {
        window.updateAnalysisMeshVisibilityInViewer(isVisible);
    }
}

// Function to update facade visibility
function updateFacadeVisibility(isVisible) {
    if (window.updateFacadeVisibilityInViewer) {
        window.updateFacadeVisibilityInViewer(isVisible);
    }
}

// Function to update the state of toggle buttons
function updateToggleButtonState(buttonId, isActive, inactiveText, activeText) {
    const button = document.getElementById(buttonId);
    button.classList.toggle('active', isActive);
    button.textContent = isActive ? activeText : inactiveText;
}

// Refresh button functionality
document.getElementById('refreshButton').addEventListener('click', async function() {
    if (window.refreshModelAndAnalysis) {
        window.refreshModelAndAnalysis();
    }
});
