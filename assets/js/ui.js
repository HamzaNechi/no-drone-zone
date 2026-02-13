document.getElementById('btn-road').onclick = () => {
  map.removeLayer(satelliteLayer);
  map.addLayer(roadLayer);
};

document.getElementById('btn-sat').onclick = () => {
  map.removeLayer(roadLayer);
  map.addLayer(satelliteLayer);
};

document.getElementById('btn-locate').onclick = () => {
  map.locate({ setView: true, maxZoom: 14 });
};

map.on('locationerror', () => {
  alert('Impossible de récupérer votre position');
});
