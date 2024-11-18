// Line Chart Data
export const lineCustomSeries = [
  {
    dataSource: [
      { x: "Jan", y: 100 },
      { x: "Feb", y: 123 },
      { x: "Mar", y: 165 },
      { x: "Apr", y: 147 },
      { x: "May", y: 189 },
      { x: "Jun", y: 212 },
    ],
    xName: "x",
    yName: "y",
    name: "Sales",
    width: "2",
    marker: { visible: true, width: 10, height: 10 },
    type: "Line",
  },
];

export const LinePrimaryXAxis = {
  valueType: "Category",
  labelFormat: "y",
  intervalType: "Years",
  edgeLabelPlacement: "Shift",
  majorGridLines: { width: 0 },
  background: "white",
};

export const LinePrimaryYAxis = {
  labelFormat: "{value}",
  rangePadding: "None",
  minimum: 0,
  maximum: 250,
  interval: 50,
  lineStyle: { width: 0 },
  majorTickLines: { width: 0 },
  minorTickLines: { width: 0 },
};

// Area Chart Data
export const areaCustomSeries = [
  {
    dataSource: [
      { x: "Jan", y: 45 },
      { x: "Feb", y: 52 },
      { x: "Mar", y: 61 },
      { x: "Apr", y: 55 },
      { x: "May", y: 63 },
      { x: "Jun", y: 60 },
    ],
    xName: "x",
    yName: "y",
    name: "Engagement",
    opacity: 0.5,
    type: "SplineArea",
    width: "2",
  },
];

export const areaPrimaryXAxis = {
  valueType: "Category",
  majorGridLines: { width: 0 },
  intervalType: "Years",
  edgeLabelPlacement: "Shift",
  labelStyle: { color: "gray" },
};

export const areaPrimaryYAxis = {
  minimum: 0,
  maximum: 100,
  interval: 20,
  lineStyle: { width: 0 },
  majorTickLines: { width: 0 },
  labelStyle: { color: "gray" },
};

// Bar Chart Data
export const barCustomSeries = [
  {
    dataSource: [
      { x: "USA", y: 46 },
      { x: "GBR", y: 27 },
      { x: "CHN", y: 26 },
    ],
    xName: "x",
    yName: "y",
    name: "Customers",
    type: "Column",
  },
];

export const barPrimaryXAxis = {
  valueType: "Category",
  interval: 1,
  majorGridLines: { width: 0 },
};

export const barPrimaryYAxis = {
  majorGridLines: { width: 0 },
  majorTickLines: { width: 0 },
  lineStyle: { width: 0 },
  labelStyle: { color: "transparent" },
};

// Pie Chart Data
export const pieChartData = [
  { x: "Desktop", y: 45, text: "45%" },
  { x: "Mobile", y: 35, text: "35%" },
  { x: "Tablet", y: 20, text: "20%" },
];

// Pyramid Chart Data
export const PyramidData = [
  { x: "Leads", y: 120, text: "120 Leads" },
  { x: "Prospects", y: 85, text: "85 Prospects" },
  { x: "Opportunities", y: 50, text: "50 Opportunities" },
  { x: "Customers", y: 30, text: "30 Customers" },
];

// Color Mapping Chart Data
export const colorMappingData = [
  { x: "Jan", y: 6.96 },
  { x: "Feb", y: 8.9 },
  { x: "Mar", y: 12 },
  { x: "Apr", y: 17.5 },
  { x: "May", y: 22.1 },
  { x: "June", y: 25 },
];

export const ColorMappingPrimaryXAxis = {
  valueType: "Category",
  majorGridLines: { width: 0 },
  title: "Months",
};

export const ColorMappingPrimaryYAxis = {
  lineStyle: { width: 0 },
  majorTickLines: { width: 0 },
  minorTickLines: { width: 0 },
  labelFormat: "{value}°C",
  title: "Temperature",
};

export const rangeColorMapping = [
  {
    label: "1°C to 10°C",
    start: 1,
    end: 10,
    colors: ["#FFFF99"],
  },
  {
    label: "11°C to 20°C",
    start: 11,
    end: 20,
    colors: ["#FFA500"],
  },
  {
    label: "21°C to 30°C",
    start: 21,
    end: 30,
    colors: ["#FF4040"],
  },
];

