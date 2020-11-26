"use strict";

document.addEventListener("DOMContentLoaded",init)

function init(){
    loadAboutUs();
    loadMembers();
}


function loadAboutUs(){
    console.log("Load About Us")
    //! TODO: make sure to change the fetch address before release onto the server!! ==> https://app.peeceetje.be:8443/readAboutUs

    fetch('https://localhost:8443/readAboutUs')

        .then(response => response.json())
        .then(data => {
            fillInAboutUs(data);
        });
}

function fillInAboutUs(data){
    console.log(data);
    let about = document.querySelector("#about");

    about.innerHTML = `<h2>${data[0].title}</h2>
                       <p>${data[1].alinea}</p>`
}


function loadMembers(){
    console.log("Load App Description")
    //! TODO: make sure to change the fetch address before release onto the server!! ==> https://app.peeceetje.be:8443/readMembers

    fetch('https://localhost:8443/readMembers')

        .then(response => response.json())
        .then(data => {
            fillInMembers(data);
        });
}

function fillInMembers(data){
    let memberOverview = document.querySelector("#memberContainer");

    memberOverview.innerHTML = "";

    data.forEach(function (member) {
        memberOverview.innerHTML += ` <div class="col-md-4 d-flex">
                <div class="card">
                    <img class="card-img-top" src="../assets/media/boardMembers/${member.img}" alt="Card image cap">
                    <div class="card-body">
                        <h5 class="card-title">${member.naam}</h5>
                        <p class="card-text" >${member.beschrijving}</p>
                    </div>
                </div>`;

    })

}

