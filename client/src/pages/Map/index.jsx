import React, { useRef, useEffect, useState } from "react";
import "./styles.css";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax

import { CircularProgress } from "@chakra-ui/react";

import "intersection-observer";
import scrollama from "scrollama";

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

mapboxgl.accessToken =
  "pk.eyJ1Ijoicm9iZXJ0YmFvIiwiYSI6ImNrbmJ4b2EyazB3a2kyb29vdmI4NnFhdHkifQ.eWUrs0-n2fF0u1XZhNbE4w";

/**
 * Paint Constants
 */
 var config = {
  style: 'mapbox://styles/branigan/cjzsvonse027m1co4nkxp13b3',
  accessToken: 'pk.eyJ1IjoibWJ4c29sdXRpb25zIiwiYSI6ImNrMm01aG9hdTBlZGwzbXQ1ZXVrNHNmejAifQ.QHQA0N6XPWddCXtvoODHZg',
  showMarkers: false,
  theme: 'light',
  title: '',
  subtitle: '',
  byline: '',
  footer: '',
  chapters: [
      {
          id: 'phl',
          alignment: 'right',
          title: 'Philadelphia Bicycle Infrastructure',
          image: '',
          description: 'Getting around Philadelphia on two wheels is fast, fun, and cheap. As a typical East Coast large city, the urban core is dense, so there is a lot within reach of a 15 minute ride... even mountain bike trails. Paired with the public transit infrastructure, cycling can be more efficient and much less expensive than driving (and parking) a car.',
          location: {
              center: [-75.13080, 39.97790],
              zoom: 9.83,
              pitch: 0.00,
              bearing: 0.00
          },
          onChapterEnter: [
              {
                  layer: 'phl-city-limits',
                  opacity: .45
              }
          ],
          onChapterExit: [
              {
                  layer: 'phl-city-limits',
                  opacity: 0
              }
          ]
      },
      {
          id: 'bike-lanes',
          alignment: 'right',
          title: 'Bike Lanes',
          image: '',
          description: 'Philadelphia has XX miles of bike lanes, XX miles of which are protected. Drivers are getting more used to sharing the road, but ride defensively.',
          location: {
              center: [-75.13901, 39.97085],
              zoom: 11.62,
              pitch: 55.50,
              bearing: -7.20
          },
          onChapterEnter: [
              {
                  layer: 'phl-bike-network',
                  opacity: 1
              }
          ],
          onChapterExit: []
      },
      {
          id: 'indego',
          alignment: 'right',
          title: 'Indego Bike Share',
          image: '',
          description: 'Indego has been operating in Philadelphia since 20XX. The system initally was focused on Center City, but has expanded service to neighboring areas to support equitable mobility options to the city\'s residents.',
          location: {
              center: [-75.16468, 39.94503],
              zoom: 13.15,
              pitch: 60.00,
              bearing: -16.80
          },
          onChapterEnter: [
              {
                  layer: 'indego-stations',
                  opacity: 0.8
              }
          ],
          onChapterExit: [
              {
                  layer: 'indego-stations',
                  opacity: 0
              }
          ]
      },
      {
          id: 'belmont',
          alignment: 'right',
          title: 'Belmont Plateau Trails',
          image: '',
          description: 'A short ride along the Schuylkill River Trail from the Art Museum, Belmont is a twisty, log-ridden rollercoaster of a trail network. It is easy to get turned around, the underbrush is at times impenetrable, and short steep sections come out of nowhere. In other words, it\'s really fun',
          location: {
              center: [-75.20325, 39.99574],
              zoom: 14.99,
              pitch: 44.00,
              bearing: -40.00
          },
          onChapterEnter: [
              {
                  layer: 'belmont',
                  opacity: 1
              }
          ],
          onChapterExit: [
              {
                  layer: 'belmont',
                  opacity: 0
              }
          ]
      },
      {
          id: 'wiss',
          alignment: 'right',
          title: 'Wissahickon Park Trails',
          image: '',
          description: 'This steep, rocky gorge can be surprisingly technical. Follow the orange and yellow trails to repeatedly climb and descend through the schist hillsides (careful of the cliffs), or stick to the gravel Forbidden Drive for a relaxing ride along the creek. You\'ll forget you\'re in a city.',
          location: {
              center: [-75.21223, 40.05028],
              zoom: 13.08,
              pitch: 47.50,
              bearing: 32.80
          },
          onChapterEnter: [
              {
                  layer: 'wissahickon',
                  opacity: 1
              }
          ],
          onChapterExit: [
              {
                  layer: 'wissahickon',
                  opacity: 0
              }
          ]
      },
      {
          id: 'pennypack',
          alignment: 'right',
          title: 'Pennypack Park Trails',
          image: '',
          description: 'Pennypack is a great introduction trail system. Not too steep and not too technical, the beautiful wooded park also provides a great escape from urban life. The south side trails are originally bridle trails, so be nice to equestrians and dismount when you approach them.',
          location: {
              center: [-75.05685, 40.06839],
              zoom: 13.73,
              pitch: 43.50,
              bearing: 96.80
          },
          onChapterEnter: [
              {
                  layer: 'pennypack',
                  opacity: 1
              }
          ],
          onChapterExit: [
              {
                  layer: 'pennypack',
                  opacity: 0
              }
          ]
      }
  ]
};

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

