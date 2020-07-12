import isNumber from 'lodash/isNumber';
import get from 'lodash/get';
import set from 'lodash/set';
import sortBy from 'lodash/sortBy';
import Head from 'next/head'
import Header from '../components/Header';
import RiskLevels from '../components/RiskLevels';
import { getPaths } from '../utils/getPaths';
import { loadCovidData } from '../utils/loadCovidData';
import styles from './index.module.scss';

function aggregate(items, properties) {
  const paths = getPaths(items[0]);
  const selectedPaths = paths.filter(path => {
    const lastElement = path.split('.').pop();

    return properties.includes(path) || properties.includes(`*.${lastElement}`);
  });

  return items.reduce((aggregate, item) => {
    for (const property of selectedPaths) {
      const total = get(aggregate, property, 0);
      const value = get(item, property, 0);

      set(aggregate, property, total + value);
    }

    return aggregate;
  }, {});
}

function arrayToObject(array, key) {
  return array.reduce((object, item) => {
    object[item[key]] = item;

    return object;
  }, {});
}

function objectToArray(object, property) {
  return Object.keys(object).map(key => ({
    ...object[key],
    [property]: key,
  }));
}

function aggregateData(data) {
  const mappedData = data.map(item => ({
    ...item,
    actualsTimeseries: arrayToObject(item.actualsTimeseries, 'date'),
    timeseries: arrayToObject(item.timeseries, 'date'),
   }));

  const aggregatedData = aggregate(mappedData, [
    '*.cumulativeConfirmedCases',
    '*.cumulativeNegativeTests',
    '*.cumulativePositiveTests',
    '*.cumulativeDeaths',
    '*.contactTracers',
    '*.population',
  ]);

  return {
    ...aggregatedData,
    actualsTimeseries: sortBy(objectToArray(aggregatedData.actualsTimeseries, 'date'), 'date'),
    timeseries: sortBy(objectToArray(aggregatedData.timeseries, 'date'), 'date'),
  }
}

export async function getServerSideProps() {
  const intervention = 'NO_INTERVENTION';
  const data = await loadCovidData(`/us/states.${intervention}.timeseries.json`);
  const countryData = aggregateData(data);

  return {
    props: {
      data: countryData,
    }
  };
}

export default function Home({ data }) {
  return (
    <div>
      <Head>
        <title>COVID-19 Dashboard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header title="United States" />

      <main className={styles.main}>
        {data &&
          <RiskLevels timeseries={data.actualsTimeseries} />
        }

        {!data &&
          <h2>Data Could Not Be Loaded</h2>
        }
      </main>
    </div>
  )
}
