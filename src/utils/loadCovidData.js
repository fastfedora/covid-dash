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

    const json = await response.json();

console.log("+++ got json", json != null, json.length || Object.keys(json));

    return json;
  } catch (e) {
    console.error(e);

    return null;
  }
}
