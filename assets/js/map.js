const map = L.map('map').setView(
  MAP_CONFIG.center,
  MAP_CONFIG.zoom
);

// Route (OpenStreetMap)
const roadLayer = L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  { attribution: '© OpenStreetMap' }
);

// Satellite (ESRI)
const satelliteLayer = L.tileLayer(
  'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  { attribution: '© ESRI' }
);




// Layer par défaut
roadLayer.addTo(map);



