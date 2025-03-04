import React, { useEffect, useRef } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { Draw, Modify } from "ol/interaction";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { Fill, Stroke, Style } from "ol/style";
import GeoJSON from "ol/format/GeoJSON";
import { defaults as defaultControls } from "ol/control";

const MapPage = ({ name }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const vectorSourceRef = useRef(new VectorSource());
  const drawRef = useRef(null);
  const modifyRef = useRef(null);

  useEffect(() => {
    // Load saved polygons
    const savedPolygons = localStorage.getItem("polygons");
    if (savedPolygons) {
      const features = new GeoJSON().readFeatures(JSON.parse(savedPolygons));
      vectorSourceRef.current.addFeatures(features);
    }

    const vectorLayer = new VectorLayer({
      source: vectorSourceRef.current,
      style: new Style({
        fill: new Fill({ color: "rgba(0, 150, 0, 0.5)" }),
        stroke: new Stroke({ color: "green", width: 2 }),
      }),
    });

    // Create Map Instance
    const map = new Map({
      target: mapRef.current,
      layers: [new TileLayer({ source: new OSM() }), vectorLayer],
      view: new View({ center: [0, 0], zoom: 2 }),
      controls: defaultControls({ attribution: false, rotate: false }),
    });

    mapInstance.current = map; // Store map instance for interactions

    return () => {
      map.setTarget(null);
    };
  }, []);

  const savePolygonsToLocalStorage = () => {
    const features = vectorSourceRef.current.getFeatures();
    const geoJson = new GeoJSON().writeFeatures(features);
    localStorage.setItem("polygons", JSON.stringify(geoJson));
  };

  const addInteraction = () => {
    if (!mapInstance.current) return;

    if (drawRef.current) {
      mapInstance.current.removeInteraction(drawRef.current);
    }

    const draw = new Draw({
      source: vectorSourceRef.current,
      type: "Polygon",
    });

    draw.on("drawend", () => {
      savePolygonsToLocalStorage();
    });

    mapInstance.current.addInteraction(draw);
    drawRef.current = draw;
  };

  const enableEditing = () => {
    if (!mapInstance.current) return;

    if (modifyRef.current) {
      mapInstance.current.removeInteraction(modifyRef.current);
      modifyRef.current = null;
    } else {
      const modify = new Modify({ source: vectorSourceRef.current });

      modify.on("modifyend", () => {
        savePolygonsToLocalStorage();
      });

      mapInstance.current.addInteraction(modify);
      modifyRef.current = modify;
    }
  };

  const removePolygons = () => {
    vectorSourceRef.current.clear();
    localStorage.removeItem("polygons");
  };

  return (
    <div className="map-container">
      <h1 className="header">{name}</h1>
      <div className="controls">
        <button onClick={addInteraction}>Draw Polygon</button>
        <button onClick={enableEditing}>Edit Polygons</button>
        <button onClick={removePolygons}>Delete Polygons</button>
      </div>
      <div ref={mapRef} className="map"></div>
    </div>
  );
};

export default MapPage;