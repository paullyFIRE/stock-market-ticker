export default class Chart {
  constructor() {}

  renderGraph({ metadata, data, initialData = [] }) {
    let dataPoints = initialData.map((dataPoint, index) => {
      return { y: dataPoint.data };
    });
    const chart = new CanvasJS.Chart('chartContainer', {
      animationEnabled: true,
      theme: 'theme2',
      title: {
        text: `${metadata.startDay}-${metadata.startMonth}-${metadata.startYear} to ${
          metadata.endDay
        }-${metadata.endMonth}-${metadata.endYear} (${metadata.symbol})`
      },
      axisX: {
        tickLength: 5,
        lineThickness: 2,
        labelFormatter: function() {
          return '';
        }
      },
      axisY: {
        includeZero: false
      },
      data: [
        {
          type: 'line',
          dataPoints
        }
      ]
    });
    chart.render();
    // Iterate in interval for ticketing effect
    let index = 0;
    setInterval(() => {
      if (index == data.length) {
        clearInterval(this);
      } else {
        dataPoints.push({ y: data[index].data });
        index++;
        chart.render();
      }
    }, 100);
  }
}
