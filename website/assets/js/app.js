document.addEventListener("DOMContentLoaded",init);

function init(){
loadAppDescription();
}

function loadAppDescription(){
    console.log("Load App Description")
    //! TODO: make sure to change the fetch address before release onto the server!! ==> https://app.peeceetje.be:8443/readAppDescription

    fetch('https://localhost:8443/readAppDescription')

        .then(response => response.json())
        .then(data => {
            // Response is an array of objects (title,alinea)
            fillInAppDescription(data);
        });
}

function fillInAppDescription(data){



    let titleDiv = document.querySelector("#appTitle");
    let infoDiv = document.querySelector("#appDescription")


    titleDiv.innerHTML = `<h2>${data[0].appIntroTitle}</h2>
                          <p>${data[1].appIntroSentence}</p>`;

    infoDiv.innerHTML = `<h2>${data[2].appInfoTitle}</h2>
                          <p>${data[3].appInfoAlinea}</p>`;

}

