const loadSampleData = async () => {
  const request = await fetch('sampleData.json');
  return request.json();
};

const formatRawData = apiData => {
  const metadata = apiData['Meta Data'];
  const rawDataPoints = apiData['Time Series (Daily)'];

  const dataPoints = Object.keys(rawDataPoints)
    .map(tradingDay => ({
      date: new Date(tradingDay),
      data: parseFloat(rawDataPoints[tradingDay]['4. close'])
    }))
    .sort((a, b) => a.date - b.date);

  return { metadata, dataPoints };
};

const sliceRandomDataSelection = (dataPoints, selectionLength) => {
  const startIndex = Math.floor(Math.random() * (dataPoints.length - selectionLength));
  return dataPoints.slice(startIndex, startIndex + selectionLength);
};

const parseDateBasic = (date, prefix = '') => {
  const [day, month, year] = [date.getDate(), date.getMonth(), date.getFullYear()];

  return {
    [`${prefix}Date`]: date,
    [`${prefix}Day`]: day,
    [`${prefix}Month`]: month,
    [`${prefix}Year`]: year
  };
};

const getPeriodMetadata = data => {
  const startDate = data[0].date;
  const endDate = data[data.length - 1].date;

  const periodDateMeta = Object.assign(
    {},
    parseDateBasic(startDate, 'start'),
    parseDateBasic(endDate, 'end')
  );

  return Object.assign({}, periodDateMeta);
};

const getDataExerpt = data => {
  const dataExcerpt = sliceRandomDataSelection(data.dataPoints, 180);
  const excerptMetadata = getPeriodMetadata(dataExcerpt);
  const symbol = data.metadata['2. Symbol'];
  const metadata = Object.assign({}, excerptMetadata, { symbol });

  return { data: dataExcerpt, metadata };
};

const renderGraph = ({ metadata, data, initialData = [] }) => {
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
};

const pushGraphDataPoints = () => {};

window.onload = async () => {
  const sampleData = await loadSampleData();
  const formattedData = formatRawData(sampleData);

  const dataExerpt = getDataExerpt(formattedData);

  renderGraph(dataExerpt);
};
