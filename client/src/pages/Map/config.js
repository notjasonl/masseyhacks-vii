var config = {
  style: "mapbox://styles/rbhog/ckpu5xu6b316h17lmnmnal7nz",
  accessToken:
    "pk.eyJ1IjoibWJ4c29sdXRpb25zIiwiYSI6ImNrMm01aG9hdTBlZGwzbXQ1ZXVrNHNmejAifQ.QHQA0N6XPWddCXtvoODHZg",
  showMarkers: false,
  theme: "light",
  title: "",
  subtitle: "",
  byline: "",
  footer: "",
  chapters: [
    {
      id: "phl",
      alignment: "right",
      image: "",
      description:
        "This is a map of every parking violation from the past 3 months in Washington DC. With outside travel and tourism on the rise in the aftermath of COVID, parking will become a greater challenge; both in finding a spot and avoiding fines.",
      location: {
        center: [-77.02196, 38.89557],
        zoom: 11.09,
        pitch: 0.0,
        bearing: 0.0,
      },
      onChapterEnter: [
        {
          layer: "parking-meters",
          opacity: 0.45,
        },
      ],
      onChapterExit: [
        {
          layer: "phl-city-limits",
          opacity: 0,
        },
      ],
    },
    {
      id: "bike-lanes",
      alignment: "right",
      image: "",
      description:
        "DC is divided into 179 census tracts. We use these census tracts to group all the parking violations.",
      location: {
        center: [-75.13901, 39.97085],
        zoom: 11.62,
        pitch: 55.5,
        bearing: -7.2,
      },
      onChapterEnter: [
        {
          layer: "phl-bike-network",
          opacity: 1,
        },
      ],
      onChapterExit: [],
    },
    {
      id: "indego",
      alignment: "right",
      image: "",
      description: "The wealthier tracts see few violations...",
      location: {
        center: [-75.16468, 39.94503],
        zoom: 13.15,
        pitch: 60.0,
        bearing: -16.8,
      },
      onChapterEnter: [
        {
          layer: "indego-stations",
          opacity: 0.8,
        },
      ],
      onChapterExit: [
        {
          layer: "indego-stations",
          opacity: 0,
        },
      ],
    },
    {
      id: "belmont",
      alignment: "right",
      image: "",
      description: "While the poorer tracts suffer.",
      location: {
        center: [-75.20325, 39.99574],
        zoom: 14.99,
        pitch: 44.0,
        bearing: -40.0,
      },
      onChapterEnter: [
        {
          layer: "belmont",
          opacity: 1,
        },
      ],
      onChapterExit: [
        {
          layer: "belmont",
          opacity: 0,
        },
      ],
    },
    {
      id: "wiss",
      alignment: "right",
      image: "",
      description:
        "People in lower-income communities are disproportionately likely to encounter fines and fees. Due to these systems, these families are also prone to already being in debt and to be negatively affected by a sudden financial shock. Fixed fines and fees, therefore, have a greater impact on people of lower-income tracts compared to wealthier tracts; people in lower-income communities are also more likely to see their overall fee amounts increase over time due to late fees and experience severe secondary effects such as job loss or eviction.",
      location: {
        center: [-75.21223, 40.05028],
        zoom: 13.08,
        pitch: 47.5,
        bearing: 32.8,
      },
      onChapterEnter: [
        {
          layer: "wissahickon",
          opacity: 1,
        },
      ],
      onChapterExit: [
        {
          layer: "wissahickon",
          opacity: 0,
        },
      ],
    },
    {
      id: "pennypack",
      alignment: "right",
      title: "Pennypack Park Trails",
      image: "",
      description:
        "Pennypack is a great introduction trail system. Not too steep and not too technical, the beautiful wooded park also provides a great escape from urban life. The south side trails are originally bridle trails, so be nice to equestrians and dismount when you approach them.",
      location: {
        center: [-75.05685, 40.06839],
        zoom: 13.73,
        pitch: 43.5,
        bearing: 96.8,
      },
      onChapterEnter: [
        {
          layer: "pennypack",
          opacity: 1,
        },
      ],
      onChapterExit: [
        {
          layer: "pennypack",
          opacity: 0,
        },
      ],
    },
  ],
};

export default config;