const Map = () => {
  const mapContainer = useRef();
  const [lng, setLng] = useState(-77.0369);
  const [lat, setLat] = useState(38.9072);
  const [zoom, setZoom] = useState(11);

  const [zoomed, setZoomed] = useState(true);

  const { isOpen, onToggle } = useDisclosure();
  let map;

  function getLayerPaintType(layer) {
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

  // listener for update
  useEffect(() => {});

  // general use effect
  useEffect(() => {
    console.log("hi");
    var story = document.getElementById("story");
    var features = document.createElement("div");
    features.setAttribute("id", "features");

    var header = document.createElement("div");

    if (config.title) {
      var titleText = document.createElement("h1");
      titleText.innerText = config.title;
      header.appendChild(titleText);
    }

    if (config.subtitle) {
      var subtitleText = document.createElement("h2");
      subtitleText.innerText = config.subtitle;
      header.appendChild(subtitleText);
    }

    if (config.byline) {
      var bylineText = document.createElement("p");
      bylineText.innerText = config.byline;
      header.appendChild(bylineText);
    }

    if (header.innerText.length > 0) {
      header.classList.add(config.theme);
      header.setAttribute("id", "header");
      story.appendChild(header);
    }

    config.chapters.forEach((record, idx) => {
      var container = document.createElement("div");
      var chapter = document.createElement("div");

      if (record.title) {
        var title = document.createElement("h3");
        title.innerText = record.title;
        chapter.appendChild(title);
      }

      if (record.image) {
        var image = new Image();
        image.src = record.image;
        chapter.appendChild(image);
      }

      if (record.description) {
        var story = document.createElement("p");
        story.innerHTML = record.description;
        chapter.appendChild(story);
      }

      container.setAttribute("id", record.id);
      container.classList.add("step");
      if (idx === 0) {
        container.classList.add("active");
      }

      chapter.classList.add(config.theme);
      container.appendChild(chapter);
      container.classList.add(alignments[record.alignment] || "centered");
      if (record.hidden) {
        container.classList.add("hidden");
      }
      features.appendChild(container);
    });

    story.appendChild(features);

    var footer = document.createElement("div");

    if (config.footer) {
      var footerText = document.createElement("p");
      footerText.innerHTML = config.footer;
      footer.appendChild(footerText);
    }

    if (footer.innerText.length > 0) {
      footer.classList.add(config.theme);
      footer.setAttribute("id", "footer");
      story.appendChild(footer);
    }

    // mapboxgl.accessToken = config.accessToken;

    const transformRequest = (url) => {
      const hasQuery = url.indexOf("?") !== -1;
      const suffix = hasQuery
        ? "&pluginName=scrollytellingV2"
        : "?pluginName=scrollytellingV2";
      return {
        url: url + suffix,
      };
    };

    map = new mapboxgl.Map({
      container: mapContainer.current,
      style: config.style,
      center: config.chapters[0].location.center,
      zoom: config.chapters[0].location.zoom,
      bearing: config.chapters[0].location.bearing,
      pitch: config.chapters[0].location.pitch,
      interactive: false,
      transformRequest: transformRequest,
    });

    if (config.showMarkers) {
      var marker = new mapboxgl.Marker({ color: config.markerColor });
      marker.setLngLat(config.chapters[0].location.center).addTo(map);
    }

    // instantiate the scrollama
    var scroller = scrollama();

    map.on("load", function () {
      if (config.use3dTerrain) {
        map.addSource("mapbox-dem", {
          type: "raster-dem",
          url: "mapbox://mapbox.mapbox-terrain-dem-v1",
          tileSize: 512,
          maxzoom: 14,
        });
        // add the DEM source as a terrain layer with exaggerated height
        map.setTerrain({ source: "mapbox-dem", exaggeration: 1.5 });

        // add a sky layer that will show when the map is highly pitched
        map.addLayer({
          id: "sky",
          type: "sky",
          paint: {
            "sky-type": "atmosphere",
            "sky-atmosphere-sun": [0.0, 0.0],
            "sky-atmosphere-sun-intensity": 15,
          },
        });
      }

      // setup the instance, pass callback functions
      scroller
        .setup({
          step: ".step",
          offset: 0.5,
          progress: true,
        })
        .onStepEnter((response) => {
          var chapter = config.chapters.find(
            (chap) => chap.id === response.element.id
          );
          response.element.classList.add("active");
          map[chapter.mapAnimation || "flyTo"](chapter.location);

          if (config.showMarkers) {
            marker.setLngLat(chapter.location.center);
          }
          if (chapter.onChapterEnter.length > 0) {
            chapter.onChapterEnter.forEach(setLayerOpacity);
          }
          if (chapter.callback) {
            window[chapter.callback]();
          }
          if (chapter.rotateAnimation) {
            map.once("moveend", function () {
              const rotateNumber = map.getBearing();
              map.rotateTo(rotateNumber + 90, {
                duration: 24000,
                easing: function (t) {
                  return t;
                },
              });
            });
          }
        })
        .onStepExit((response) => {
          var chapter = config.chapters.find(
            (chap) => chap.id === response.element.id
          );
          response.element.classList.remove("active");
          if (chapter.onChapterExit.length > 0) {
            chapter.onChapterExit.forEach(setLayerOpacity);
          }
        });
    });

    return () => map.remove();
  }, []);

  return (
    <div>
      <>
        <div id="map" className="map-container" ref={mapContainer} />
        <div id="story"></div>
      </>
    </div>
  );
};

export default Map;
