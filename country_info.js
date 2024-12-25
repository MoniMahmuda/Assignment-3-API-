async function searchCountry() {
    const countryName = document.getElementById('searchBar').value.trim();
    if (!countryName) {
        alert('Please enter a country name.');
        return;
    }

    try {
        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
        if (!response.ok) {
            throw new Error('Country not found');
        }

        const data = await response.json();
        const country = data[0];

        const currencies = country.currencies 
            ? Object.values(country.currencies).map(currency => currency.name).join(', ') 
            : 'N/A';

        document.getElementById('basicInfo').innerHTML = `
            <div class="row border p-3">
                <div class="col-md-4">
                    <img src="${country.flags.png}" alt="Flag of ${country.name.common}" class="img-fluid">
                </div>
                <div class="col-md-8">
                    <h3>${country.name.common}</h3>
                    <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : 'N/A'}</p>
                    <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
                    <p><strong>Region:</strong> ${country.region}</p>
                    <p><strong>Currency:</strong> ${currencies}</p>
                    <button class="btn btn-secondary" onclick="showMoreDetails('${country.cca2}', '${country.capital ? country.capital[0] : ''}')">More Details</button>
                </div>
            </div>
        `;

        document.getElementById('moreDetails').innerHTML = '';
    } catch (error) {
        alert(error.message);
    }
}

async function showMoreDetails(countryCode, capital) {
    if (!capital) {
        alert('Capital city information is not available.');
        return;
    }

    try {
        const [countryResponse, weatherResponse] = await Promise.all([
            fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`),
            fetch(`https://api.weatherapi.com/v1/current.json?key=f65db728f9a34760a62193119242312&q=${capital}`)
        ]);

        if (!countryResponse.ok) {
            throw new Error('Could not fetch country details.');
        }

        const countryData = await countryResponse.json();
        const country = countryData[0];

        const area = country.area ? country.area.toLocaleString() : 'N/A';
        const languages = country.languages
            ? Object.values(country.languages).join(', ')
            : 'N/A';

        let weatherInfo = '';
        if (weatherResponse.ok) {
            const weather = await weatherResponse.json();
            weatherInfo = `
                <p><strong>Current Temperature:</strong> ${weather.current.temp_c}°C</p>
                <p><strong>Condition:</strong> ${weather.current.condition.text}</p>
                <img src="${weather.current.condition.icon}" alt="Weather Icon" class="img-fluid">
            `;
        } else {
            weatherInfo = '<p>Weather information is not available.</p>';
        }

        document.getElementById('moreDetails').innerHTML = `
            <div class="row border p-3">
                <div class="col-md-6">
                    <p><strong>Region:</strong> ${country.region}</p>
                    <p><strong>Subregion:</strong> ${country.subregion}</p>
                    <p><strong>Area:</strong> ${area} km²</p>
                    <p><strong>Languages:</strong> ${languages}</p>
                </div>
                <div class="col-md-6">
                    ${weatherInfo}
                </div>
            </div>
        `;
    } catch (error) {
        alert(error.message);
    }
}