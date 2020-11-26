"use strict";

document.addEventListener("DOMContentLoaded", init);


function init() {
    /*  let cookie = document.cookie;
      console.log(cookie.split("=")[1]);
     if (cookie.split("=")[1] !== "admin"){
          location.replace("./401.html")
      }*/
    document.querySelector("#submitDescription").addEventListener('click', changeDescription);
    document.querySelector("#submitAppDescription").addEventListener('click', changeAppDescription);
    loadInDescription();
    loadInAppDescription();
    document.querySelector("#submitMember").addEventListener('click', addMember);
    loadMembers();
    document.querySelector("#memberOverview").addEventListener('click', deleteMember);
    loadAboutUs();
    document.querySelector("#submitAbout").addEventListener('click', changeAboutUs);
}

// Peeceetje Description \\
function loadInDescription() {
    //! TODO: make sure to change the fetch address before release onto the server!! ==> https://app.peeceetje.be:8443/readDescription

    fetch('https://localhost:8443/readDescription')

        .then(response => response.json())
        .then(data => {
            // Response is an array of objects (title,alinea)
            fillInDescriptionForm(data);
        });
}

function fillInDescriptionForm(data) {

    let descrTitle = document.querySelector("#descrTitle");
    let descrAlinea = document.querySelector("#descrAlinea");

    let title = data[0].title;
    let alinea = data[1].alinea;

    descrTitle.value = title;
    descrAlinea.value = alinea;
}

function changeDescription(evt) {

    let descrTitle = document.querySelector("#descrTitle");
    let descrAlinea = document.querySelector("#descrAlinea");

    evt.preventDefault();

    let data = [
        {
            title: descrTitle.value
        }, {
            alinea: descrAlinea.value
        }
    ];

    console.log("Sending:", data);
    //! TODO: make sure to change the fetch address before release onto the server!! ==> https://app.peeceetje.be:8443/changeDescription

    return fetch("https://localhost:8443/changeDescription", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .then(alert("De beschrijving van het jeugdhuis is aangepast!"))
        .catch(error => console.error('Error:', error));


}

// App Description \\
function loadInAppDescription() {
    //! TODO: make sure to change the fetch address before release onto the server!! ==> https://app.peeceetje.be:8443/readAppDescription

    fetch('https://localhost:8443/readAppDescription')

        .then(response => response.json())
        .then(data => {
            // Response is an array of objects (title,alinea)
            fillInAppDescriptionForm(data);
        });
}

function fillInAppDescriptionForm(data) {

    fillInAppTitleBox(data);
    fillInAppInfoBox(data);

}

function fillInAppTitleBox(data) {
    let appTitle = document.querySelector("#appTitle");
    let appIntroSent = document.querySelector("#appIntro");

    appTitle.value = data[0].appIntroTitle;
    appIntroSent.value = data[1].appIntroSentence;
}

function fillInAppInfoBox(data) {
    let appInfoTitle = document.querySelector("#appInfoTitle");
    let appInfoAlinea = document.querySelector("#appInfoAlinea");
    appInfoTitle.value = data[2].appInfoTitle;
    appInfoAlinea.value = data[3].appInfoAlinea;

}

function changeAppDescription(evt) {
    let appIntroTitle = document.querySelector("#appTitle").value;
    let appIntroSentence = document.querySelector("#appIntro").value;
    let appInfoTitle = document.querySelector("#appInfoTitle").value;
    let appInfoAlinea = document.querySelector("#appInfoAlinea").value;

    evt.preventDefault();

    let data = [
        {
            "appIntroTitle": appIntroTitle
        },
        {
            "appIntroSentence": appIntroSentence
        },
        {
            "appInfoTitle": appInfoTitle
        },
        {
            "appInfoAlinea": appInfoAlinea
        }


    ];
    //! TODO: make sure to change the fetch address before release onto the server!! ==> https://app.peeceetje.be:8443/changeAppDescription

    return fetch("https://localhost:8443/changeAppDescription", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .then(alert("De beschrijving van de app is aangepast!"))
        .catch(error => console.error('Error:', error));
}

function loadMembers() {
    //! TODO: make sure to change the fetch address before release onto the server!! ==> https://app.peeceetje.be:8443/readMembers
    fetch('https://localhost:8443/readMembers')

        .then(response => response.json())
        .then(data => {

            console.log("Loading in:");
            console.log(data);
            fillMembers(data);
        });
}

function fillMembers(data) {
    console.log("Filling with..")
    console.log(data);

    let memberOverview = document.querySelector("#memberOverview");
    memberOverview.innerHTML = "";
    data.forEach(function (member) {
        memberOverview.innerHTML += ` <div class="col-md-4 d-flex">
                <div class="card">
                    <img class="card-img-top" src="../assets/media/boardMembers/${member.img}" alt="Card image cap">
                    <div class="card-body">
                        <h5 class="card-title">${member.naam}</h5>
                        <p class="card-text" >${member.beschrijving}</p>
                        <a data-id="${member.id}">Verwijder lid</a>
                    </div>
                </div>`;

    })
}


function addMember() {
    let memberName = document.querySelector("#memberName");
    let memberImg = document.querySelector("#memberImg");
    let memberDescription = document.querySelector("#memberDescr");

    let fileName = memberImg.value.replace(/^.*[\\\/]/, '')
    let data =
        {
            name: memberName.value,
            img: fileName,
            description: memberDescription.value
        }
    ;
    //! TODO: make sure to change the fetch address before release onto the server!! ==> https://app.peeceetje.be:8443/addMembers
    return fetch("https://localhost:8443/addMember", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
        //.then(response => response.json())
        .then(showAndRefresh(true))
        .catch(error => console.error('Error:', error));
}


function showAndRefresh(value) {

    if (value) {
        // Member is added
        alert("Lid is toegevoegd!");
        location.reload();
    } else {
        // Member is deleted
        alert("Lid is verwijderd");
        location.reload();
    }

    location.reload();
}

function deleteMember(e) {
    let target = e.target;
    let memberId = target.getAttribute("data-id");

    if (memberId !== null) {

        let data = {
            id: memberId
        }

        //! TODO: make sure to change the fetch address before release onto the server!! ==> https://app.peeceetje.be:8443/deleteMember

        return fetch("https://localhost:8443/deleteMember", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            //.then(response => response.json())
            .then(showAndRefresh(false))
            .catch(error => console.error('Error:', error));
    }
}

function loadAboutUs() {
    //! TODO: make sure to change the fetch address before release onto the server!! ==> https://app.peeceetje.be:8443/readAboutUs

    fetch('https://localhost:8443/readAboutUs')

        .then(response => response.json())
        .then(data => {

            console.log("Loading in:");
            console.log(data);
            fillAboutUs(data);
        });
}

function fillAboutUs(data) {
    console.log(data);
    let aboutTitle = document.querySelector("#aboutTitle");
    let aboutAlinea = document.querySelector("#aboutAlinea");

    aboutTitle.value = data[0].title;
    aboutAlinea.value = data[1].alinea;
}

function changeAboutUs(e) {
    e.preventDefault();

    let aboutTitle = document.querySelector("#aboutTitle").value;
    let aboutAlinea = document.querySelector("#aboutAlinea").value;

    let data = [
        {"title": aboutTitle},
        {"alinea": aboutAlinea}
        ]

    //! TODO: make sure to change the fetch address before release onto the server!! ==> https://app.peeceetje.be:8443/changeAboutUs

    return fetch("https://localhost:8443/changeAboutUs", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .then(alert("De over ons werd aangepast!"))
        .catch(error => console.error('Error:', error));

}



