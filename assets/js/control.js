
/*function saveDrawnLayers() {
    const allFeatures = [];
    drawnItems.eachLayer(layer => {
        allFeatures.push(layer.toGeoJSON());
    });

    const geojsonData = {
        type: "FeatureCollection",
        features: allFeatures
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(geojsonData, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", "data.geojson");
    dlAnchor.click();
}*/






function saveDrawnLayers() {

    const allFeatures = [];

    // 1️⃣ Zones dessinées
    drawnItems.eachLayer(layer => {
        allFeatures.push(layer.toGeoJSON());
    });

    // 2️⃣ Toutes les couches airspace chargées
    Object.values(airspaceLayers).forEach(layerGroup => {

        layerGroup.eachLayer(layer => {
            allFeatures.push(layer.toGeoJSON());
        });

    });

    const geojsonData = {
        type: "FeatureCollection",
        features: allFeatures
    };

    const dataStr = "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(geojsonData, null, 2));

    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", "all_airspace.geojson");
    dlAnchor.click();
}

document.getElementById('saveGeoJSON').onclick = saveDrawnLayers;



document.getElementById('saveGeoJSON').onclick = saveDrawnLayers;

// ====================
// Supprimer tous les layers
// ====================
document.getElementById('clearAll').onclick = () => {
    if (confirm("Supprimer toutes les zones dessinées ?")) {
        drawnItems.clearLayers();
    }
};

// ====================
// Impression / Capture carte
// ====================
// Impression / Capture carte
let printer;

window.addEventListener('load', () => {
    if (typeof L.easyPrint !== 'function') {
        console.error("Leaflet.EasyPrint non chargé !");
        return;
    }

    printer = L.easyPrint({
        title: 'Imprimer la carte',
        position: 'topright',
        exportOnly: true,   // true = ne génère que PDF / image
        hideControlContainer: false
    }).addTo(map); // <-- utiliser 'map' et pas 'mapControl'
});




document.getElementById('printMap').onclick = () => {
    const mapDiv = document.getElementById('map');

    domtoimage.toPng(mapDiv, {
        width: mapDiv.clientWidth * 2,   // double la largeur
        height: mapDiv.clientHeight * 2, // double la hauteur
        style: {
            transform: 'scale(2)',       // mise à l’échelle
            transformOrigin: 'top left'
        }
    })
    .then(function (dataUrl) {
        const link = document.createElement('a');
        link.download = 'map-drone.png';
        link.href = dataUrl;
        link.click();
    })
    .catch(function (error) {
        console.error('Erreur capture carte:', error);
    });
};



