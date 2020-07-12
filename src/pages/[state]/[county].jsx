import { useRouter } from 'next/router';
import Header from '../../components/Header';
import RiskLevels from '../../components/RiskLevels';
import { firebase } from '../../services/firebase';
import { analyzeTimeseries } from '../../utils/analyzeTimeseries';
import styles from './[county].module.scss';

const baseUrl = 'https://data.covidactnow.org/latest';

async function getCountyFips(state, county) {
console.log("### getting fips for", state, county);
  const database = firebase.firestore();
  const collection = database.collection("fips");
  const query = collection.where("state", "==", state).where("name", "==", county);
  const docRefs = await query.get();
  const docs = [];

  // console.log("### docRefs", docRefs);

  docRefs.forEach(docRef => docs.push(docRef.data()));

  // console.log("#### result", docs);

  if (docs.length === 1) {
    return docs[0].fips;
  } else {
    return undefined;
  }
}


export async function getServerSideProps({ params }) {
  // const router = useRouter()
  // const { pid } = router.query

console.log("### server context", params);
  // TODO: Throw error if no `params.state`

  const state = params.state.toUpperCase();
  const fips = await getCountyFips(state, params.county);
  const intervention = 'NO_INTERVENTION';
  const url = `${baseUrl}/us/counties/${fips}.${intervention}.timeseries.json`;
  const response = await fetch(url);

console.log("## repsonse", response.status, response.statusText);

  const data = await response.json()

  return {
    props: {
      data
    }
  };
}

export default function NorthCarolina({ data }) {
  const { actualsTimeseries, stateName, countyName } = data;
  const analysis = analyzeTimeseries(actualsTimeseries);

  return (
    <>
      <Header title={`${countyName}, ${stateName}`} />

      <main className={styles.root}>
        <RiskLevels title={stateName} timeseries={actualsTimeseries} />
      </main>
    </>
  );
}
