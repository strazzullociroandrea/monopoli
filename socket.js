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
    socket.on('disconnect', () => {
        console.log('user disconnected');
      //  io.emit("chat", user + " ha abbandonato la chat"); //mando ai client il messaggio dell'utente
    });
}
module.exports = socket;