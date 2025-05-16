const P = new Pokedex.Pokedex();
const maxPokemon = 1010;

$('.joueur1 #attaque').hide();
$('.joueur2 #attaque').hide();
$('.reset').hide();

// génère l'ID
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
};

//------> PROMESSES <------//
// prepare la promesse d'identité du pokemon
function carte(id) {
    return P.resource(["/api/v2/pokemon/" + id,
                "api/v2/pokemon-species/" + id,])
};

// prépare la promesse de donné sur une attaque
function attaque(nom) {
    return P.getMoveByName(nom);
}

class Joueur {
    constructor(id, elementHTML){
        this.id = id;
        this.nom = '';
        this.elementHTML = elementHTML;
        this.vivant = true;
    };

    estVivant(){
        if(this.pokemon.PV <= 0 || isNaN(this.pokemon.PV) )
            return this.vivant = false;

        else return this.vivant = true;
    };

//-----> SETTER & GETTER <------//
    setPV(power){
        if (power != null)
            this.pokemon.PV -= power;
    };

    getPV(){
        if (this.estVivant() == true)
            return this.pokemon.PV;
        else {
            this.pokemon.PV = 'MORT';
            return this.pokemon.PV};
    };

    setPokemon(pokemon){
        this.pokemon = pokemon;
    };

    getPokemon(){
        return this.pokemon;
    };

//----> GESTION DU HTML et CSS <----//

    // Affiche la carte  
    afficheCarte(){

        if(this.pokemon.nomFR !== null){
            $(this.elementHTML).prepend("<h3>" + this.pokemon.nomFR + "</h3>");
        }
        else $(this.elementHTML).prepend("<h3>" + this.pokemon.nomEN + "</h3>");

        $(this.elementHTML).append("<img src=" + this.pokemon.img + ">");
        $(this.elementHTML).append('<p>' + this.pokemon.PV + ' PV</p>');
    };

    // affiche dans l'écran les infos du pokemon
    affichePokemon(){
        let mots = 'Le joueur ' + this.id + ' ' + 
                    this.nom + ' appelle ' + 
                   this.pokemon.nomFR + ' et il a ' + 
                   this.pokemon.PV + ' PV.';

        this.ecran(mots);
        
    };

    // affiche dans l'écran les infos de l'attaque
    afficheAttaque(nom, puissance){
        let mots = this.pokemon.nomFR + ' attaque avec ' + 
                   nom + ' et fait ' +
                   puissance + ' dommage(s)!';

        this.ecran(mots);
    };

    afficheMort(){
        let mots = this.pokemon.nomFR + ' n\'a plus de PV. Il est mort. Le joueur ' + 
                   this.id + ' ' + 
                   this.nom + ' a perdu.'
        this.ecran(mots);
    }
    // affiche dans l'écran ... n'impote quoi!
    ecran(mots){
        $('.ecran').append("<p>" + mots + "</p>");
    };

};  // fin de la class //
//-------------------------------------------------//

//-------> CREATION DES JOUEURS <-------//
var joueur1 = new Joueur(1, '.carte1');
var joueur2 = new Joueur(2, '.carte2');


////////////////////////////////////////////////////////////////////////////////
//             BOUTONS                ////             BOUTONS                // 
////////////////////////////////////////////////////////////////////////////////

// ---------> APPELS DE POKEMON <--------- //
$('.joueur1 #appel').on('click', () => {
    let pige = getRandomInt(maxPokemon);
    carte(pige)
    .then( data => {
        let pokemon = {
                nomFR: data[1].names[4].name,
                nomEN: data[0].name,
                img: data[0].sprites.front_default,
                PV: data[0].stats[0].base_stat,
                moves: data[0].moves
            };
        joueur1.setPokemon(pokemon);
        joueur1.afficheCarte();
        joueur1.affichePokemon();
        $('.joueur1 #attaque').show();
        $('.joueur1 #appel').hide();
        
    })
    .catch(error => { alert('Oups! Ce pokémon est timide! Rappelles en un autre!!'); console.log(error);});
    
});

