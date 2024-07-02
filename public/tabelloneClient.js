const nome = document.getElementById("nome");
const socket = io();


window.onload =  () =>{
    nome.innerText = sessionStorage.getItem("nome");
    socket.emit("sincronizzaClient", { 
        nomePartecipante: sessionStorage.getItem("nome"),
        codicePartita: sessionStorage.getItem("codice")
    })
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