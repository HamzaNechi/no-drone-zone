const airspaceLayers = {};

function loadAirspace(name, color) {
  fetch(`assets/data/airspace/${name}.geojson`)
    .then(res => {
      if (!res.ok) throw new Error(`Erreur chargement ${name}`);
      return res.json();
    })
    .then(data => {
      const layer = L.geoJSON(data, {
        style: {
          color: color,
          fillColor: color,
          fillOpacity: 0.3,
          weight: 2
        },
        onEachFeature: (feature, layer) => {
          if (feature.properties?.name) {
            layer.bindPopup(feature.properties.name);
          }
        }
      });

      airspaceLayers[name] = layer;
      console.log(`✅ ${name} chargé`);

    })
    .catch(err => console.error(err));
}

loadAirspace("fir", "green");
loadAirspace("ctr", "blue");
loadAirspace("restricted", "yellow");
loadAirspace("danger", "orange");
loadAirspace("prohibited", "red");
loadAirspace("limitzone", "purple");

// Toggle UI
document.querySelectorAll(".layerToggle").forEach(cb => {
  cb.addEventListener("change", function () {
    const layer = airspaceLayers[this.value];
    if (!layer) {
      alert("Couche pas encore chargée");
      return;
    }

    this.checked ? map.addLayer(layer) : map.removeLayer(layer);
  });
});
