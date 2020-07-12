const baseUrl = 'https://data.covidactnow.org/latest';

export async function loadCovidData(path) {
  const url = `${baseUrl}${path}`;
  const response = await fetch(url);
  const data = await response.json()

  return {
    props: {
      data
    }
  };
}
