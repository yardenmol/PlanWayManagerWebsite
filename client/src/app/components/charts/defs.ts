//
// Options and Data definitions
//
export const ChartTypes = [
  '',
  'pieChart',
  'donutChart',
];

const color = d3.scale.category20()

export const AllOptions = {
  pieChart: {
    chart: {
      type: 'pieChart',
      height: 500,
      x: function(d){return d.key;},
      y: function(d){return d.y;},
      showLabels: true,
      duration: 500,
      labelThreshold: 0.01,
      labelSunbeamLayout: true,
      legend: {
        margin: {
          top: 5,
          right: 35,
          bottom: 5,
          left: 0
        }
      }
    }
  },
  donutChart: {
    chart: {
      type: 'pieChart',
      height: 500,
      donut: true,
      x: function(d){return d.key;},
      y: function(d){return d.y;},
      showLabels: true,
      pie: {
        startAngle: function(d) { return d.startAngle/2 -Math.PI/2 },
        endAngle: function(d) { return d.endAngle/2 -Math.PI/2 }
      },
      duration: 500,
      legend: {
        margin: {
          top: 5,
          right: 140,
          bottom: 5,
          left: 0
        }
      }
    }
  },
};
