import React, { useEffect, useCallback, useState } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  MarkerClusterer,
} from "@react-google-maps/api";
import "./Map.scss";
import MarkerWithInfo from "./MarkerWithInfo";
import Slider from "@mui/material/Slider";
import Box from "@mui/material/Box";

const center = {
  lat: 0.0,
  lng: 0.0,
};

function Map() {
  const [map, setMap] = useState(null);
  const [data, setData] = useState(false);
  const [filteredData, setFilteredData] = useState(false);
  const [bounds, setBounds] = useState(null);
  const [value, setValue] = useState(0);
  const [selector, setSelector] = useState("ALL");

  // fetching data with 1s interval

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          `https://dev.vozilla.pl/api-client-portal/map?objectType=VEHICLE`
        );
        let data = await response.json();
        setData(data.objects);
      } catch (error) {
        console.log(error);
      }
    }

    const id = setInterval(() => {
      fetchData();
    }, 1000);

    fetchData();

    return () => clearInterval(id);
  }, []);

  // Filter data

  useEffect(() => {
    try {
      const filtered = data.filter(
        (item) =>
          item.batteryLevelPct >= value &&
          (item.status === selector || selector === "ALL")
      );
      setFilteredData(filtered);
    } catch (error) {
      console.log(error);
    }
  }, [value, map, selector]);

  // setting initial bounds to map

  useEffect(() => {
    try {
      data.forEach(function (item) {
        bounds.extend({
          lat: item.location.latitude,
          lng: item.location.longitude,
        });
      });
    } catch (error) {
      console.log(error);
    }
  }, [map]);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyAyPROvQGix-NORw-R4f7qF7zNjlt_4Scg",
  });

  const onLoad = useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds();
    setBounds(bounds);
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback() {
    setMap(null);
  }, []);

  const clustererOptions = {
    averageCenter: true,
    title: "VEHICLES",
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function handleClick(click) {
    setSelector(click);
  }

  return data && isLoaded ? (
    <GoogleMap
      mapContainerStyle={{ width: "100vw", height: "100vh" }}
      center={center}
      zoom={10}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      <div className="filters">
        <Box className="width">
          <h5>Battery Level</h5>
          <Slider
            className="pointer"
            value={value}
            aria-label="BatterLevel"
            onChange={handleChange}
            valueLabelDisplay="on"
            step={1}
            color="primary"
          />
        </Box>
        <div className="buttonBox">
          <button id={"ALL"} onClick={(event) => handleClick(event.target.id)}>
            ALL
          </button>
          <button
            id={"AVAILABLE"}
            onClick={(event) => handleClick(event.target.id)}
          >
            AVAILABLE
          </button>
          <button
            id={"UNAVAILABLE"}
            onClick={(event) => handleClick(event.target.id)}
          >
            UNAVAILABLE
          </button>
        </div>
      </div>
      {filteredData && (
        <MarkerClusterer options={clustererOptions}>
          {(clusterer) =>
            filteredData.map((vehicle) => (
              <div key={vehicle.id}>
                <MarkerWithInfo vehicle={vehicle} clusterer={clusterer} />
              </div>
            ))
          }
        </MarkerClusterer>
      )}
    </GoogleMap>
  ) : (
    <div>Loading...</div>
  );
}

export default Map;
