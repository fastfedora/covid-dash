const baseUrl = 'https://data.covidactnow.org/latest';

export async function loadCovidData(path) {
  try {
    const url = `${baseUrl}${path}`;
    const response = await fetch(url);

    if (response.status >= 400) {
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (e) {
    console.error(e);

    return null;
  }
}
