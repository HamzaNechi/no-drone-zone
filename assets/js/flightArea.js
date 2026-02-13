function validateFlightArea(flightArea) {

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
