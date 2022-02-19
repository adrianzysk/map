import React, { useState } from "react";
import { Marker, InfoWindow } from "@react-google-maps/api";
import carAvailable from "../png/carAvailable.png";
import carUnavailable from "../png/carUnavailable.png";
import vanAvailable from "../png/vanAvailable.png";
import vanUnavailable from "../png/vanUnavailable.png";
import "./MarkerWithInfo.scss";
import BatteryGauge from "react-battery-gauge";

function MarkerWithInfo({ vehicle, clusterer }) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const checkIcon = (vehicle) => {
    if (vehicle.type === "CAR") {
      if (vehicle.status === "AVAILABLE") {
        return carAvailable;
      } else {
        return carUnavailable;
      }
    } else if (vehicle.type === "TRUCK") {
      if (vehicle.status === "AVAILABLE") {
        return vanAvailable;
      } else {
        return vanUnavailable;
      }
    }
  };

  return (
    <Marker
      clusterer={clusterer}
      position={{
        lat: vehicle.location.latitude,
        lng: vehicle.location.longitude,
      }}
      icon={checkIcon(vehicle)}
      onClick={toggleOpen}
    >
      {isOpen && (
        <InfoWindow onCloseClick={toggleOpen}>
          <div className="info">
            <h3>{vehicle.name}</h3>
            <h4>Color: {vehicle.color}</h4>
            <h4>Plates Number: {vehicle.platesNumber}</h4>
            <h4>Side Number: {vehicle.sideNumber}</h4>
            <h4>Range: {vehicle.rangeKm}</h4>
            <BatteryGauge
              value={vehicle.batteryLevelPct}
              animated={true}
              size={80}
            />
          </div>
        </InfoWindow>
      )}
    </Marker>
  );
}

export default MarkerWithInfo;
