const codice = document.getElementById("codice");
const codiceModal = document.getElementById("codiceModal");
const modal = new bootstrap.Modal("#exampleModalCenter")
const avvia = document.getElementById("avvia");

const creapartita = async() =>{
    let rsp = await fetch("/creapartita",{
        method: "POST",
        headers: {
            "content-type": "Application/json"
        },
        body: JSON.stringify({
            nome: document.getElementById("nomepartita").value
        })
    })
    sessionStorage.setItem("titolo", document.getElementById("nomepartita").value);

    document.getElementById("nomepartita").value = "";
    rsp = await rsp.json();
    if(rsp.result){
        codiceModal.innerText = "Il tuo codice partita è: "+ rsp.id +". Condividilo con i partecipanti che vuoi aggiungere.";
        sessionStorage.setItem("codice", rsp.id);
        avvia.classList.remove("d-none");
        avvia.onclick = () => location.href = "./tabelloneServer.html";
    }else{
        codiceModal.innerText = "Non è stato possibile ottenere il codice partita. Inserisci un nome di partita valido!";
    }
    modal.show();
}

codice.onclick = async() => await creapartita();
