"use strict";
const countrySection = document.querySelector(".container--countrywise-detail");

class Country {
  constructor() {
    this.getCountryData(this.getCountryFromUrl());
  }

  // Get country name from url
  getCountryFromUrl = function () {
    const params = new URLSearchParams(window.location.search);
    const countryName = params.get("country");
    return countryName;
  }


  getCountryData = function (country) {
    fetch(`https://restcountries.com/v3.1/name/${country}`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const country = data[0];
        this.renderCountryDetails(country);
      });
  };

  getCountryByCode = function (code) {
    fetch(`https://restcountries.com/v3.1/alpha?codes=${code}`)
      .then((response) => response.json())
      .then((data) => {
        const countryName = data[0].name.common;

        const params = new URLSearchParams();
        params.append("country", countryName);

        const url = `details.html?${params.toString()}`;
        location.href = url;
      });
  };

  // Show country details on the redirected page
  showCountryDetail = function (e) {
    if (!e.target.classList.contains("country-border")) return;
    const countryCode = e.target.dataset.countrycode;
    // Also direct to details page to show the details
    this.getCountryByCode(countryCode);
  }

  renderCountryDetails = function (country) {
    const flag = country.flags.svg;
    const name = country.name.common;
    const population = country.population;
    const region = country.region ?? "----";
    const subregion = country.subregion ?? "----";
    const [capital] = country.capital ?? ["----"];
    const [tld] = country.tld ?? ["----"];
    const borders = country.borders ?? [];
    const currencies = Object.values(country.currencies ?? { curr: { name: "----" } })[0].name;
    const languages = Object.values(country.languages ?? {}).join(", ");
    let borderList = "";
    borders.forEach((border) => (borderList += `<li class="country-border" data-countryCode="${border}">${border}</li>\n`));

    const html = `
        <article class="countrywise-detail">
          <img src="${flag}" alt="Country Flag" class="country-img"/>
          <div class="country-info">
            <h1 class="country-info--name">${name}</h1>
            <ul class="country-info--primary">
              <li>
                <span class="key">Native Name</span> : <span class="value">${name}</span>
              </li>
              <li>
                <span class="key">Population</span> : <span class="value">${population}</span>
              </li>
              <li>
                <span class="key">Region</span> : <span class="value">${region}</span>
              </li>
              <li>
                <span class="key">Sub Region</span> : <span class="value">${subregion}</span>
              </li>
              <li>
                <span class="key">Capital</span> : <span class="value">${capital}</span>
              </li>
            </ul>
            <ul class="country-info--secondary">
              <li>
                <span class="key">Top Level Domain</span> : <span class="value">${tld}</span>
              </li>
              <li>
                <span class="key">Currencies</span> : <span class="value">${currencies}</span>
              </li>
              <li>
                <span class="key">Languages</span> : <span class="value">${languages}</span> 
              </li>
            </ul>
            <div class="country-info--border">
              <p class="key">Border Countries:</p>
              <ul class ="value">
                ${borderList}
              </ul>
            </div>
          </div>
        </article>`;

    countrySection.innerHTML = html;

    // Display details of border country when clicked
    this.containerBorder = document.querySelector(".country-info--border");
    this.containerBorder.addEventListener("click", this.showCountryDetail.bind(this));
  };

}

const country = new Country();




