/*function validateFlightArea(flightArea) {

    let result = {
        allowed: true,
        level: "allowed",
        requiresAuthorization: false,
        name_zone : ""
    };

    Object.entries(airspaceLayers).forEach(([layerName, layer]) => {

        if (!layer.toGeoJSON) return;
        const geojson = layer.toGeoJSON();
        if (!geojson.features) return;

        geojson.features.forEach(feature => {

            const intersects = turf.booleanIntersects(flightArea, feature);

            if (!intersects) return;

            // 🔴 INTERDICTION TOTALE
            if (layerName === "danger" || layerName === "prohibited") {
                result.allowed = false;
                result.level = "forbidden";
                result.name_zone = feature.properties.name;
            }

            // 🟠 AUTORISATION REQUISE
            if (layerName === "restricted" || layerName === "ctr") {
                result.requiresAuthorization = true;
                result.level = "authorization";
                result.name_zone = feature.properties.name;
            }

        });
    });

    return result;
}
*/



function validateFlightArea(flightArea) {

    let result = {
        allowed: true,
        level: "allowed",
        requiresAuthorization: false,
        name_zone: ""
    };

    let hasAuthorization = false;
    let authorizationZone = "";

    for (const [layerName, layer] of Object.entries(airspaceLayers)) {

        if (!layer.toGeoJSON) continue;

        const geojson = layer.toGeoJSON();
        if (!geojson.features) continue;

        for (const feature of geojson.features) {

            const intersects = turf.booleanIntersects(flightArea, feature);
            if (!intersects) continue;

            // 🔴 PRIORITÉ 1 — INTERDICTION ABSOLUE
            if (layerName === "danger" || layerName === "prohibited") {
                return {
                    allowed: false,
                    level: "forbidden",
                    requiresAuthorization: false,
                    name_zone: feature.properties.name
                };
            }

            // 🟠 PRIORITÉ 2 — AUTORISATION
            if (layerName === "restricted" || layerName === "ctr") {
                hasAuthorization = true;
                authorizationZone = feature.properties.name;
            }

        }
    }

    // Après analyse complète
    if (hasAuthorization) {
        return {
            allowed: true,
            level: "authorization",
            requiresAuthorization: true,
            name_zone: authorizationZone
        };
    }

    return result;
}
