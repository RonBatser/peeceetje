"use strict";

document.addEventListener("DOMContentLoaded", init);


function init() {
    loadInDescription();
}

function loadInDescription() {
    //! TODO: make sure to change the fetch address before release onto the server!! ==> https://app.peeceetje.be:8443/readDescription

    fetch('https://localhost:8443/readDescription')

        .then(response => response.json())
        .then(data => {
            // Response is an array of objects (title,alinea)
            fillInDescription(data);
        });
}

function fillInDescription(data) {
    // Title and alinea are generated into the description div

    let div = document.querySelector("#description");
    let title = data[0].title;
    let alinea = data[1].alinea;

    div.innerHTML += `<h1>${title}</h1>`;
    div.innerHTML += `<p>${alinea}</p>`;

}