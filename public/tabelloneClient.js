const nome = document.getElementById("nome");
const posizione = document.getElementById("posizione");
const esciPar = document.getElementById("esciPartita");
const turno = document.getElementById("turno");
const lanciaDadi = document.getElementById("lanciaDadi");
const denaro = document.getElementById("denaro");
const socket = io();

const getPosizione = async () => {
    let rsp = await fetch("/recuperaposizione", {
        method: "POST",
        headers: {
            "content-type": "Application/json"
        },
        body: JSON.stringify({
            codicePartita: sessionStorage.getItem("codice"),
            nomeGiocatore: sessionStorage.getItem("nome")
        })
    })
    rsp = await rsp.json();
    if (rsp.result.includes("errore")) {

    } else {
        posizione.innerText = rsp.result;
    }
}
const getDenaro = async() =>{
    let rsp = await fetch("/recuperaDenaro", {
        method: "POST",
        headers:{
            "content-type": "Application/json"
        },
        body: JSON.stringify({
            codicePartita: sessionStorage.getItem("codice"),
            nomeGiocatore: sessionStorage.getItem("nome")
        })
    });
    rsp = await rsp.json();
    if(rsp.result){
        denaro.innerText = rsp.result;
    }
}
//usata anche dal server
const getTurno = async() =>{
    let rsp = await fetch("/recuperaTurno", {
        method: "POST",
        headers:{
            "content-type": "Application/json"
        },
        body: JSON.stringify({
            codicePartita: sessionStorage.getItem("codice"),
        })
    });
    rsp = await rsp.json();
    if(rsp.result == ""){
        turno.innerText = "Non determinato";
    }else{
        turno.innerText = rsp.result;
        if(turno.textContent == nome.textContent){
            lanciaDadi.disabled = false;
            lanciaDadi.style.backgroundColor = 'orange';
            lanciaDadi.style.border = 'orange';
        }else{
            lanciaDadi.disabled = true;
            
        }
    }
}

const esciPartita = async () => {
    await fetch("/escipartita", {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            codicePartita: sessionStorage.getItem("codice"),
            nomeGiocatore: sessionStorage.getItem("nome")
        })
    })
}

esciPar.onclick = async () => await esciPartita();

window.onload = async() => {
    nome.innerText = sessionStorage.getItem("nome");
    socket.emit("sincronizzaClient", {
        nomePartecipante: sessionStorage.getItem("nome"),
        codicePartita: sessionStorage.getItem("codice")
    })
    await getTurno();
    await getPosizione();
    await getDenaro();
}

socket.on("aggiuntoclient", (response) => {
    if (response) {
        console.log("client socket aggiunto");
    } else {
        console.log("client socket non aggiunto");
    }
})

socket.on("partitaFinita", () => {
    sessionStorage.clear();
    location.href = "./index.html";
})

socket.on("uscitaPartita", (result) => {
    if (result) {
        sessionStorage.clear();
        location.href = "./index.html";
    } else {
        console.log("Non è stato possibile uscire dalla partita");
    }
})