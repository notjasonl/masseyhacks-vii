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
  style: "mapbox://styles/branigan/cjz37rcb003ib1cr3s8rnkt2d",
  accessToken:
    "pk.eyJ1IjoibWJ4c29sdXRpb25zIiwiYSI6ImNrMm01aG9hdTBlZGwzbXQ1ZXVrNHNmejAifQ.QHQA0N6XPWddCXtvoODHZg",
  showMarkers: false,
  theme: "dark",
  use3dTerrain: true,
  title: "Glaciers of Glacier National Park",
  subtitle: "Change in coverage from 1998 to 2015",
  byline: "",
  footer:
    'Source: Story text from Wikipedia, August 2019. Data from <a href="https://www.usgs.gov/centers/norock/science/retreat-glaciers-glacier-national-park">USGS</a>',
  chapters: [
    {
      id: "glacier-np",
      alignment: "full",
      title: "Glacier National Park Glaciers",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/2015-06-19_Glacier_National_Park_%28U.S.%29_8633.jpg/800px-2015-06-19_Glacier_National_Park_%28U.S.%29_8633.jpg",
      description:
        "Glacier National Park is dominated by mountains which were carved into their present shapes by the huge glaciers of the last ice age. These glaciers have largely disappeared over the last 12,000 years. Evidence of widespread glacial action is found throughout the park in the form of U-shaped valleys, cirques, arêtes, and large outflow lakes radiating like fingers from the base of the highest peaks. Since the end of the ice ages, various warming and cooling trends have occurred. The last recent cooling trend was during the Little Ice Age, which took place approximately between 1550 and 1850. During the Little Ice Age, the glaciers in the park expanded and advanced, although to nowhere near as great an extent as they had during the Ice Age.",
      location: {
        center: [-113.91666, 48.66451],
        zoom: 8,
        pitch: 0.0,
        bearing: 0.0,
      },
      onChapterEnter: [
        {
          layer: "gnpglaciers-1998",
          opacity: 0.25,
        },
        {
          layer: "glaciernp-boundary",
          opacity: 0.25,
        },
      ],
      onChapterExit: [
        {
          layer: "glaciernp-boundary",
          opacity: 0,
        },
      ],
    },
    {
      id: "harrison1998",
      alignment: "left",
      title: "Harrison Glacier, 1998",
      image: "",
      description:
        "Harrison Glacier is located in the US state of Montana in Glacier National Park. Situated on a southeast facing ridge immediately south of Mount Jackson, Harrison Glacier is the largest glacier in Glacier National Park. Compared to many of the vanishing glaciers in Glacier National Park, Harrison Glacier has a much higher altitude accumulation zone (approximately 9,000 feet (2,700 m)) which has allowed it to maintain some equilibrium in its glacier mass balance.",
      location: {
        center: [-113.72917, 48.58938],
        zoom: 12.92,
        pitch: 39.5,
        bearing: 36.0,
      },
      onChapterEnter: [],
      onChapterExit: [
        // {
        //     layer: 'gnpglaciers-2015',
        //     opacity: 0
        // }
      ],
    },
    {
      id: "harrison2015",
      alignment: "left",
      title: "Harrison Glacier, 2015",
      image: "",
      description:
        "Between 1998 and 2015, Harrison Glacier lost 169 acres of surface area (about 37%).",
      location: {
        center: [-113.72917, 48.58938],
        zoom: 12.92,
        pitch: 39.5,
        bearing: 36.0,
      },
      onChapterEnter: [
        {
          layer: "gnpglaciers-2015",
          opacity: 0.25,
        },
      ],
      onChapterExit: [
        {
          layer: "gnpglaciers-2015",
          opacity: 0,
        },
      ],
    },
    {
      id: "blackfoot1998",
      alignment: "left",
      title: "Blackfoot Glacier, 1998",
      image: "",
      description:
        "Blackfoot Glacier is the second largest of the remaining 25 glaciers in Glacier National Park, Montana. Blackfoot Glacier is just to the north of Blackfoot Mountain and near Jackson Glacier. When first documented in 1850, the glacier also included the now separate Jackson Glacier and together, they covered 1,875 acres (7.59 km2). In 1850, there were an estimated 150 glaciers in the park. Glaciologists have stated that by the year 2030, all the glaciers in the park may disappear.",
      location: {
        center: [-113.66573, 48.59181],
        zoom: 12.92,
        pitch: 51.5,
        bearing: -26.4,
      },
      onChapterEnter: [],
      onChapterExit: [],
    },
    {
      id: "blackfoot2015",
      alignment: "left",
      title: "Blackfoot Glacier, 2015",
      image: "",
      description:
        "Between 1998 and 2015, Blackfoot Glacier lost 31 acres of surface area (about 8%).",
      location: {
        center: [-113.66573, 48.59181],
        zoom: 12.92,
        pitch: 51.5,
        bearing: -26.4,
      },
      onChapterEnter: [
        {
          layer: "gnpglaciers-2015",
          opacity: 0.25,
        },
      ],
      onChapterExit: [
        {
          layer: "gnpglaciers-2015",
          opacity: 0,
        },
      ],
    },
    {
      id: "agassiz1998",
      alignment: "left",
      title: "Agassiz Glacier, 1998",
      image: "",
      description:
        "Agassiz Glacier is in Glacier National Park in the U.S. state of Montana. It is named after Louis Agassiz, a Swiss-American glaciologist. The glacier is situated in a cirque to the southeast of Kintla Peak west of the Continental Divide. Agassiz Glacier is one of several glaciers that have been selected for monitoring by the U.S. Geological Survey's Glacier Monitoring Research program, which is researching changes to the mass balance of glaciers in and surrounding Glacier National Park.",
      location: {
        center: [-114.15881, 48.93439],
        zoom: 13.51,
        pitch: 41.0,
        bearing: 78.33,
      },
      onChapterEnter: [],
      onChapterExit: [],
    },
    {
      id: "agassiz2015",
      alignment: "left",
      title: "Agassiz Glacier, 2015",
      image: "",
      description:
        "Between 1998 and 2015, Agassiz Glacier lost 108 acres of surface area (about 37%).",
      location: {
        center: [-114.15881, 48.93439],
        zoom: 13.51,
        pitch: 41.0,
        bearing: 78.33,
      },
      onChapterEnter: [
        {
          layer: "gnpglaciers-2015",
          opacity: 0.25,
        },
      ],
      onChapterExit: [
        {
          layer: "gnpglaciers-2015",
          opacity: 0,
        },
      ],
    },
    {
      id: "rainbow1998",
      alignment: "left",
      title: "Rainbow Glacier, 1998",
      image: "",
      description:
        "Rainbow Glacier is in Glacier National Park in the U.S. state of Montana. The glacier is situated immediately to the east of Rainbow Peak at an elevation between 8,500 feet (2,600 m) and 8,000 feet (2,400 m) above sea level. The glacier has visible crevasses in satellite imagery. Rainbow Glacier has shown modest retreat compared to other glaciers in Glacier National Park.",
      location: {
        center: [-114.08659, 48.88039],
        zoom: 13.09,
        pitch: 50.0,
        bearing: -53.6,
      },
      onChapterEnter: [],
      onChapterExit: [],
    },
    {
      id: "rainbow2015",
      alignment: "left",
      title: "Rainbow Glacier, 2015",
      image: "",
      description:
        "Between 1998 and 2015, Rainbow Glacier lost 17 acres of surface area (about 6%).",
      location: {
        center: [-114.08659, 48.88039],
        zoom: 13.09,
        pitch: 50.0,
        bearing: -53.6,
      },
      onChapterEnter: [
        {
          layer: "gnpglaciers-2015",
          opacity: 0.25,
        },
      ],
      onChapterExit: [
        {
          layer: "gnpglaciers-2015",
          opacity: 0,
        },
      ],
    },
    {
      id: "kintla1998",
      alignment: "left",
      title: "Kintla Glacier, 1998",
      image: "",
      description:
        "Kintla Glacier is in Glacier National Park in the U.S. state of Montana. The glacier is situated on a plateau 2 miles (3.2 km) southwest of Kintla Peak at an elevation between 8,700 feet (2,700 m) and 7,700 feet (2,300 m) above sea level. The glacier has numerous crevasses and is actually two glaciers.",
      location: {
        center: [-114.18755, 48.9288],
        zoom: 13.09,
        pitch: 48.5,
        bearing: 164.0,
      },
      onChapterEnter: [],
      onChapterExit: [],
    },
    {
      id: "kintla2015",
      alignment: "left",
      title: "Kintla Glacier, 2015",
      image: "",
      description:
        "Between 1998 and 2015, Harrison Glacier lost 24 acres of surface area (about 10%).",
      location: {
        center: [-114.18755, 48.9288],
        zoom: 13.09,
        pitch: 48.5,
        bearing: 164.0,
      },
      onChapterEnter: [
        {
          layer: "gnpglaciers-2015",
          opacity: 0.25,
        },
      ],
      onChapterExit: [
        {
          layer: "gnpglaciers-2015",
          opacity: 0,
        },
      ],
    },
    {
      id: "sperry1998",
      alignment: "left",
      title: "Sperry Glacier, 1998",
      image: "",
      description:
        "Sperry Glacier is a glacier on the north slopes of Gunsight Mountain west of the Continental Divide in Glacier National Park in the U.S. state of Montana. Although many geologic features of Glacier National Park were formed during the much longer period of glaciation ending over 10,000 years ago, Sperry Glacier — like all the glaciers in the park today — is a product of the recent Little Ice Age, the period of cooler average temperatures starting in about the 13th century and concluding in the mid-19th century.",
      location: {
        center: [-113.75672, 48.62433],
        zoom: 13.68,
        pitch: 34.5,
        bearing: 106.4,
      },
      onChapterEnter: [],
      onChapterExit: [],
    },
    {
      id: "sperry2015",
      alignment: "left",
      title: "Sperry Glacier, 2015",
      image: "",
      description:
        "Between 1998 and 2015, Harrison Glacier lost 37 acres of surface area (about 16%).",
      location: {
        center: [-113.75672, 48.62433],
        zoom: 13.68,
        pitch: 34.5,
        bearing: 106.4,
      },
      onChapterEnter: [
        {
          layer: "gnpglaciers-2015",
          opacity: 0.25,
        },
      ],
      onChapterExit: [
        {
          layer: "gnpglaciers-2015",
          opacity: 0,
        },
      ],
    },
  ],
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
