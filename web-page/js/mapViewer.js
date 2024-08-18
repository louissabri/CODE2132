// Initialize Three.js Scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / (window.innerHeight * 0.7), 0.1, 5000);
const renderer = new THREE.WebGLRenderer({ antialias: true, physicallyCorrectLights: true });
const controls = new THREE.OrbitControls(camera, renderer.domElement);
let loadedModel = null;
let analysisMesh = null;

function resizeRenderer() {
    const container = document.getElementById('viewer');
    const width = container.clientWidth;
    const height = container.clientHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
}

renderer.setClearColor(0xd3d3d3); // Light grey background for Three.js
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.getElementById('viewer').appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0x404040, 2);
scene.add(ambientLight);

const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1);
directionalLight1.position.set(0, 20, 10);
directionalLight1.castShadow = true;
scene.add(directionalLight1);

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight2.position.set(-10, 20, -10);
directionalLight2.castShadow = true;
scene.add(directionalLight2);



// Load and update the map model
async function loadFloorsModel() {
    try {
        const modelResponse = await fetch('assets/map.json');
        if (modelResponse.ok) {
            const modelData = await modelResponse.json();
            const loader = new THREE.ObjectLoader();
            if (loadedModel) {
                scene.remove(loadedModel);
            }
            loadedModel = loader.parse(modelData);
            loadedModel.traverse(function(child) {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
            scene.add(loadedModel);
            renderer.render(scene, camera); // Ensure rendering after loading model
        } else {
            console.error('Failed to load facade model');
        }
    } catch (error) {
        console.error('Error fetching facade model:', error);
    }
}

// Load analysis data
async function loadAnalysisData() {
    try {
        const response = await fetch('assets/mapAnalysis.json');
        if (response.ok) {
            const analysisData = await response.json();
            document.getElementById('meanWalkScore').textContent = analysisData["meanWalkScore"];
            document.getElementById('maxWalkScore').textContent = analysisData["maxWalkScore"];
            document.getElementById('minWalkScore').textContent = analysisData["minWalkScore"];
        } else {
            console.error('Failed to load analysis data');
        }
    } catch (error) {
        console.error('Error fetching analysis data:', error);
    }
}

// Set initial states
let isAnalysisVisible = false;
let isFacadeVisible = true;

// Toggle analysis mesh visibility
window.updateAnalysisMeshVisibilityInViewer = function(isVisible) {
    isAnalysisVisible = isVisible;
    if (isAnalysisVisible) {
        loadAnalysisMesh();
    } else if (analysisMesh) {
        scene.remove(analysisMesh);
        renderer.render(scene, camera);
    }
};

// Toggle facade visibility
window.updateFacadeVisibilityInViewer = function(isVisible) {
    isFacadeVisible = isVisible;
    if (isFacadeVisible) {
        loadFloorsModel();
    } else if (loadedModel) {
        scene.remove(loadedModel);
        renderer.render(scene, camera);
    }
};

// Refresh model and analysis
window.refreshModelAndAnalysis = async function() {
    if (isFacadeVisible) {
        await loadFloorsModel();
    }
    if (isAnalysisVisible) {
        await loadAnalysisMesh();
    }
    // Also update analysis data
    await loadAnalysisData();
    console.log('Model and Analysis refreshed');
};

// Combined function to update model and analysis
async function updateModelAndAnalysis() {
    if (isFacadeVisible) {
        await loadFloorsModel();
    }

    // Load and update the analysis data
    await loadAnalysisData();
}

// Set up SSE to listen for updates
const sse = new EventSource('/events');
sse.addEventListener('model-update', () => {
    console.log('Model update detected');
    updateModelAndAnalysis();
});

// Orbit Controls
camera.position.set(0, 2000, 70);
controls.update();

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();

// Resize event
window.addEventListener('resize', resizeRenderer);
resizeRenderer();  // Call once to set initial size

// Initial load of the model and analysis
updateModelAndAnalysis();
