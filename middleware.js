const shortid = require('shortid');

async function generaId(partite) {
    let id;
    do {
        id = shortid.generate();
    } while (partite.findIndex(element => element.id === id) !== -1);
    return id;
}

const middleware = (app, partite, io) =>{

    app.post("/creapartita", async (req, res) => {
        const nome = req.body.nome;
        if (nome && nome !== "") {
            let id = await generaId(partite);
            partite.push({
                id: id,
                nome: nome,
                partecipanti: []
            });
            res.json({ result: true, id: id });
        } else {
            res.json({ result: false });
        }
    });

    app.post("/aggiungiti", (req, res) => {
        const { codicePartita, nomeGiocatore, colorePedina } = req.body;
        if (!codicePartita || !nomeGiocatore || !colorePedina) {
            return res.json({ result: "Campi mancanti" });
        }
        const indexPartita = partite.findIndex(partita => {
            return partita.id === codicePartita
        });
        if (indexPartita === -1) {
            return res.json({ result: "Partita non trovata." });
        }
        const partita = partite[indexPartita];
        const presenteNominativo = partita.partecipanti.find(giocatore => giocatore.nome === nomeGiocatore);
        if (presenteNominativo) {
            return res.json({ result: "Nome non disponibile." });
        }
        const presenteColore = partita.partecipanti.find(giocatore => giocatore.pedina === colorePedina);
        if (presenteColore) {
            return res.json({ result: "Colore pedina non disponibile." });
        }
        partita.partecipanti.push({
            nome: nomeGiocatore,
            pedina: colorePedina,
            denaro: "",
            stato: "VIA",
            proprieta: [],
            carteSpeciali: [],
            socket: "",
        });
        if(partita?.socketServer){
            io.to(partita.socketServer).emit("aggiuntopartecipante", JSON.stringify({
                nome: nomeGiocatore,
                pedina: colorePedina,
                denaro: "",
                stato: "VIA",
                proprieta: [],
                carteSpeciali: []
            }));
        }
        return res.json({ result: true });
    });

    app.post("/partecipanti", (req, res)=>{
        const {codicePartita} = req.body;
        if(!codicePartita || codicePartita == ""){
            return res.json({ result: [] });
        }
        const indexPartita = partite.findIndex(partita => {
            return partita.id === codicePartita
        });
        if (indexPartita === -1) {
            return res.json({ result: [] });
        }else{
            return res.json({ result: partite[indexPartita].partecipanti });
        }
    })

    app.post("/chiudipartita", (req, res)=>{
        const {codicePartita} = req.body;
        if(!codicePartita || codicePartita == ""){
            return res.json({ result: [] });
        }
        const indexPartita = partite.findIndex(partita => {
            return partita.id === codicePartita
        });
        const partita = partite[indexPartita];
        if (indexPartita === -1) {
            io.to(partita.socketServer).emit("partitaFinita", false);
        }else{
            const partita = partite[indexPartita];
            partita.partecipanti.forEach(partecipante=>{
                io.to(partecipante.socket).emit("partitaFinita", true);
            })
            io.to(partita.socketServer).emit("partitaFinita", true);
        }
    })

    app.post("/recuperaposizione", (req, res)=>{
        const {codicePartita, nomeGiocatore} = req.body;
        if(!codicePartita || codicePartita == ""){
            return res.json({ result: "errore" });
        }
        const indexPartita = partite.findIndex(partita => {
            return partita.id === codicePartita
        });
        const partita = partite[indexPartita];
        if(nomeGiocatore == "" || !nomeGiocatore){
            return res.json({ result: "errore" });
        }else{
            let trovato = false;
            partita.partecipanti.forEach(partecipante =>{
                if(partecipante.nome == nomeGiocatore){
                    trovato = true;
                    return res.json({ result: partecipante.stato });
                }
            })
            if(!trovato){
                res.json({ result: "errore" });
            }
        }
    })
}

module.exports = middleware;
