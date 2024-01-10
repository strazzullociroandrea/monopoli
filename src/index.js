const tiraDadiButton = document.getElementById("lancio");

function Giocatore(nome, posizione = 0) {
    this.nome = nome;
    this.posizione = posizione;
    this.lanciaDado = function () {
      return Math.floor(Math.random() * (6 - 1 + 1)) + 1;
    };
    this.show = () => {
      return "<div class='giocatore col-auto'>" + nome.charAt(0).toUpperCase() + "</div>";
    };
    this.cambiaPosizione = function (boolean) {
      if (boolean) {
        this.posizione += this.lanciaDado() + this.lanciaDado();
        console.log("start: "+this.posizione);
        if(this.posizione > 40)
            this.posizione = this.posizione - 40;
            console.log("Posizione: "+this.posizione);
        return this.posizione;
      } else {
        console.log("Non è il tuo turno");
      }
    };
    this.getPosizione = function(){
        return this.posizione
    }
  }
  

window.onload = () =>{
    for(let i=0;i<40;i++){
            const div = document.getElementById("cell"+i);
            div.addEventListener("click", () =>{
            console.log("click: "+div.id);
        })
    }
    const persona = new Giocatore("Ciro");
    document.getElementById("intDiv0").innerHTML = persona.show(0);
    tiraDadiButton.onclick = () =>{
        persona.cambiaPosizione(true);
        document.getElementById("intDiv"+persona.getPosizione()).innerHTML = persona.show();
    }
};