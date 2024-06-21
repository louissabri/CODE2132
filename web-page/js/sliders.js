// Configuration object
let config = {
    slider1: 50,
    slider2: 50,
    slider3: 50,
    number3: 50,
    runAnalysis: false
};

// Load existing config from config.json
async function loadConfig() {
    try {
        const response = await fetch('assets/config.json');
        if (response.ok) {
            config = await response.json();
            document.getElementById('slider1').value = config.slider1;
            document.getElementById('slider2').value = config.slider2;
            document.getElementById('slider3').value = config.slider3;
            document.getElementById('number3').value = config.number3;
            document.getElementById('value1').textContent = config.slider1;
            document.getElementById('value2').textContent = config.slider2;
            document.getElementById('value3').textContent = config.slider3;
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
document.getElementById('slider1').addEventListener('input', function(event) {
    document.getElementById('value1').textContent = event.target.value;
    config.slider1 = event.target.value;
});

document.getElementById('slider2').addEventListener('input', function(event) {
    document.getElementById('value2').textContent = event.target.value;
    config.slider2 = event.target.value;
});

document.getElementById('slider3').addEventListener('input', function(event) {
    document.getElementById('value3').textContent = event.target.value;
    config.slider3 = event.target.value;
});

document.getElementById('number3').addEventListener('input', function(event) {
    config.number3 = event.target.value;
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
