import * as API from './api';
import * as CONFIG from './config';
import Chart from './chart';

const stockChart = new Chart();

// import sampleData from '../sampleData.json';

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
  const dataExcerpt = sliceRandomDataSelection(data.dataPoints, 120);
  const excerptMetadata = getPeriodMetadata(dataExcerpt);
  const symbol = data.metadata['2. Symbol'];
  const metadata = Object.assign({}, excerptMetadata, { symbol });

  return { data: dataExcerpt, metadata };
};

window.onload = async () => {
  const tradingPair = CONFIG.getRandomTradingPair();

  const data = await API.fetchData(tradingPair);

  // const formattedData = API.formatRawData(sampleData);
  const formattedData = API.formatRawData(data);
  const dataExerpt = getDataExerpt(formattedData);

  stockChart.renderGraph(dataExerpt);
};
