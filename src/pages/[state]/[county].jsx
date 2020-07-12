import { useRouter } from 'next/router';
import Header from '../../components/Header';
import RiskLevels from '../../components/RiskLevels';
import { firebase } from '../../services/firebase';
import { analyzeTimeseries } from '../../utils/analyzeTimeseries';
import { loadCovidData } from '../../utils/loadCovidData';
import styles from './[county].module.scss';

const baseUrl = 'https://data.covidactnow.org/latest';
const fipsPattern = /^\d{5}$/;

async function getCountyFips(state, county) {
  const database = firebase.firestore();
  const collection = database.collection("fips");
  const query = collection.where("state", "==", state.toUpperCase()).where("name", "==", county);
  const docRefs = await query.get();
  const docs = [];

  docRefs.forEach(docRef => docs.push(docRef.data()));

  if (docs.length === 1) {
    return docs[0].fips;
  } else {
    return undefined;
  }
}


export async function getServerSideProps({ params }) {
  const { state, county } = params;

  if (!state || !county) {
    return {
      props: {
        error: `The ${!state ? 'state' : 'county'} parameter is missing`,
      },
    };
  }

  const fips = county.match(fipsPattern) ? county : await getCountyFips(state, county);
  const intervention = 'NO_INTERVENTION';

  return {
    props: {
      data: await loadCovidData(`/us/counties/${fips}.${intervention}.timeseries.json`),
    },
  };
}

export default function NorthCarolina({ data, error }) {
  const { actualsTimeseries, stateName, countyName } = data || {};

  return (
    <>
      <Header title={`${countyName}, ${stateName}`} />

      <main className={styles.root}>
        {actualsTimeseries &&
          <RiskLevels title={stateName} timeseries={actualsTimeseries} />
        }

        {error &&
          <h2>{error}</h2>
        }
      </main>
    </>
  );
}