$('.joueur2 #appel').on('click', () => {
    let pige = getRandomInt(maxPokemon);
    carte(pige)
    .then( data => {
        let pokemon = {
                nomFR: data[1].names[4].name,
                nomEN: data[0].name,
                img: data[0].sprites.front_default,
                PV: data[0].stats[0].base_stat,
                moves: data[0].moves
            };
        joueur2.setPokemon(pokemon);
        joueur2.afficheCarte();
        joueur2.affichePokemon();
        $('.joueur2 #attaque').show();
        $('.joueur2 #appel').hide();
        
    })
    .catch(error => { alert('Oups! Ce pokémon est timide! Rappelles en un autre!!'); console.log(error);});
    
});

// ---------> ATTAQUES <--------- //

$('.joueur1 #attaque').on('click', () => {
    let moves = joueur1.pokemon.moves;
    if (moves !== undefined){ // si c'est undefined c'est qu'il n'y a pas de pokemon de choisi.
        let maxMove = moves.length;
        let moveId = getRandomInt(maxMove);
        
        attaque(moves[moveId].move.name)
        .then(attaque => {
            if(attaque.power !== null){
                joueur1.afficheAttaque(attaque.names[3].name, attaque.power)
                joueur2.setPV(attaque.power);
                
                if (joueur2.estVivant()){
                    $('.carte2 p').text(joueur2.getPV() + ' PV');
                }
                else {
                    joueur2.afficheMort(); 
                    $('.carte2 p').text(joueur2.getPV());
                    $('.joueur2 .reset').show().text('Tu es mort... Recommence');
                    $('.joueur2 #attaque').hide();
                    $('.joueur1 .reset').show().text('Tu as gagné!! Recommence');
                    $('.joueur1 #attaque').hide();
                };
                
            }
            else {
                joueur1.ecran('Joueur 1 attaque avec ' + attaque.names[3].name + '. Cette attaque ne fait aucun dommage!');
            };
            
        })
        .catch(error => { alert('Erreur dans fonction Attaque! TU DOIS APPELER TOUS LES POKEMONS REQUIS!!'); console.log(error); });
        
    }
    else{
        alert('Tu dois d\'abord appeler ton pokémon!');
    };
    
});

$('.joueur2 #attaque').on('click', () => {
    let moves = joueur2.pokemon.moves;
    if (moves !== undefined){ // si c'est undefined c'est qu'il n'y a pas de pokemon de choisi.
        let maxMove = moves.length;
        let moveId = getRandomInt(maxMove);
        
        attaque(moves[moveId].move.name)
        .then(attaque => {
            if(attaque.power !== null){
                joueur2.afficheAttaque(attaque.names[3].name, attaque.power);
                joueur1.setPV(attaque.power);
                
                if (joueur1.estVivant()){
                    $('.carte1 p').text(joueur1.getPV() + ' PV');
                }
                else {
                    joueur1.afficheMort(); 
                    $('.carte1 p').text(joueur1.getPV());
                    $('.joueur1 .reset').show().text('Tu es mort... Recommence');
                    $('.joueur1 #attaque').hide();
                    $('.joueur2 .reset').show().text('Tu as gagné!! Recommence');
                    $('.joueur2 #attaque').hide();
                };
                
            }
            else {
                joueur2.ecran('Joueur 2 attaque avec ' + attaque.names[3].name + '. Cette attaque ne fait aucun dommage!');
            };
            
        })
        .catch(error => { alert('Erreur dans fonction Attaque! TU DOIS APPELER TOUS LES POKEMONS REQUIS!!'); console.log(error); });
        
    }
    else{
        alert('Tu dois d\'abord appeler ton pokémon!');
    }
    
});

$(".reset").on('click', () => { window.location.reload(); });

$('.nom').on('click', (e) => { 
    let nom = null;
    do{
    nom = prompt("Quel est ton nom de maître Pokémon?");

    if (e.target.id == 1){
        joueur1.nom = nom;
        $('.joueur1 .nom').text(nom);
    }
    if (e.target.id == 2){
        joueur2.nom = nom;
        $('.joueur2 .nom').text(nom);
    }
} while(nom == null);
    
});



////////



