import classnames from 'classnames';
import numeral from 'numeral';
import styles from './PositivityRate.module.scss';

function getRiskLevel(metric) {
  if (metric < .03) {
    return 'green';
  } else if (metric < 0.05) {
    return 'yellow';
  } else if (metric < 0.10) {
    return 'orange';
  } else {
    return 'red';
  }
}

export default function NewCases({ positivityRate }) {
  const riskLevel = getRiskLevel(positivityRate);

  return (
    <div className={classnames(styles.root, styles[`risk-${riskLevel}`])}>
      <h2>Positivity Rate</h2>
      <div className={styles.metric}>
        {numeral(positivityRate).format('0.0%')}
      </div>
      <h3>{riskLevel.toUpperCase()}</h3>
    </div>
  );
}
