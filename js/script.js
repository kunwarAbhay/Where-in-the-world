"use strict";
const containerCountry = document.querySelector(".container--country");
const inputContinent = document.querySelector(".search-continent");
const inputSearch = document.querySelector(".search-country");
const continents = new Set([
    "Africa",
    "Americas",
    "Antarctic",
    "Asia",
    "Europe",
    "Oceania",
]);

/* ================ */
/* DICTIONARY CLASS */
/* ================ */

class Node {
    constructor(char) {
        this.char = char;
        this.children = {};
        this.isEnd = false;
    }

    markAsLeaf() {
        this.isEnd = true;
    }
}

class Dictionary {
    constructor() {
        this.root = new Node("");
    }

    // Insert a word in Dictionary
    insert(word) {
        if (!word) return;
        word = word.toLowerCase();

        let curr = this.root;

        for (const char of word) {
            if (!curr.children.hasOwnProperty(char)) {
                curr.children[char] = new Node(char);
            }
            curr = curr.children[char];
        }

        curr.markAsLeaf();
    }

    // Search word of a given prefix
    search(prefix) {
        if (!prefix) return;

        let prefixStr = "";
        let curr = this.root;

        for (const char of prefix) {
            if (curr.children.hasOwnProperty(char)) {
                curr = curr.children[char];
                prefixStr += curr.char;
            } else {
                break;
            }
        }

        // Search all the word with a given prefix string(prefixStr)
        function prefixSearch(node, str) {
            if (node.isEnd) {
                const country = document.querySelector(`.${str}`);
                if (country) country.classList.remove("hidden");
            }

            const childrens = node.children;
            for (const child in childrens) {
                prefixSearch(childrens[child], str + childrens[child].char);
            }
        }

        prefixSearch(curr, prefixStr);
    }
}


/* ================ */
/* COUNTRY CLASS */
/* ================ */
class Country {
    constructor(dictionary) {
        this.dictionary = dictionary;
        this.getAllCountry();
        inputSearch.addEventListener("keyup", this.searchCountry.bind(this));
        inputContinent.addEventListener("change", this.filterByContinent.bind(this));
        containerCountry.addEventListener("click", this.showCountryDetail.bind(this));
    }

    getAllCountry = function () {
        fetch("https://restcountries.com/v3.1/all?fileds=flag,name,population,region,capital")
            .then((response) => response.json())
            .then((data) => {
                for (const country of data) {
                    this.renderCountry(country);
                }
            });
    };

    // Show country details on the redirected page
    showCountryDetail = function (e) {
        const countryEl = e.target.closest(".country");
        const countryName = countryEl.dataset.country;

        const params = new URLSearchParams();
        params.append("country", countryName);

        const url = `details.html?${params.toString()}`;
        location.href = url;
    }

    renderCountry = function (country) {
        const flag = country.flags.svg;
        const name = country.name.common;
        const population = country.population;
        const region = country.region;
        const [capital] = country.capital ?? ["----"];

        // codename for each country
        // we will select country card through this codename
        let codeName = name.split(" ").join("-").toLowerCase();

        const html = `
        <figure class="country ${codeName} ${region}" data-country="${name}">
            <img src="${flag}" alt="Country Flag" class="country-flag" />
            <div class="country-detail">
              <h3 class="country-name">${name}</h3>
              <ul>
                <li>
                    <span class="key">Population</span> : <span class="value">${population}</span></li>
                <li>
                    <span class="key">Region</span> : <span class="value">${region}</span>
                </li>
                <li>
                    <span class="key">Capital</span> : <span class="value">${capital}</span>
                </li>
              </ul>
            </div>
        </figure>`;

        containerCountry.insertAdjacentHTML("beforeend", html);
        this.dictionary.insert(codeName);
    };

    searchCountry = function () {
        const prefix = inputSearch.value.toLowerCase();
        const allCountry = document.querySelectorAll(".country");
        if (prefix === "") {
            allCountry.forEach((country) => country.classList.remove("hidden"));
        } else {
            allCountry.forEach((country) => country.classList.add("hidden"));
            this.dictionary.search(prefix);
        }
    };


    filterByContinent = function () {
        const continent = inputContinent.value;
        const allCountry = document.querySelectorAll(".country");

        // CHECK VALIDITY
        if (!continents.has(continent)) {
            // Show all country
            allCountry.forEach((country) => country.classList.remove("hidden"));
            return;
        }

        // Hide all country
        allCountry.forEach((country) => country.classList.add("hidden"));

        // Show country of selected continent
        const countryOfContinent = document.querySelectorAll(`.${continent}`);
        countryOfContinent.forEach((country) => country.classList.remove("hidden"));
    };
}


const dictionary = new Dictionary();
const country = new Country(dictionary);