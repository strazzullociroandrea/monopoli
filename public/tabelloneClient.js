const nome = document.getElementById("nome");
const posizione = document.getElementById("posizione");
const esciPar = document.getElementById("esciPartita");
const turno = document.getElementById("turno");
const lanciaDadi = document.getElementById("lanciaDadi");
const denaro = document.getElementById("denaro");
const modalDadi = new bootstrap.Modal(document.getElementById("lancioDadi"));

const socket = io();
const dice1 = document.getElementById('dice1');
const dice2 = document.getElementById('dice2');

const roll = () => Math.floor(Math.random() * 6) + 1;

const getPosizione = async () => {
    let rsp = await fetch("/recuperaposizione", {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            codicePartita: sessionStorage.getItem("codice"),
            nomeGiocatore: sessionStorage.getItem("nome")
        })
    });
    rsp = await rsp.json();
    if (rsp.result.includes("errore")) {
        console.log("Errore nel recuperare la posizione");
    } else {
        posizione.innerText = rsp.result;
    }
};

const getDenaro = async () => {
    let rsp = await fetch("/recuperaDenaro", {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            codicePartita: sessionStorage.getItem("codice"),
            nomeGiocatore: sessionStorage.getItem("nome")
        })
    });
    rsp = await rsp.json();
    if (rsp.result) {
        denaro.innerText = rsp.result;
    }
};

// usata anche dal server
const getTurno = async () => {
    let rsp = await fetch("/recuperaTurno", {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            codicePartita: sessionStorage.getItem("codice")
        })
    });
    rsp = await rsp.json();
    if (rsp.result == "") {
        turno.innerText = "Non determinato";
    } else {
        turno.innerText = rsp.result;
        if (turno.textContent == nome.textContent) {
            lanciaDadi.disabled = false;
            lanciaDadi.style.backgroundColor = 'orange';
            lanciaDadi.style.border = 'orange';
        } else {
            lanciaDadi.disabled = true;
            lanciaDadi.style.backgroundColor = '';
            lanciaDadi.style.border = '';
        }
    }
};

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
    });
};

esciPar.onclick = async () => await esciPartita();

window.onload = async () => {
    nome.innerText = sessionStorage.getItem("nome");
    socket.emit("sincronizzaClient", {
        nomePartecipante: sessionStorage.getItem("nome"),
        codicePartita: sessionStorage.getItem("codice")
    });
    await getTurno();
    await getPosizione();
    await getDenaro();
};

socket.on("aggiuntoclient", (response) => {
    if (response) {
        console.log("client socket aggiunto");
    } else {
        console.log("client socket non aggiunto");
    }
});

socket.on("partitaFinita", () => {
    sessionStorage.clear();
    location.href = "./index.html";
});

socket.on("uscitaPartita", (result) => {
    if (result) {
        sessionStorage.clear();
        location.href = "./index.html";
    } else {
        console.log("Non è stato possibile uscire dalla partita");
    }
});

lanciaDadi.onclick = () => {
    if (!lanciaDadi.disabled) {
        modalDadi.show();
    }
};

document.getElementById('rollDiceButton').onclick = async function() {
    const dice1 = document.getElementById('dice1');
    const dice2 = document.getElementById('dice2');

    const roll = async() => Math.floor(Math.random() * 6) + 1;

    const dado1 = await roll();
    const dado2 = await roll();
    dice1.textContent = dado1;
    dice2.textContent = dado2;
    
    let rsp = await fetch("/lancioDadi",{
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            nomePartecipante: sessionStorage.getItem("nome"),
            codicePartita: sessionStorage.getItem("codice"),
            dado1,
            dado2
        })
    })
    rsp = await rsp.json();
    if(rsp.result == "Ok aggiorna denaro !"){
        let rsp = await fetch("/cambioTurno",{
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                codicePartita: sessionStorage.getItem("codice")
            })
        })
    }else{
        console.log("Errore nel lancio dei dadi");
    }
    /*
        gestire middleware per il cambio turno dopo che ha modificato importo denaro e posizione + spostamento
        futura possibilità di acquistare la proprietà o pagare il denaro a chi si deve
    */
};