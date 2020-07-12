import Head from 'next/head'
import Header from '../components/Header';
import RegionSearch from '../components/RegionSearch';
import RiskLevels from '../components/RiskLevels';
import { analyzeTimeseries } from '../utils/analyzeTimeseries';
import { loadCovidData } from '../utils/loadCovidData';
import styles from './index.module.scss';

export async function getServerSideProps() {
  const intervention = 'NO_INTERVENTION';

  return await loadCovidData(`/us/states.${intervention}.timeseries.json`);
}


export default function Home({ data }) {
  // const { states } = data;

console.log("data", data);

  return (
    <div>
      <Head>
        <title>COVID-19 Dashboard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header title="United States" />

      <main className={styles.main}>
        {data.map(stateData => (
          <div className={styles.state} key={stateData.fips}>
            <h2>{stateData.stateName}</h2>
            <RiskLevels timeseries={stateData.actualsTimeseries} />
          </div>
        ))}
      </main>
    </div>
  )
}
