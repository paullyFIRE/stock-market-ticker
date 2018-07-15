import { rejects } from 'assert';

export const formatRawData = apiData => {
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

export const fetchData = (tradingKey = 'MSFT') =>
  new Promise((resolve, reject) => {
    const baseRequest =
      'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&interval=15min&outputsize=full&apikey=TCC2FKDPZ8S2C3UD&symbol=';

    console.log('Fetching...');

    fetch(baseRequest + tradingKey)
      .then(resp => resp.json())
      .then(resolve)
      .catch(reject);
  });
