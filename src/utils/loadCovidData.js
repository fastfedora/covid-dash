const baseUrl = 'https://data.covidactnow.org/latest';

export async function loadCovidData(path) {
  try {
    const url = `${baseUrl}${path}`;
console.log("+++ loading data from ", url);
    const response = await fetch(url);

console.log("+++ got response", response.status, response.statusText);

    if (response.status >= 400) {
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (e) {
    console.error(e);

    return null;
  }
}
