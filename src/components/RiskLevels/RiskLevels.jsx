import classnames from 'classnames';
import numeral from 'numeral';
import { analyzeTimeseries } from '../../utils/analyzeTimeseries';
import NewCases from './NewCases';
import PositivityRate from './PositivityRate';
import styles from './RiskLevels.module.scss';

export default function RiskLevels({ title, timeseries }) {
  const analysis = analyzeTimeseries(timeseries);

  return (
    <div className={styles.root}>
      <NewCases cases={analysis.cases} />

      {analysis.positivityRate < 1 &&
        <PositivityRate positivityRate={analysis.positivityRate} />
      }
    </div>
  );
}
