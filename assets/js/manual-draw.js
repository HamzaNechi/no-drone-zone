let points = [];

const shapeType = document.getElementById('shapeType');
const latInput = document.getElementById('lat');
const lngInput = document.getElementById('lng');
const radiusInput = document.getElementById('radius');
const pointsList = document.getElementById('pointsList');




shapeType.onchange = () => {
  document.getElementById('circleInputs').style.display =
    shapeType.value === 'circle' ? 'block' : 'none';
};

document.getElementById('addPoint').onclick = () => {
  console.log('add point btn clicked');
  const lat = parseCoordinate(latInput.value);
  const lng = parseCoordinate(lngInput.value);

  if (isNaN(lat) || isNaN(lng)) {
    alert('Coordonnées invalides');
    return;
  }

  points.push([lat, lng]);
  pointsList.innerHTML += `<li>${lat}, ${lng}</li>`;

  latInput.value = '';
  lngInput.value = '';
};







function showDroneStatus(type, zoneName = null, validationResult = null) {
  const box = document.getElementById("droneStatus");

  var config = {};
  if (!validationResult.allowed) {
    config = VALIDATION_MESSAGE["forbidden"];
  } else if (validationResult.requiresAuthorization) {
    config = VALIDATION_MESSAGE["authorization"];
  } else {
    config = VALIDATION_MESSAGE["allowed"];
  }


  // Déterminer le nom de la zone
  const zoneDisplay = zoneName || validationResult?.name_zone || "Zone non identifiée";

  // Déterminer le message approprié
  let alertMessage = config.message;
  let alertIcon = config.icon;



  box.style.display = "block";
  box.style.borderLeft = `6px solid ${config.color}`;
  box.style.background = "rgba(255, 255, 255, 0.95)";
  box.style.backdropFilter = "blur(10px)";

  box.innerHTML = `
        <div style="display: flex; align-items: start; gap: 12px;">
            <div style="
                font-size: 28px; 
                line-height: 1;
                color: ${config.color};
            ">${alertIcon}</div>
            
            <div style="flex: 1;">
                <div style="
                    font-weight: 700;
                    font-size: 14px;
                    color: #1a1a1a;
                    margin-bottom: 6px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                ">${type === 'authorization' ? 'AUTORISATION REQUISE' : 'Vol Interdit'}</div>
                
                <div style="
                    font-weight: 600;
                    font-size: 16px;
                    color: #2c3e50;
                    margin-bottom: 8px;
                    line-height: 1.3;
                ">${validationResult.layer} : ${zoneDisplay}</div>
                
                <div style="
                    font-size: 13px;
                    color: #555;
                    line-height: 1.4;
                    padding: 8px 10px;
                    background: rgba(0,0,0,0.03);
                    border-radius: 6px;
                    border-left: 3px solid ${config.color};
                ">${alertMessage}</div>
                
                <!-- Barre de progression -->
                <div style="
                    margin-top: 10px;
                    height: 3px;
                    background: rgba(0,0,0,0.1);
                    border-radius: 2px;
                    overflow: hidden;
                ">
                    <div id="alertProgress" style="
                        height: 100%;
                        background: ${config.color};
                        width: 100%;
                        transition: width 10s linear;
                    "></div>
                </div>
            </div>
        </div>
    `;

  // Annuler le timer précédent s'il existe
  if (alertTimeout) {
    clearTimeout(alertTimeout);
  }

  // Démarrer l'animation de la barre de progression
  setTimeout(() => {
    const progressBar = document.getElementById("alertProgress");
    if (progressBar) {
      progressBar.style.width = "0%";
    }
  }, 10);

  // Timer de fermeture automatique après 10 secondes
  alertTimeout = setTimeout(() => {
    closeDroneStatus();
  }, 10000);
}

function closeDroneStatus() {
  const box = document.getElementById("droneStatus");
  box.style.opacity = "0";
  box.style.transform = "translateX(20px)";
  box.style.transition = "opacity 0.3s ease, transform 0.3s ease";

  setTimeout(() => {
    box.style.display = "none";
    box.style.opacity = "1";
    box.style.transform = "translateX(0)";
  }, 300);

  // Annuler le timer
  if (alertTimeout) {
    clearTimeout(alertTimeout);
    alertTimeout = null;
  }
}



document.getElementById('createShape').onclick = () => {
  if (points.length === 0) return;

  let layer;

  switch (shapeType.value) {
    case 'marker':
      layer = L.marker(points[0]);
      break;

    case 'polyline':
      layer = L.polyline(points, DRAW_STYLE);
      break;

    case 'polygon':
      layer = L.polygon(points, DRAW_STYLE);
      break;

    case 'rectangle':
      if (points.length < 2) {
        alert('Rectangle = 2 points minimum');
        return;
      }
      layer = L.rectangle(points, DRAW_STYLE);
      break;

    case 'circle':
      const radius = parseFloat(radiusInput.value);
      if (!radius) {
        alert('Rayon requis');
        return;
      }
      layer = L.circle(points[0], { radius, ...DRAW_STYLE });
      break;
  }


  const geojson = layer.toGeoJSON();

  const validation = validateFlightArea(geojson);

  if (!validation.allowed) {
    showDroneStatus(validation.level, validation.name_zone, validation);
    drawnItems.addLayer(layer);
    points = [];
    pointsList.innerHTML = '';
    return;
  }


  if (validation.requiresAuthorization) {
    showDroneStatus(validation.level, validation.name_zone, validation);
    drawnItems.addLayer(layer);
    points = [];
    pointsList.innerHTML = '';
    return;
  }

  drawnItems.addLayer(layer);
  points = [];
  pointsList.innerHTML = '';
};
