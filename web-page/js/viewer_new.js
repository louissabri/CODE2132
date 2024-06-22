document.addEventListener('DOMContentLoaded', () => {
    // Initialize Three.js Scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    const container = document.getElementById('viewer');
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 20, 10);
    scene.add(directionalLight);

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    camera.position.set(0, 30, 50);
    controls.update();

    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }
    animate();

    // Load Analysis Mesh
    async function loadAnalysisMesh() {
        try {
            const response = await fetch('assets/analysis_mesh.json');
            if (response.ok) {
                const meshData = await response.json();
                const loader = new THREE.ObjectLoader();
                const analysisMesh = loader.parse(meshData);
                scene.add(analysisMesh);
            } else {
                console.error('Failed to load analysis mesh');
            }
        } catch (error) {
            console.error('Error fetching analysis mesh:', error);
        }
    }

    // Load the analysis mesh initially if needed
    loadAnalysisMesh();

    // Toggle analysis mesh visibility
    window.updateAnalysisMeshVisibilityInViewer = function (isVisible) {
        if (isVisible) {
            loadAnalysisMesh();
        } else {
            scene.traverse(function (object) {
                if (object.isMesh) {
                    scene.remove(object);
                }
            });
        }
        renderer.render(scene, camera);
    };

    // Toggle facade visibility
    window.updateFacadeVisibilityInViewer = function (isVisible) {
        if (isVisible) {
            loadFacadeModel();
        } else {
            scene.traverse(function (object) {
                if (object.isMesh) {
                    scene.remove(object);
                }
            });
        }
        renderer.render(scene, camera);
    };

    async function loadFacadeModel() {
        try {
            const response = await fetch('assets/facade.json');
            if (response.ok) {
                const modelData = await response.json();
                const loader = new THREE.ObjectLoader();
                const loadedModel = loader.parse(modelData);
                scene.add(loadedModel);
            } else {
                console.error('Failed to load facade model');
            }
        } catch (error) {
            console.error('Error fetching facade model:', error);
        }
    }

    // Refresh model and analysis
    window.refreshModelAndAnalysis = async function () {
        await loadFacadeModel();
        await loadAnalysisMesh();
        console.log('Model and Analysis refreshed');
    };
});
