const nome = document.getElementById("nome");
const posizione = document.getElementById("posizione");
const socket = io();

const getPosizione = async() =>{
 let rsp = await fetch("/recuperaposizione",{
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
 if(rsp.result.includes("errore")){

 }else{
    posizione.innerText = rsp.result;
 }
 //console.log("La tua posizione è : "+rsp.result);
}

window.onload =  () =>{
    nome.innerText = sessionStorage.getItem("nome");
    socket.emit("sincronizzaClient", { 
        nomePartecipante: sessionStorage.getItem("nome"),
        codicePartita: sessionStorage.getItem("codice")
    })
    getPosizione();
}

socket.on("aggiuntoclient",(response)=>{
    if(response){
        console.log("client socket aggiunto");
    }else{
        console.log("client socket non aggiunto");
    }
})

socket.on("partitaFinita", (partecipanteNuovo)=>{
    sessionStorage.clear();
    location.href = "./index.html";
 })