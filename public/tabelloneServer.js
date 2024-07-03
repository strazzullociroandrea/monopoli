const titolo = document.getElementById("titolo");
const codice = document.getElementById("codice");
const partecipanti = document.getElementById("partecipanti");
const chiudi = document.getElementById("chiudi");
const turno = document.getElementById("turno");
const socket = io();

const getPartecipanti = async() =>{
    let rsp = await fetch("/partecipanti",{
        method: "POST",
        headers: {
            "content-type": "Application/json"
        },
        body: JSON.stringify({
            codicePartita: sessionStorage.getItem("codice")
        })
    });
    rsp = await rsp.json();
    partecipanti.innerHTML = "";
    rsp.result.forEach(partecipante=>{
        partecipanti.innerHTML += `
        <div style="display: flex; align-items: center; margin-bottom: 5px;">
            <div style="width: 20px; height: 20px; background-color: %COLOR; margin-right: 10px;"></div>
            <span>%NOME</span>
        </div>
    `.replace("%NOME", partecipante.nome.substring(0,15))
     .replace("%COLOR", partecipante.pedina)
    })
}
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
    }
}
window.onload = async() =>{
    titolo.value = sessionStorage.getItem("titolo");
    codice.value = sessionStorage.getItem("codice");
    await getTurno();
    socket.emit("aggiungiserver", sessionStorage.getItem("codice"));
}

socket.on("aggiuntoserver",(response)=>{
    getPartecipanti();
})

socket.on("aggiuntopartecipante", ()=>{
    window.onload();
})

socket.on("partitaFinita", (partecipanteNuovo)=>{
   sessionStorage.clear();
   location.href = "./index.html";
})

const chiudiPartita = async() =>{
   await fetch("/chiudipartita",{
    method: "POST",
    headers: {
        "content-type": "Application/json"
    },
    body: JSON.stringify({
        codicePartita: sessionStorage.getItem("codice")
    })
   });
}
chiudi.onclick = () => chiudiPartita();