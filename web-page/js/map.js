/* #npm install express body-parser */

document.addEventListener('DOMContentLoaded', function() {
    const map = L.map('map').setView([-33.8688, 151.2093], 13);  // Set default view to Sydney

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    const drawControl = new L.Control.Draw({
        edit: {
            featureGroup: drawnItems
        },
        draw: {
            polygon: false,
            polyline: false,
            circle: false,
            marker: false,
            rectangle: true
        }
    });
    map.addControl(drawControl);

    map.on(L.Draw.Event.CREATED, function(event) {
        const layer = event.layer;
        drawnItems.clearLayers();
        drawnItems.addLayer(layer);
        map.removeControl(drawControl);  // Remove the draw control to stop drawing
        setTimeout(() => map.addControl(drawControl), 0);  // Re-add the draw control
    });


    const clickableBox = document.getElementById('clickable-box');
    const selectedPoint = document.getElementById('selected-point');

    clickableBox.addEventListener('click', function(event) {
        const rect = clickableBox.getBoundingClientRect();
        const x = event.clientX - rect.left; // x position within the element.
        const y = event.clientY - rect.top;  // y position within the element.

        const xPercent = (x / rect.width).toFixed(2);
        const yPercent = (y / rect.height).toFixed(2);

        document.getElementById('xCoordValue').textContent = xPercent;
        document.getElementById('yCoordValue').textContent = yPercent;

        selectedPoint.style.left = `${x - 5}px`;
        selectedPoint.style.top = `${y - 5}px`;
        selectedPoint.style.display = 'block';
    });

    const downloadButton = L.control({ position: 'topright' });
    downloadButton.onAdd = function() {
        const div = L.DomUtil.create('div', 'download-button');
        div.innerHTML = '<button id="downloadOSM">Download Data</button>';
        return div;
    };
    downloadButton.addTo(map);

    document.getElementById('downloadOSM').addEventListener('click', function() {
        const layers = drawnItems.getLayers();
        if (layers.length === 0) {
            alert('Please draw a rectangle to select the area.');
            return;
        }

        const bounds = layers[0].getBounds();
        const bbox = `${bounds.getSouthWest().lat},${bounds.getSouthWest().lng},${bounds.getNorthEast().lat},${bounds.getNorthEast().lng}`;


        // Save bbox to JSON file
        fetch('/save-bbox', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ bbox: bbox })
        }).then(response => {
            if (response.ok) {
                console.log('Bounding box saved successfully');
            } else {
                console.error('Failed to save bounding box');
            }
        });

    document.getElementById('runAnalysis').addEventListener('click', function() {
        const xCoord = document.getElementById('xCoordValue').textContent;
        const yCoord = document.getElementById('yCoordValue').textContent;

        const pointData = {
            x: xCoord,
            y: yCoord
        };

        // Send point data to server to save
        fetch('/save-point', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pointData)
        }).then(response => {
            if (response.ok) {
                console.log('Point data saved successfully');
            } else {
                console.error('Failed to save point data');
            }
        });
    });
});
});