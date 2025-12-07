const cl = console.log;

const countryrow = document.getElementById('countryrow');
const spinner = document.getElementById('spinner');

function snackbar(title, icon) {
    Swal.fire({
        title,
        icon,
        timer: 3000
    });
}

function toggleSpinner(flag) {
    if (flag) {
        spinner.classList.remove('d-none')
    } else {
        spinner.classList.add('d-none')
    }
}

/*const params = new URLSearchParams({
     fields: "name,cca2,flags,region" 
}) let COUNTRY_URL = `${BASE_URL}/?{params.toString()}`;*/

let BASE_URL = 'https://restcountries.com/v3.1/all';
let COUNTRY_URL = `${BASE_URL}/?fields=name,cca2,flags,region`;


const makeApiCall = async (apiUrl, methodName, msgBody) => {
    toggleSpinner(true)
    msgBody = msgBody ? JSON.stringify(msgBody) : null;
    let Obj = {
        method: methodName,
        body: msgBody,
        headers: {
            "Content-Type": "application/json"
        }
    }
    try {
        let res = await fetch(apiUrl, Obj);
        let data = await res.json();

        if (!res.ok) {
            let err = data.error || data.message || res.statusText
            throw new Error(err);
        }
        return data;
    }
    finally {
        toggleSpinner(false)
    }
}


async function fetchAllCountries() {
    try {
        let data = await makeApiCall(COUNTRY_URL, 'GET', null);
        cl(data);

        data.map(c => {
            const col = document.createElement('div');
            col.className = `col-12 col-sm-6 col-md-4 col-lg-3 mb-3`;
            col.innerHTML = `<div class="card h-100 shadow-sm" role="button" 
            aria-label="country-card :Antigua and Barbuda" 
            data-code="${c.cca2}">

                    <img src="${c.flags.png}" 
                    class="card-img-top" 
                    alt="${c.flags.alt}" 
                    title="flag of ${c.flags.alt}"
                    loading="lazy">
                    
                <div class="card-body">
                    <h5 class="card-title mb-1">
                    ${c.name.common || c.name.official}</h5>
                    <p class="card-text text-muted mb-0">
                    <small>Code: <span class="fw-bold">${c.cca2}</span></small>
                    </p>
            </div>
            </div>`
            col.addEventListener('click', () => {
                window.location.href = `country.html?code=${c.cca2}`;
            })
            countryrow.append(col);

        });
    } catch (err) {
        snackbar(`Failed to Fetch Countries`, 'error');
    }

}
fetchAllCountries();



