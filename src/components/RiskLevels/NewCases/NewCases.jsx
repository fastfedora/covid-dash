import classnames from 'classnames';
import numeral from 'numeral';
import styles from './NewCases.module.scss';

function getRiskLevel(metric) {
  if (metric < 1) {
    return 'green';
  } else if (metric < 10) {
    return 'yellow';
  } else if (metric < 25) {
    return 'orange';
  } else {
    return 'red';
  }
}

export default function NewCases({ cases }) {
  const riskLevel = getRiskLevel(cases);

  return (
    <div className={classnames(styles.root, styles[`risk-${riskLevel}`])}>
      <h2>New Cases Per Day</h2>
      <div className={styles.metric}>
        {numeral(cases).format('0.0')}
      </div>
      <h3>{riskLevel.toUpperCase()}</h3>
    </div>
  );
}
