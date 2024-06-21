// Configuration object
let config = {
    floorHeight: 3.0,
    floorNum: 16,
    attractorPtSeed: 0,
    attractorPtStrength: 0.12,
    runAnalysis: false,
    showAnalysis: false,
    showFacade: false
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

            updateRunAnalysisButton();
        } else {
            console.error('Failed to load config');
        }
    } catch (error) {
        console.error('Error fetching config:', error);
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
});

// Toggle Facade button
document.getElementById('toggleFacadeButton').addEventListener('click', function() {
    const button = this;
    const isActive = button.classList.toggle('active');
    button.textContent = isActive ? 'Hide Facade' : 'Show Facade';
    updateFacadeVisibility(isActive);
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
            document.getElementById('totalCostPanels').textContent = analysisData["total cost of panels"];
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

// Refresh button functionality
document.getElementById('refreshButton').addEventListener('click', async function() {
    if (window.refreshModelAndAnalysis) {
        window.refreshModelAndAnalysis();
    }
});
