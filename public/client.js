const invia = document.getElementById("invia");

const aggiungiti = async() =>{
    let rsp = await fetch("/aggiungiti", {
        method: "POST",
        headers:{
            "content-type": "Application/json"
        },
        body: JSON.stringify({
            nomeGiocatore: document.getElementById("nomeGiocatore").value,
            colorePedina: document.getElementById("colorepedina").value,
            codicePartita: document.getElementById("codicepartita").value
        })
    });
    rsp = await rsp.json();
   
    if(rsp.result){
        location.href = "./tabelloneClient.html";
    }
}

invia.onclick = async() => await aggiungiti()