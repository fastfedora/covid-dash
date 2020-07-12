import RiskLevels from '../components/RiskLevels';
import { analyzeTimeseries } from '../utils/analyzeTimeseries';
import styles from './[state].module.scss';

const baseUrl = 'https://data.covidactnow.org/latest';

export async function getServerSideProps({ params }) {
  // TODO: Throw error if no `params.state`

  const state = params.state.toUpperCase();
  const intervention = 'NO_INTERVENTION';
  const url = `${baseUrl}/us/states/${state}.${intervention}.timeseries.json`;
  const response = await fetch(url);
  const data = await response.json()

  return {
    props: {
      data
    }
  };
}

export default function NorthCarolina({ data }) {
  const { actualsTimeseries, stateName } = data;
  const analysis = analyzeTimeseries(actualsTimeseries);
  const title = stateName;

  return (
    <div className={styles.root}>
      <h1>{title}</h1>

      <RiskLevels title={stateName} timeseries={actualsTimeseries} />
    </div>
  );
}
