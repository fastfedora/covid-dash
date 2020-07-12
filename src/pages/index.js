import Head from 'next/head'
import Header from '../components/Header';
import RiskLevels from '../components/RiskLevels';
import { loadCovidData } from '../utils/loadCovidData';
import styles from './index.module.scss';

export async function getServerSideProps() {
  const intervention = 'NO_INTERVENTION';

  return {
    props: {
      data:  await loadCovidData(`/us/states.${intervention}.timeseries.json`),
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
        {data && data.map(stateData => (
          <div className={styles.state} key={stateData.fips}>
            <h2>{stateData.stateName}</h2>
            <RiskLevels timeseries={stateData.actualsTimeseries} />
          </div>
        ))}

        {!data &&
          <h2>Data Could Not Be Loaded</h2>
        }
      </main>
    </div>
  )
}
