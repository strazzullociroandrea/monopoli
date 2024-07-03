const socket = (socket, partite, io) =>{
    
    socket.on("aggiungiserver", (codicePartita) => {
        const partitaIndex = partite.findIndex(par => par.id == codicePartita);
        if(partitaIndex != -1){
            partite[partitaIndex]['socketServer'] = socket.id;
            io.to(socket.id).emit("aggiuntoserver", true);
        }else{
            io.to(socket.id).emit("aggiuntoserver", false);
        }
    });

    socket.on("sincronizzaClient", (obj)=>{
        const {nomePartecipante, codicePartita} = obj;
        const partitaIndex = partite.findIndex(par => par.id == codicePartita);
        const partita = partite[partitaIndex];
        const partecipanti = partita?.partecipanti;
        if(partecipanti){
            let trovato = false;
            partecipanti.forEach(partecipante =>{
                if(partecipante.nome == nomePartecipante){
                    partecipante.socket = socket.id;
                    io.to(socket.id).emit("aggiuntoclient", true);
                    trovato = true;
                }
            })
            if(!trovato){
                io.to(socket.id).emit("aggiuntoclient", false);
            }
        }else{
            io.to(socket.id).emit("aggiuntoclient", false);
        }
    })
    /*
        socket.on('disconnect', () => {
            console.log('user disconnected');
            //Se si disconnette il server => chiudo la partita
            //Se si disconnette il client => tolgo il client dalla partita
        io.emit("chat", user + " ha abbandonato la chat"); //mando ai client il messaggio dell'utente
        });
    */
}
module.exports = socket;