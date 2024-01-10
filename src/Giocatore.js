export function Giocatore(nome, posizione = 0) {
    this.nome = nome;
    this.posizione = posizione;
    this.denaro = 1000;
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
        if(this.posizione > 40){
            this.posizione = this.posizione - 40;
            console.log("Passaggio dal via");
            this.denaro += 200;
        }
        console.log("Posizione: "+this.posizione);
        return this.posizione;
      } else {
        console.log("Non è il tuo turno");
      }
    };
    this.getPosizione = function(){
        return this.posizione
    }
    this.getDenaro = function(){
        return this.denaro;
    }
    this.compraProprieta = function(cifra){
        this.denaro -= cifra;
    }
  }