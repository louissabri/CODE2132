// Initialize Three.js Scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / (window.innerHeight * 0.7), 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, physicallyCorrectLights: true });
const controls = new THREE.OrbitControls(camera, renderer.domElement);
let loadedModel = null;
let analysisMesh = null;

document.getElementById('dismiss').addEventListener('click', function() {
    document.getElementById('popup').style.display = 'none';
    localStorage.setItem('cookiesAccepted', 'true'); // Store the user's acceptance
});

window.onload = function() {
    if (localStorage.getItem('cookiesAccepted') !== 'true') { // Check if cookiesAccepted is not set to 'true'
        document.getElementById('popup').style.display = 'flex'; // Show the popup
    } else {
        document.getElementById('popup').style.display = 'none'; // Hide the popup if already accepted
    }
};

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

// Ground plane for shadow
const planeGeometry = new THREE.PlaneGeometry(500, 500);
const planeMaterial = new THREE.ShadowMaterial({ opacity: 0.5 });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = - Math.PI / 2;
plane.position.y = -1;
plane.receiveShadow = true;
scene.add(plane);

// Load and update the floors model
async function loadFloorsModel() {
    try {
        const modelResponse = await fetch('assets/floors.json');
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
            console.error('Failed to load floors model');
        }
    } catch (error) {
        console.error('Error fetching floors model:', error);
    }
}

// Load analysis data
async function loadWalkAnalysisData() {
    try {
        const response = await fetch('assets/walkAnalysis.json');
        if (response.ok) {
            const analysisData = await response.json();
            document.getElementById('maxWalk').textContent = `${analysisData["maxWalk"].toFixed(2)} m`;
            document.getElementById('maxWalkSpeed').textContent = `${analysisData["maxWalkSpeed"].toFixed(2)} seconds`;
            document.getElementById('minWalk').textContent = `${analysisData["minWalk"].toFixed(2)} m`;
            document.getElementById('minWalkSpeed').textContent = `${analysisData["minWalkSpeed"].toFixed(2)} seconds`;
        } else {
            console.error('Failed to load walk analysis data');
        }
    } catch (error) {
        console.error('Error fetching walk analysis data:', error);
    }
}

// Call loadWalkAnalysisData on page load
document.addEventListener('DOMContentLoaded', () => {
    loadWalkAnalysisData();
});

// Set initial states
let isFloorsVisible = true;

// Toggle floors visibility
window.updateFloorsVisibilityInViewer = function(isVisible) {
    isFloorsVisible = isVisible;
    if (isFloorsVisible) {
        loadFloorsModel();
    } else if (loadedModel) {
        scene.remove(loadedModel);
        renderer.render(scene, camera);
    }
};

// Refresh model and analysis
window.refreshModelAndAnalysis = async function() {
    if (isFloorsVisible) {
        await loadFloorsModel();
    }
    // Also update analysis data
    await loadAnalysisData();
    console.log('Model refreshed');
};

// Combined function to update model and analysis
async function updateModelAndAnalysis() {
    if (isFloorsVisible) {
        await loadFloorsModel();
    }
}

// Set up SSE to listen for updates
const sse = new EventSource('/events');
sse.addEventListener('model-update', () => {
    console.log('Model update detected');
    updateModelAndAnalysis();
});

// Orbit Controls
camera.position.set(0, 70, 0);
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
