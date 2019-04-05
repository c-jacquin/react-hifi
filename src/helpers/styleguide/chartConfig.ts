export const barChartConfig = {
  maintainAspectRatio: false,
  legend: {
    display: false,
  },
  scales: {
    xAxes: [
      {
        display: true,
        gridLines: {
          display: false,
        },
        scaleLabel: {
          display: true,
        },
      },
    ],
    yAxes: [
      {
        ticks: {
          display: false,
          min: 0,
          max: 200,
        },
        gridLines: {
          display: false,
        },
        scaleLabel: {
          display: false,
        },
      },
    ],
  },
};
