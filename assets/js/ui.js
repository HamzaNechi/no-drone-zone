document.getElementById('btn-road').onclick = () => {
  map.removeLayer(satelliteLayer);
  map.addLayer(roadLayer);
};

document.getElementById('btn-sat').onclick = () => {
  map.removeLayer(roadLayer);
  map.addLayer(satelliteLayer);
};

document.getElementById('btn-locate').onclick = () => {
  map.locate({ setView: true, maxZoom: 16 });
};

let locationMarker;

map.on('locationfound', (e) => {
  const radius = e.accuracy;

  if (locationMarker) {
    locationMarker.setLatLng(e.latlng);
  } else {
    locationMarker = L.marker(e.latlng).addTo(map);
  }

  locationMarker.bindPopup("📍 Recherche de l'adresse...").openPopup();

  fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${e.latlng.lat}&lon=${e.latlng.lng}&zoom=18&addressdetails=1`, {
    headers: {
      'Accept-Language': 'fr'
    }
  })
    .then(response => response.json())
    .then(data => {
      const address = data.display_name || "Adresse introuvable";
      locationMarker.setPopupContent(`
        <div style="padding: 5px; min-width: 150px;">
          <div style="font-weight: bold; color: #ff6b6b; margin-bottom: 5px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 3px;">
            📍 MA POSITION
          </div>
          <div style="font-size: 13px; line-height: 1.4; color: #ffffff;">
            ${address}
          </div>
          <div style="font-size: 11px; color: rgba(255,255,255,0.6); margin-top: 5px; font-style: italic;">
            Précision: +/- ${Math.round(radius)}m
          </div>
        </div>
      `).openPopup();
    })
    .catch(err => {
      console.error("Erreur reverse geocoding:", err);
      locationMarker.setPopupContent("Impossible de récupérer l'adresse exacte.").openPopup();
    });
});

map.on('locationerror', () => {
  alert('Impossible de récupérer votre position');
});

