import React, { useRef, useEffect, useState } from "react";
import "./styles.css";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax

import Geocode from "react-geocode";

import data from "./safe_meters";

import { CircularProgress } from "@chakra-ui/react";

import {
  Slide,
  Box,
  Button,
  Divider,
  VStack,
  HStack,
  useDisclosure,
  Text,
  Tooltip,
} from "@chakra-ui/react";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  ModalCloseButton,
} from "@chakra-ui/react";

mapboxgl.accessToken =
  "pk.eyJ1IjoicmJob2ciLCJhIjoiY2tieWE0N3ByMGFhMTJ5dDZldXA2b3E0bCJ9.9m48ruH9QzUOYpeISYI-lg";

/**
 * Paint Constants
 */

const layerTypes = {
  fill: ["fill-opacity"],
  line: ["line-opacity"],
  circle: ["circle-opacity", "circle-stroke-opacity"],
  symbol: ["icon-opacity", "text-opacity"],
  raster: ["raster-opacity"],
  "fill-extrusion": ["fill-extrusion-opacity"],
  heatmap: ["heatmap-opacity"],
};

const alignments = {
  left: "lefty",
  center: "centered",
  right: "righty",
  full: "fully",
};

const MapApp = () => {
  console.log(data);
  console.log("bruh");
  Geocode.setApiKey("AIzaSyAQyDr7D0sUeRtdISh8_khFF1rPZQdoRrM");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const mapContainer = useRef();

  const [lng, setLng] = useState(-77.0369);
  const [lat, setLat] = useState(38.9072);
  const [zoom, setZoom] = useState(11);

  const [map, setMap] = useState();
  const [marker, setMarker] = useState();
  const [coords, setCoords] = useState();
  const [address, setAddress] = useState();

  const [regionCenter, setRegionCenter] = useState();
  const [regionPolygon, setRegionPolygon] = useState();
  const [filteredGeoPoints, setFilteredGeoPoints] = useState();

  const [zoomed, setZoomed] = useState(true);

  function getLayerPaintType(layer) {
    console.log(map.getLayer(layer));
    console.log("H");
    console.log(layer);
    var layerType = map.getLayer(layer).type;
    return layerTypes[layerType];
  }

  function setLayerOpacity(layer) {
    var paintProps = getLayerPaintType(layer.layer);
    paintProps.forEach(function (prop) {
      var options = {};
      if (layer.duration) {
        var transitionProp = prop + "-transition";
        options = { duration: layer.duration };
        map.setPaintProperty(layer.layer, transitionProp, options);
      }
      map.setPaintProperty(layer.layer, prop, layer.opacity, options);
    });
  }

  const getCoordFromAddress = async (addr) => {
    Geocode.fromAddress(addr).then(
      (response) => {
        const { lat, lng } = response.results[0].geometry.location;
        setCoords({ lat, lng });
      },
      (error) => {
        console.error(error);
      }
    );
  };

  // listener for update
  useEffect(() => {});

  // general use effect
  useEffect(() => {
    onOpen();
    const mapElm = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/rbhog/ckptxs4ea0nij17no7lt3q20p",
      center: [lng, lat],
      zoom: zoom,
      antialias: true,
      pitch: 60,
    });
    const markerElm = new mapboxgl.Marker();
    mapElm.on("load", () => {
      const size = 500;
      const pulsingDot = {
        width: size,
        height: size,
        data: new Uint8Array(size * size * 4),

        // When the layer is added to the map,
        // get the rendering context for the map canvas.
        onAdd: function () {
          var canvas = document.createElement("canvas");
          canvas.width = this.width;
          canvas.height = this.height;
          this.context = canvas.getContext("2d");
        },

        // Call once before every frame where the icon will be used.
        render: function () {
          var duration = 1000;
          var t = (performance.now() % duration) / duration;

          var radius = (size / 2) * 0.3;
          var outerRadius = (size / 2) * 0.7 * t + radius;
          var context = this.context;

          // Draw the outer circle.
          context.clearRect(0, 0, this.width, this.height);
          context.beginPath();
          context.arc(
            this.width / 2,
            this.height / 2,
            outerRadius,
            0,
            Math.PI * 2
          );
          context.fillStyle = "rgba(255, 200, 200," + (1 - t) + ")";
          context.fill();

          // Update this image's data with data from the canvas.
          this.data = context.getImageData(0, 0, this.width, this.height).data;

          // Continuously repaint the map, resulting
          // in the smooth animation of the dot.

          mapElm.triggerRepaint();

          // Return `true` to let the map know that the image was updated.
          return true;
        },
      };
      setMap(mapElm);
      setMarker(markerElm);

      mapElm.addImage("pulsing-dot", pulsingDot, { pixelRatio: 2 });

      mapElm.addSource("dot-point", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [0, 0], // icon position [lng, lat]
              },
            },
          ],
        },
      });
      mapElm.addLayer({
        id: "layer-with-pulsing-dot",
        type: "symbol",
        source: "dot-point",
        layout: {
          "icon-image": "pulsing-dot",
        },
      });
      // getCoordFromAddress("12424 Horseshoe Bend Cir, Clarksburg, Maryland");
    });

    // return () => map.remove();
  }, []);

  // listen for new address coords
  useEffect(() => {
    if (map) {
      marker.setLngLat([coords.lng, coords.lat]).addTo(map);
      map.getSource("dot-point").setData({
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [coords.lng, coords.lat], // icon position [lng, lat]
            },
          },
        ],
      });
      map.flyTo({
        duration: 2000,
        center: [coords.lng, coords.lat],
        zoom: 13.05,
        pitch: 0,
        bearing: 0,
      });
    }
  }, [coords]);

  return (
    <div>
      <>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Destination</ModalHeader>
            {/* <ModalCloseButton /> */}
            <ModalBody pb={6}>
              <FormControl>
                <FormLabel>Address</FormLabel>
                <Input
                  placeholder="1800 Liberty St, Windsor"
                  onChange={(e) => {
                    setAddress(e.target.value);
                  }}
                  value={address}
                />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button
                colorScheme="blue"
                mr={3}
                onClick={() => {
                  onClose();
                  getCoordFromAddress(address);
                }}
              >
                find
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <div id="map" className="map-container" ref={mapContainer} />
      </>
    </div>
  );
};

export default MapApp;
