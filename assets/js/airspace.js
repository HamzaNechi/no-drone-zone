const airspaceLayers = {};


function applyLoadingAirspace(name, link, color) {
  fetch(link)
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

      airspaceLayers[name].addLayer(layer);

      console.log(`✅ ${link} ajouté`);
    })
    .catch(err => console.error(err));
}

function loadAirspace(name, color) {

  // 🔥 Créer le layerGroup une seule fois
  airspaceLayers[name] = L.layerGroup();

  if (name !== "airports") {
    applyLoadingAirspace(name, `assets/data/airspace/${name}.geojson`, color);
  } else {
    for (let i = 1; i <= 9; i++) {
      applyLoadingAirspace(
        name,
        `assets/data/airspace/airports/${i}.geojson`,
        color
      );
    }
  }
}




loadAirspace("fir", "green");
loadAirspace("ctr", "blue");
loadAirspace("restricted", "yellow");
loadAirspace("danger", "orange");
loadAirspace("prohibited", "red");
loadAirspace("limitzone", "pink");
loadAirspace("airports", "purple")

// Toggle UI
document.querySelectorAll(".layerToggle").forEach(cb => {
  cb.addEventListener("change", function () {
    const layer = airspaceLayers[this.value];
    console.log(layer)
    if (!layer) {
      alert("Couche pas encore chargée");
      return;
    }

    this.checked ? map.addLayer(layer) : map.removeLayer(layer);
  });
});
