import { Giocatore } from "./Giocatore.js";
const tiraDadiButton = document.getElementById("lancio");
const paginaDettaglioGiocatore = document.getElementById("paginaDettaglioGiocatore");
const paginaDettaglioCasella = document.getElementById("paginaDettaglioCasella");
window.onload = () =>{
    for(let i=0;i<40;i++){
            const div = document.getElementById("cell"+i);
            div.addEventListener("click", () =>{
                paginaDettaglioCasella.innerHTML = "<p>ID: "+div.id+"</p>";
            console.log("click: "+div.id);
        })
    }
    const persona = new Giocatore("Ciro");
    document.getElementById("intDiv0").innerHTML = persona.show(0);
    tiraDadiButton.onclick = () =>{
        persona.cambiaPosizione(true);
        document.getElementById("intDiv" + persona.getPosizione() ).innerHTML = persona.show();
    }
};