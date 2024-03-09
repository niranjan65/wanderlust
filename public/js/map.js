
            let map_token = mapToken;
            mapboxgl.accessToken = map_token;

            const map = new mapboxgl.Map({
              container: "map", // container ID
              // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
              style: "mapbox://styles/mapbox/streets-v12", // style URL
              center: [-118.788726, 34.025922], // starting position [lng, lat]
              zoom: 9, // starting zoom
            });
            console.log(coordinates)

            // Create a new marker.
            //  const marker = new mapboxgl.Marker()
            //  .setLngLat(coordinates)
            //  .addTo(map);
   