window.onload = () =>{
    for(let i=0;i<40;i++){
            const div = document.getElementById("cell"+i);
            div.addEventListener("click", () =>{
            console.log("click: "+div.id);
        })
    }
    document.getElementById("intDiv0").innerHTML = "<div class='giocatore col-auto'>g1</div><div class='giocatore col-auto'>g2</div><div class='giocatore col-auto'>g3</div><div class='giocatore col-auto'>g4</div>";
};


