
const calculateDelta = (item, lastItem, property) => (
  (item[property] - lastItem[property]) / (item.population / 100000)
);

const createDeltas = timeseries => (
  timeseries.reduce((deltas, item, index) => {
    if (index > 0) {
      const lastItem = timeseries[index - 1];
      const delta = {
        deltas: {
          confirmedCases: calculateDelta(item, lastItem, 'cumulativeConfirmedCases'),
          deaths: calculateDelta(item, lastItem, 'cumulativeDeaths'),
          negativeTests: calculateDelta(item, lastItem, 'cumulativeNegativeTests'),
          positiveTests: calculateDelta(item, lastItem, 'cumulativePositiveTests'),
        },
        ...item,
      }

      deltas.push(delta);
    }

    return deltas;
  }, [])
);

const createTotals = timeseries => (
  timeseries.reduce((totals, item) => {
    for (const metric in item.deltas) {
      totals[metric] = (totals[metric] || 0) + item.deltas[metric];
    }

    return totals;
  }, {})
)

const createAverages = (totals, span) => {
  const averages = {};

  for (const metric in totals) {
    averages[metric] = totals[metric] / span;
  }

  return averages;
}

export function analyzeTimeseries(timeseries, startOffset = 7, span = 7) {
  const toAnalyze = timeseries.slice(-startOffset - span - 1, -startOffset);
  const deltas = createDeltas(toAnalyze);
  const totals = createTotals(deltas);
  const averages = createAverages(totals, deltas.length);

// console.log("#### analysis", timeseries, totals, averages);

  return {
    cases: averages.confirmedCases,
    positivityRate: averages.positiveTests / (averages.positiveTests + averages.negativeTests),
  };
}
