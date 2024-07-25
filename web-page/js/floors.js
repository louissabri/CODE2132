// Initialize Three.js Scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
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

// Ground plane for shadow
const planeGeometry = new THREE.PlaneGeometry(500, 500);
const planeMaterial = new THREE.ShadowMaterial({ opacity: 0.5 });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = - Math.PI / 2;
plane.position.y = -1;
plane.receiveShadow = true;
scene.add(plane);

// Load and update the facade model
async function loadFacadeModel() {
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
                    // Apply color coding based on name or userData
                    switch (child.name) {
                        case 'meeting':
                            child.material.color.set('red');
                            break;
                        case 'bathrooms':
                            child.material.color.set('green');
                            break;
                        case 'kitchen':
                            child.material.color.set('yellow');
                            break;
                        case 'staircase':
                            child.material.color.set('purple');
                            break;
                        case 'lift':
                            child.material.color.set('lightblue');
                            break;
                    }
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

// Load the analysis mesh
async function loadAnalysisMesh() {
    try {
        const response = await fetch('assets/analysis_mesh.json');
        if (response.ok) {
            const meshData = await response.json();
            const loader = new THREE.ObjectLoader();
            if (analysisMesh) {
                scene.remove(analysisMesh);
            }
            analysisMesh = loader.parse(meshData);
            analysisMesh.traverse(function(child) {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
            scene.add(analysisMesh);
            renderer.render(scene, camera); // Ensure rendering after loading mesh
        } else {
            console.error('Failed to load analysis mesh');
        }
    } catch (error) {
        console.error('Error fetching analysis mesh:', error);
    }
}

// Load analysis data
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
        loadFacadeModel();
    } else if (loadedModel) {
        scene.remove(loadedModel);
        renderer.render(scene, camera);
    }
};

// Refresh model and analysis
window.refreshModelAndAnalysis = async function() {
    if (isFacadeVisible) {
        await loadFacadeModel();
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
        await loadFacadeModel();
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
camera.position.set(0, 50, 0); // Set the camera high above the scene
camera.lookAt(0, 0, 0); // Ensure the camera looks directly at the origin
controls.update();

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', resizeRenderer);
resizeRenderer();  // Call once to set initial size

updateModelAndAnalysis();
