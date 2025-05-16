const P = new Pokedex.Pokedex();
const maxPokemon = 1010;
$('#attaque').hide();

var pokemon;
var moves;
var move;
var joueur1 = false;


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

/* class Joueur {
    constructor(id, nom, elementHTML, pokemon){
        this.id = id;
        this.nom = nom;
        this.elementHTML = elementHTML;
        this.pokemon = pokemon;
    }
//-----> SETTER & GETTER <------//
    function setPV(power){
        this.obj.PV -= power
    };

    function getPV(){
        return this.obj.PV
    };

    function setPokemon(pokemon){
        this.pokemon = pokemon;
    };

    function getPokemon(){
        return this.pokemon;
    };
*/

//----> GESTION DU HTML et CSS <----//

    // Affiche la carte  
    function afficheCarte(elementHTML, obj){
        $(elementHTML).append($('img').attr('src', obj.img));
        $(elementHTML + ' p').text(obj.PV + ' PV');

        if(obj.nomFR !== null){
            $(elementHTML + ' h3').text(obj.nomFR);
        }
        else $(elementHTML + ' h3').text(obj.nomEN);
    };

    // Affiche le texte pour l'utilisateur
    function ecran(mots){
        $('.ecran').append("<p>" + mots + "</p>")
    };

//};  // fin de la class //
//-------------------------------------------------//


// ---------> APPELS DE POKEMON <--------- //
$('.joueur_1 #appel').on('click', () => {
    let pige = getRandomInt(maxPokemon);
    carte(pige)
    .then( data => {
        pokemon = {
                nomFR: data[1].names[4].name,
                nomEN: data[0].name,
                img: data[0].sprites.front_default,
                PV: data[0].stats[0].base_stat,
                moves: data[0].moves
            };
        moves = pokemon.moves;
        afficheCarte('.carte_1', pokemon)
        ecran('Joueur 1 appelle ' + pokemon.nomFR + ' et il a ' + pokemon.PV + ' PV.');
        $('#attaque').show();
        $('.joueur_1 #appel').hide();
        joueur1 = true;
        //console.log(obj);
        
    })
    .catch(error => { alert('Oups! Ce pokémon est timide! Rappelles en un autre!!'); console.log(error);});
    
});

// ---------> ATTAQUES <--------- //

$('.joueur_1 #attaque').on('click', () => {
    if (moves !== undefined){
        let maxMove = moves.length;
        let moveId = getRandomInt(maxMove);
        //console.log('moveID ' + moveId);
        attaque(moves[moveId].move.name)
        .then(attaque => {
            if(attaque.power !== null){
                ecran('Joueur 1 attaque avec ' + attaque.names[3].name + '. Cette attaque fait ' + attaque.power + ' dommage!');
                let point = 100 - attaque.power;
                //pokemon.PV -= attaque.power;
                ecran('Joueur 2 PV =  ' + point);
                
            }
            else {
                ecran('Joueur 1 attaque avec ' + attaque.name + '. Cette attaque ne fait aucun dommage!');
            }
            console.log(attaque);
        })
        .catch(error => { alert('Erreur dans fonction Attaque!' + error); });
        
    }
    else{
        alert('Tu dois d\'abord appeler ton pokémon!');
    }
    //console.log(moves);
    
});

// quand le joueur meurt 
// la variable joueur1 = false;
// le bouton appelle ton pokemon s'affiche avec 
// $('.joueur_1 #appel').show();