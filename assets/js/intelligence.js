// ================================
// DRONE INTELLIGENCE - Zones avec distance + direction
// ================================


const ZONE_RULES = {
    danger:      { alert: true, buffer: 1000 },
    prohibited:  { alert: true, buffer: 0 },
    restricted:  { alert: true, buffer: 2000 },
    ctr:         { alert: true, buffer: 5000 },
    fir:         { alert: false, buffer: null }
};


const ZONE_LABELS = {
    ctr: {
        title: "Zone contrôlée (CTR)",
        message: "Autorisation de l’aviation civile requise"
    },
    restricted: {
        title: "Zone réglementée",
        message: "Autorisation spéciale requise"
    },
    danger: {
        title: "Zone dangereuse",
        message: "Vol interdit (champ de tir / activité militaire)"
    },
    prohibited: {
        title: "Zone interdite",
        message: "Vol strictement interdit"
    }
};




function analyzeDronePosition(lat, lng) {
    const dronePoint = turf.point([lng, lat]);
    let detectedZones = [];

    Object.entries(airspaceLayers).forEach(([layerName, layer]) => {
        const rule = ZONE_RULES[layerName];
        if (!rule || !rule.alert) return; // ⛔ FIR ignoré

        if (!layer.toGeoJSON) return;
        const geojson = layer.toGeoJSON();
        if (!geojson.features) return;

        geojson.features.forEach(feature => {

            const isInside = turf.booleanPointInPolygon(dronePoint, feature);

            let distance = Infinity;
            if (!isInside && rule.buffer !== null) {
                const nearestPoint = turf.nearestPointOnLine(
                    turf.polygonToLine(feature),
                    dronePoint
                );
                distance = turf.distance(dronePoint, nearestPoint, { units: 'meters' });
            }

            // 🔔 ALERTE uniquement si :
            // - drone DANS la zone
            // - ou proche selon buffer défini
            if (isInside || distance <= rule.buffer) {
                const center = turf.center(feature);
                const bearing = turf.bearing(dronePoint, center);

                detectedZones.push({
                    type: layerName,
                    name: feature.properties.name,
                    distance: isInside ? 0 : distance,
                    direction: getDirectionFromBearing(bearing),
                    inside: isInside
                });
            }
        });
    });

    updateUI(detectedZones);
}



// ================================
// Convertit l'angle en direction texte
// ================================
function getDirectionFromBearing(bearing) {
    if (bearing < 0) bearing += 360; // Turf retourne -180..180
    if (bearing >= 337.5 || bearing < 22.5) return "Nord";
    if (bearing >= 22.5 && bearing < 67.5) return "Nord-Est";
    if (bearing >= 67.5 && bearing < 112.5) return "Est";
    if (bearing >= 112.5 && bearing < 157.5) return "Sud-Est";
    if (bearing >= 157.5 && bearing < 202.5) return "Sud";
    if (bearing >= 202.5 && bearing < 247.5) return "Sud-Ouest";
    if (bearing >= 247.5 && bearing < 292.5) return "Ouest";
    if (bearing >= 292.5 && bearing < 337.5) return "Nord-Ouest";
    return "";
}

// ================================
// UPDATE UI avec direction
// ================================
function updateUI(zones) {
    const container = document.getElementById("droneStatus");

    if (zones.length === 0) {
        container.style.display = "none";
        return;
    }

    container.style.display = "block";

    // Priorité des zones
    const priority = { danger: 4, prohibited: 4, restricted: 3, ctr: 2 };
    zones.sort((a, b) => (priority[b.type] || 0) - (priority[a.type] || 0));
    const zone = zones[0];

    const label = ZONE_LABELS[zone.type];

    let color = "orange";
    if (zone.inside) color = "red";
    else if (zone.distance < 100) color = "#ff9800";

    container.innerHTML = `
        <button style="
            width: 100%;
            padding: 12px;
            border: none;
            border-radius: 8px;
            background-color: ${color};
            color: white;
            font-weight: bold;
        ">
            ${label.title}
        </button>

        <p><strong>Nom :</strong> ${zone.name}</p>

        ${
            zone.inside
                ? `<p><strong>⚠️ Drone DANS la zone</strong></p>`
                : `<p><strong>Distance :</strong> ${zone.distance.toFixed(0)} m (${zone.direction})</p>`
        }

        <p style="margin-top:8px;"><strong>Règle :</strong> ${label.message}</p>
    `;
}


