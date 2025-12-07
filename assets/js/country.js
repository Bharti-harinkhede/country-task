const cl = console.log;
const spinner = document.getElementById("spinner");

function toggleSpinner(flag) {
    if (flag) {
        spinner.classList.remove('d-none')
    } else {
        spinner.classList.add('d-none')
    }
}

function snackbar(icon, title) {
    Swal.fire({
        icon,
        title,
        timer: 3000
    });
}

const param = new URLSearchParams(window.location.search);
const code = param.get("code");
cl("country code:", code);

const countryUrl = `https://restcountries.com/v3.1/alpha/${code}`;

const makeApiCall = async (apiUrl) => {
    toggleSpinner(true);
    try {
        let res = await fetch(apiUrl);
        let data = await res.json();

        if (!res.ok) {
            let err = data.error || data.message || res.statusText;
            throw new Error(err);
        }
        return data;
    } finally {
        toggleSpinner(false);
    }
}

const patchData = (data) => {
    document.getElementById("flagImg").src = data.flags.png;
    document.getElementById("countryName").innerText = data.name.common;
    document.getElementById("officialName").innerText = data.name.official || data.name.common;
    document.getElementById("capital").innerText = (data.capital && data.capital[0]) || "N/A";
    document.getElementById("region").innerText = data.region || "N/A";
    document.getElementById("subRegion").innerText = data.subregion || "N/A";
    document.getElementById("population").innerText = data.population || "N/A";
    document.getElementById("area").innerText = data.area || "N/A";

    document.getElementById("languages").innerText =
        Object.values(data.languages || {}).join(", ") || "N/A";

    document.getElementById("currencies").innerText =
        Object.values(data.currencies || {})
        .map(c => `${c.name} (${c.symbol})`)
        .join(", ") || "N/A";

    cl(data.maps.googleMaps);

    const mapAnchor = document.getElementById("maps");
    mapAnchor.href = data.maps.googleMaps;
    mapAnchor.innerText = "Open in Map";

    const codeMap = JSON.parse(localStorage.getItem("Data") || "{}");
    cl(codeMap);

    if (data.borders) {
        document.getElementById("borders").innerHTML = data.borders.map(c => {
            return `<a href="country.html?code=${c}" class="btn btn-link">${codeMap[c] || c}</a>`;
        }).join(" ");
    } else {
        document.getElementById("borders").innerHTML = `<strong>No Borders</strong>`;
    }
}

const loadCountry = async () => {
    try {
        const data = await makeApiCall(countryUrl);
        const Cdata = Array.isArray(data) ? data[0] : data;
        cl(Cdata);
        patchData(Cdata);
    } catch (err) {
        snackbar("error", err.message || "Failed to load country");
    }
}

loadCountry();
