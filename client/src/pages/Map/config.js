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
      id: "violations-vertical-view",
      alignment: "right",
      image: "",
      description:
        "This is a map of every parking violation from the past 3 months in Washington DC. With outside travel and tourism on the rise in the aftermath of COVID, parking will become a greater challenge; both in finding a spot and avoiding fines.",
      location: {
        duration: 2000,
        center: [-76.966, 38.9077],
        zoom: 11.39,
        pitch: 0.0,
        bearing: 0.0,
      },
      onChapterEnter: [
        {
          layer: "master-violations-circles",
          opacity: 1,
        },
        {
          layer: "tracts-income",
          opacity: 0,
        },
        {
          layer: "wealthiest-tract",
          opacity: 0,
        },
        {
          layer: "poorest-tract",
          opacity: 0,
        },
      ],
      onChapterExit: [],
    },
    {
      id: "violations-side-view",
      alignment: "right",
      image: "",
      description:
        "As you can see, certain areas have a higher occurance of these parking violations.",
      location: {
        duration: 2000,
        center: [-76.996, 38.9017],
        zoom: 12.48,
        pitch: 60.0,
        bearing: -31.2,
      },
      rotateAnimation: true,
      onChapterEnter: [],
      onChapterExit: [
        {
          layer: "master-violations-circles",
          opacity: 0,
        },
      ],
    },
    {
      id: "census-tracts",
      alignment: "right",
      image: "",
      description:
        "DC is divided into 179 census tracts. We use these census tracts to group all the parking violations.",
      location: {
        duration: 2000,
        center: [-76.996, 38.9017],
        zoom: 11.08,
        pitch: 44.5,
        bearing: -26.4,
      },
      rotateAnimation: true,
      onChapterEnter: [
        {
          layer: "tracts-income",
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
        duration: 2000,
        center: [-77.09956, 38.93635],
        zoom: 12.66,
        pitch: 47.5,
        bearing: 48.0,
      },

      onChapterEnter: [
        {
          layer: "tracts-income",
          opacity: 0.2,
        },
        {
          layer: "wealthiest-tract",
          opacity: 1,
        },
      ],
      onChapterExit: [
        {
          layer: "wealthiest-tract",
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
        duration: 2000,
        center: [-77.0224, 38.81799],
        zoom: 13.05,
        pitch: 49.0,
        bearing: -64.8,
      },

      onChapterEnter: [
        {
          layer: "poorest-tract",
          opacity: 1,
        },
        { layer: "tracts-income", opacity: 0 },
      ],
      onChapterExit: [
        {
          layer: "poorest-tract",
          opacity: 0,
        },
        { layer: "tracts-income", opacity: 0 },
      ],
    },
    {
      id: "wiss",
      alignment: "right",
      image: "",
      description:
        "People in lower-income communities are disproportionately likely to encounter fines and fees. Due to these systems, these families are also prone to already being in debt and to be negatively affected by a sudden financial shock. Fixed fines and fees, therefore, have a greater impact on people of lower-income tracts compared to wealthier tracts; people in lower-income communities are also more likely to see their overall fee amounts increase over time due to late fees and experience severe secondary effects such as job loss or eviction.",
      location: {
        duration: 2000,
        center: [-76.996, 38.9017],
        zoom: 11.08,
        pitch: 47.5,
        bearing: 32.8,
      },
      rotateAnimation: true,
      onChapterEnter: [
        {
          layer: "tracts-income",
          opacity: 1,
        },
      ],
      onChapterExit: [
        {
          layer: "tracts-income",
          opacity: 0,
        },
      ],
    },
  ],
};

export default config;
