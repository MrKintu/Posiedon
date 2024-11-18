// Area Chart Configuration
export const areaChartData = [
  { date: new Date(2023, 0, 1), value: 45 },
  { date: new Date(2023, 1, 1), value: 52 },
  { date: new Date(2023, 2, 1), value: 61 },
  { date: new Date(2023, 3, 1), value: 55 },
  { date: new Date(2023, 4, 1), value: 63 },
  { date: new Date(2023, 5, 1), value: 60 }
];

export const areaChartConfig = {
  xAxis: {
    type: 'number' as const,
    domain: ['dataMin', 'dataMax'],
    tickFormatter: (value: number) => {
      const date = new Date(value);
      return date.toLocaleDateString('default', { month: 'short' });
    },
    tickCount: 6,
  },
  yAxis: {
    type: 'number' as const,
    domain: [0, 100],
    tickCount: 6,
    tickFormatter: (value: number) => `${value}%`,
  },
  tooltip: {
    labelFormatter: (value: number) => {
      const date = new Date(value);
      return date.toLocaleDateString('default', { month: 'long', year: 'numeric' });
    }
  }
};

// Financial Chart Configuration
export const candlestickData = [
  { date: new Date('2012-04-02'), open: 85.97, high: 90.66, low: 85.97, close: 90.66 },
  { date: new Date('2012-04-09'), open: 89.01, high: 90.11, low: 86.85, close: 89.70 },
  { date: new Date('2012-04-16'), open: 90.04, high: 93.90, low: 88.74, close: 92.49 },
  { date: new Date('2012-04-23'), open: 92.85, high: 95.65, low: 91.50, close: 93.24 },
  { date: new Date('2012-04-30'), open: 93.55, high: 97.17, low: 92.64, close: 95.15 },
  { date: new Date('2012-05-07'), open: 94.97, high: 96.52, low: 93.25, close: 96.52 },
  { date: new Date('2012-05-14'), open: 96.52, high: 97.97, low: 91.15, close: 91.97 },
  { date: new Date('2012-05-21'), open: 91.51, high: 92.75, low: 90.15, close: 90.91 },
  { date: new Date('2012-05-28'), open: 90.61, high: 92.25, low: 89.45, close: 90.47 },
  { date: new Date('2012-06-04'), open: 90.36, high: 93.45, low: 89.63, close: 93.45 },
  { date: new Date('2012-06-11'), open: 93.45, high: 94.89, low: 92.15, close: 93.06 },
  { date: new Date('2012-06-18'), open: 93.06, high: 96.98, low: 92.75, close: 96.98 },
  { date: new Date('2012-06-25'), open: 96.98, high: 97.42, low: 95.25, close: 96.12 },
  { date: new Date('2012-07-02'), open: 96.12, high: 97.97, low: 95.73, close: 97.97 },
  { date: new Date('2012-07-09'), open: 97.97, high: 99.84, low: 97.20, close: 99.84 },
  { date: new Date('2012-07-16'), open: 99.84, high: 102.15, low: 99.32, close: 100.86 },
  { date: new Date('2012-07-23'), open: 100.86, high: 103.44, low: 100.61, close: 103.44 },
  { date: new Date('2012-07-30'), open: 103.44, high: 105.18, low: 102.91, close: 105.18 },
  { date: new Date('2012-08-06'), open: 105.18, high: 106.89, low: 104.42, close: 106.89 },
  { date: new Date('2012-08-13'), open: 106.89, high: 108.78, low: 106.12, close: 108.78 }
];

export const candlestickConfig = {
  xAxis: {
    type: 'category' as const,
    tickFormatter: (value: string) => {
      const date = new Date(value);
      return date.toLocaleDateString('default', { month: 'short', day: '2-digit' });
    }
  },
  yAxis: {
    type: 'number' as const,
    domain: [80, 120],
    tickCount: 5,
    tickFormatter: (value: number) => `$${value}`
  },
  tooltip: {
    labelFormatter: (value: string) => {
      const date = new Date(value);
      return date.toLocaleDateString('default', { month: 'long', day: '2-digit', year: 'numeric' });
    }
  }
};

// Heat Map Chart Configuration
export const heatMapData = [
  { month: 'Jan', temperature: 6.96 },
  { month: 'Feb', temperature: 8.9 },
  { month: 'Mar', temperature: 12 },
  { month: 'Apr', temperature: 17.5 },
  { month: 'May', temperature: 22.1 },
  { month: 'June', temperature: 25 },
  { month: 'July', temperature: 29.1 },
  { month: 'Aug', temperature: 31.3 },
  { month: 'Sep', temperature: 28.1 },
  { month: 'Oct', temperature: 22.5 },
  { month: 'Nov', temperature: 17 },
  { month: 'Dec', temperature: 8.6 }
];

export const heatMapConfig = {
  xAxis: {
    type: 'category' as const,
    dataKey: 'month',
  },
  yAxis: {
    type: 'number' as const,
    dataKey: 'temperature',
    tickFormatter: (value: number) => `${value}°C`,
  },
  colorScale: [
    { range: [1, 10], color: '#BFEEB7' },
    { range: [11, 20], color: '#82CD79' },
    { range: [21, 30], color: '#FEC200' },
    { range: [31, 40], color: '#FF512F' }
  ]
};
