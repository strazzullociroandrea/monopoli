const titolo = document.getElementById("titolo");
const codice = document.getElementById("codice");
const partecipanti = document.getElementById("partecipanti");
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
}

window.onload = () =>{
    titolo.value = sessionStorage.getItem("titolo");
    codice.value = sessionStorage.getItem("codice");
    socket.emit("aggiungiserver", sessionStorage.getItem("codice"));
    getPartecipanti();
}

socket.on("aggiuntoserver",(response)=>{
    console.log("Server aggiunto? "+response);
})

socket.on("aggiuntopartecipante", (partecipanteNuovo)=>{
    console.log("Partecipante XYZ aggiunto alla partita");
    console.log(JSON.parse(partecipanteNuovo));
    /*partecipanti.innerHTML += `
        <div style="display: flex; align-items: center; margin-bottom: 5px;">
            <div style="width: 20px; height: 20px; background-color: %COLOR; margin-right: 10px;"></div>
            <span>%NOME</span>
        </div>
    `.replace("%NOME", partecipanteNuovo.nome)
     .replace("%COLOR", partecipanteNuovo.pedina)
    */
})