// Financial Chart Data
export const financialChartData = [
  {
    x: new Date(2017, 1, 1),
    open: 85.02,
    high: 85.03,
    low: 83.82,
    close: 84.44,
    volume: 21,
  },
  {
    x: new Date(2017, 1, 2),
    open: 84.89,
    high: 85.48,
    low: 84.69,
    close: 85.24,
    volume: 22,
  },
  {
    x: new Date(2017, 1, 3),
    open: 85.67,
    high: 86.16,
    low: 85.57,
    close: 86.1,
    volume: 23,
  },
];

export const FinancialPrimaryXAxis = {
  valueType: "DateTime",
  minimum: new Date(2016, 12, 31),
  maximum: new Date(2017, 1, 15),
  crosshairTooltip: { enable: true },
  majorGridLines: { width: 0 },
};

export const FinancialPrimaryYAxis = {
  title: "Price",
  minimum: 80,
  maximum: 90,
  interval: 2,
  lineStyle: { width: 0 },
  majorTickLines: { width: 0 },
};

// Stacked Chart Data
export const stackedChartData = [
  { x: 'Jan', y: 111.1, y1: 76.9, y2: 85.7 },
  { x: 'Feb', y: 127.3, y1: 99.5, y2: 105.4 },
  { x: 'Mar', y: 143.4, y1: 112.9, y2: 118.9 },
  { x: 'Apr', y: 159.9, y1: 122.9, y2: 127.9 },
  { x: 'May', y: 162.3, y1: 125.2, y2: 131.5 },
  { x: 'Jun', y: 158.7, y1: 118.8, y2: 128.3 },
  { x: 'Jul', y: 164.2, y1: 126.7, y2: 135.2 },
];

export const stackedCustomSeries = [
  {
    dataSource: stackedChartData,
    xName: 'x',
    yName: 'y',
    name: 'Revenue',
    type: 'StackingColumn'
  },
  {
    dataSource: stackedChartData,
    xName: 'x',
    yName: 'y1',
    name: 'Budget',
    type: 'StackingColumn'
  },
  {
    dataSource: stackedChartData,
    xName: 'x',
    yName: 'y2',
    name: 'Expense',
    type: 'StackingColumn'
  }
];

export const stackedPrimaryXAxis = {
  majorGridLines: { width: 0 },
  minorGridLines: { width: 0 },
  majorTickLines: { width: 0 },
  minorTickLines: { width: 0 },
  interval: 1,
  lineStyle: { width: 0 },
  labelIntersectAction: 'Rotate45',
  valueType: 'Category'
};

export const stackedPrimaryYAxis = {
  lineStyle: { width: 0 },
  minimum: 0,
  maximum: 400,
  interval: 100,
  majorTickLines: { width: 0 },
  majorGridLines: { width: 1 },
  minorGridLines: { width: 1 },
  minorTickLines: { width: 0 },
  labelFormat: '{value}'
};

// Earnings Data
export const earningData = [
  {
    icon: "💰",
    amount: "$39,354",
    percentage: "+37%",
    title: "Total Revenue",
    iconColor: "#03C9D7",
    iconBg: "#E5FAFB",
    pcColor: "text-green-600"
  },
  {
    icon: "👥",
    amount: "321",
    percentage: "+21%",
    title: "Active Users",
    iconColor: "rgb(255, 244, 229)",
    iconBg: "rgb(254, 201, 15)",
    pcColor: "text-green-600"
  },
  {
    icon: "📊",
    amount: "423",
    percentage: "+38%",
    title: "New Customers",
    iconColor: "rgb(228, 106, 118)",
    iconBg: "rgb(255, 244, 229)",
    pcColor: "text-green-600"
  },
  {
    icon: "💸",
    amount: "$19,354",
    percentage: "-4%",
    title: "Monthly Expenses",
    iconColor: "rgb(0, 194, 146)",
    iconBg: "rgb(235, 250, 242)",
    pcColor: "text-red-600"
  }
];

// SparkLine Area Data
export const SparklineAreaData = [
  { x: 1, yval: 2 },
  { x: 2, yval: 6 },
  { x: 3, yval: 8 },
  { x: 4, yval: 5 },
  { x: 5, yval: 10 },
];
