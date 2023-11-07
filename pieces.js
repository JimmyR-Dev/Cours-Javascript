import { ajoutListenersAvis, ajoutListenerEnvoyerAvis, afficherGraphiqueAvis, afficherGraphiqueDisponibilité } from "./avis.js"; //permet d'utiliser la fonction exportée dans avis.js, doit utiliser type"module" dans la balise script html pour que cette syntaxe fonctionne

//----------------------LOCALSTORAGE-----------------
/**
 * Le principe va être de stocker des "clés" dans le navigateur(local storage) via l'api du navigateur (chaque navigateur en a un).
 * Cela peut être par ex : stocker un nom, préférence d'option de l'utilisateur etc, le tout stocker dans le navigateur,
 * ce qui fait qu'on ne va pas à chaques fois contacter le serveur et cela rend la page plus rapide à charger.
 */

//Si la clé est déjà présente dans le navigateur (donc pas la 1ère visite) : 
let pieces = window.localStorage.getItem("pieces")
//Si ce n'est pas le cas la valeur est null donc :
if (pieces === null) { 
    //si le local storage est vide, je récupére les informations via l'api distante
    const reponse = await fetch("http://localhost:8081/pieces")  //ou : const pieces = await fetch("http://localhost:8081/pieces").then(pieces => pieces.json()); 
    pieces = await reponse.json() // On attend un résultat en json donc il faut spécifier .json pour qu'il soit lisible.
    
    //Les clés - valeurs sont toujours enregistrées en string au format Json dans le local storage donc :
    const valeurPieces = JSON.stringify(pieces) //Va transformer notre élément en string au format Json
    //J'utilise un systeme clé/valeur , pieces sera le nom de la clé, valeurPieces sera le contenu de la clé, sa valeur :
    window.localStorage.setItem("pieces", valeurPieces)
}else{
    //Va retransformer les chaines de caractère JSON en code Javascript, pour pouvoir retravailler avec.
    pieces = JSON.parse(pieces)
}

console.log(pieces)

//--------METTRE EN FORME NOS ELEMENTS----------

//Je creer une fonction dans lequel se trouve l'affichage de ma page qui va pouvoir être réutilisée pour les boutons de filtrage
function genererPieces(pieces) {
    for (let i = 0; i < pieces.length; i++) {

        //const article = pieces[i] // Va parcourir tout les éléments du tableau json [i], article vaudra toujours pieces[i]
        const imageElement = document.createElement('img')
        imageElement.src = pieces[i].image //va stocker la valeur de la propriété image contenu dans le fichier pieces-autos.json
        const nomElement = document.createElement('h2')
        nomElement.innerText = pieces[i].nom
        const prixElement = document.createElement('p') //si le prix est abordable alors on affiche 1 symbole euro si pas abordable 3 symbole (ternaire)
        prixElement.innerText = `prix : ${pieces[i].prix} € (${pieces[i].prix < 35 ? "€" : "€€€"})` //affiche avec backstick car sinon cela affichera juste 60 et non prix 60
        const categorieElement = document.createElement('p')
        categorieElement.innerText = pieces[i].categorie ?? "(aucune catégorie)"
        const descriptionElement = document.createElement('p')
        descriptionElement.innerText = pieces[i].description ?? "(Pas de description pour le moment)"
        //cette dernière est un opérateur Nullish, on peut le préciser lorsque l'on pense avoir une valeur mais qu'on ne l'a pas
        //Ex : si un client entre une valeur ce sera cette valeur qui sera affichée, si ce n'est pas le cas la valeur renseignée (aucune catégorie)
        //s'affichera au lieu de null ou undefined
        const stockElement = document.createElement('p')
        stockElement.innerText = `(${pieces[i].disponibilité ? "En stock" : "Rupture de stock"})`
    
        const fiches = document.querySelector('.fiches')
        const articleElement = document.createElement('article')
        fiches.appendChild(articleElement)
        
        //Ici j'utilise dataset pour relier les id du fichier JSON a chaques boutons
        //j'utilise datased.id et je stock pieces[i].id dans dataset.id, de ce fait, chaques bouton html sera associé à l'article en question.
        //Peut le voir en inspectant le bouton, cela créera un attribut html : data-id="numero id" dans html.
        const avisBoutons = document.createElement('button')
        avisBoutons.dataset.id = pieces[i].id //Il y'a 5 id dans les pieces du json, donc va creer 1 boutons pour chaques pieces, donc 5.
        avisBoutons.textContent = "Afficher les avis"
    
        //j'ajoute chaques propriété du json à la balise article
        articleElement.appendChild(imageElement)
        articleElement.appendChild(nomElement)
        articleElement.appendChild(prixElement)
        articleElement.appendChild(categorieElement)
        articleElement.appendChild(descriptionElement)
        articleElement.appendChild(stockElement)
        articleElement.appendChild(avisBoutons)
    }
    ajoutListenerEnvoyerAvis()
    ajoutListenersAvis()
}

genererPieces(pieces)

//-----------FILTRER ET TRIER LES ELEMENTS----------

const btnTrier = document.querySelector('.btn-trier')
const btnTrierDecroissant = document.querySelector('.btn-trier-decroissant')
const btnTrierParDescription = document.querySelector('.btn-description')
const btnFiltrer = document.querySelector('.btn-filtrer')

//je tri les prix par ordre croissant, a et b compare les prix entre deux éléments du tableau, a est un élément dans le tableau b un autre.
//Si je soustrais a et b et que le résultat est négatif, la fonction sort() comprendra que a est plus grand que b donc l'élément b sera placé avant.
//A l'inverse si je veux un tri par prix décroissant je peux faire un calcule différent et j'inverse : b.prix - a.prix.
btnTrier.addEventListener('click', () => {
    const piecesOrdonnees = Array.from(pieces) //vu que l'ordre va changer avec le bouton, Array.from va garder une copie de l'ordre d'origine.
    piecesOrdonnees.sort(function (a, b) {     //cela permet nottament de ne pas entrer en conflit avec les autres filtres, doit faire un Array.from avec sort() car il ne le fait pas automatiquement.
        return a.prix - b.prix
    })
    fiches.innerHTML = "" //je vide le contenu de fiches
    genererPieces(piecesOrdonnees) //Je met à jour l'affichage de la page (sinon elle n'est stockée qu'en mémoire et on peux le voir qu'avec la console...)
})

btnTrierDecroissant.addEventListener('click', function () {
    const piecesOrdonnees = Array.from(pieces)
    piecesOrdonnees.sort(function (a, b) {
        return b.prix - a.prix
    })
    fiches.innerHTML = ""
    genererPieces(piecesOrdonnees)
})

//n'afficher que les articles avec une description
btnTrierParDescription.addEventListener('click', function () {
    const selectionDescription = pieces.filter(function (piece) {
        return piece.description
    })
    fiches.innerHTML = ""
    genererPieces(selectionDescription)
})

//je filtre les prix, avec la fonction filter, je me sert du tableau dans le json, je créer une fonction anonyme (sans nom)
//et je veux qu'il retourne tout les articles qui ont un prix égal ou inférieur à 35
btnFiltrer.addEventListener('click', function () {
    const piecesFiltrees = pieces.filter(function (piece) {
        return piece.prix <= 35
    })
    fiches.innerHTML = ""
    genererPieces(piecesFiltrees)
})

//Je filtre en fonction de la barre réglable des prix
const rangePrix = document.querySelector('#filtre-prix')
rangePrix.addEventListener('input', () => {
    const prixFiltre = pieces.filter(function (piece) {
        return piece.prix <= rangePrix.value
    })
    fiches.innerHTML = ""
    genererPieces(prixFiltre)

    //affiche juste la valeur du prix entre parenthèses pour l'utilisateur :
    const valeurBtn = document.querySelector('.valeur-btn')
    valeurBtn.innerText = `(Prix ${rangePrix.value})`
})

//bonus (rien à voir avec le site, juste pour voir une autre syntaxe de sort() ) : 
const bonbons = [
    { "nom": "sucette", "taille": 7 },
    { "nom": "krema", "taille": 1.5 },
    { "nom": "crocodiles", "taille": 3 }
];
bonbons.sort((a, b) => a.taille - b.taille);

//--------------------------------FONCTION MAP--------------------------
console.error('Fonction MAP')
//Je récupére uniquement le nom de chaques piéces, permet d'afficher un élément particulier en gommant tout le reste mais techniquement
//le reste est toujours présent, juste qu'ils ne sont pas affiché et n'affiche que l'élément en question

/*A l'origine ce serait :
const noms = pieces.map(function (piece) {
    return piece.nom
})
*/

//Mais ceci est plus court :

//Va creer un nouveau tableau avec uniquement les valeurs de notre tableau que nous voulons, ici que les noms.
//Le style de syntaxe est grandement simplifié, cela s'appelle fonction lambda.
const noms = pieces.map(piece => piece.nom) 
console.log(noms)
//La fonction lambda sera appellée pour chaque éléments de la liste du tableau

//------

//je peux aussi faire des choses ou des calcules utile comme :
const doublerPrix = pieces.map(piece => piece.prix * 2)
console.log(doublerPrix)
//Doublera chaque prix du tableau, et n'affichera que ceci dans ce nouveau tableau grâce à map(), que les valeurs sans les propriétées

//------

//Je veux supprimer certains éléments d'une liste de mon tableau

//Je dois faire une boucle for mais je dois la faire de la fin vers le debut de la liste
//Sinon la suppression de certains éléments décalerait la suppressions d'autres éléments et fausserai le résultat

const nomsElements = pieces.map(piece => piece.nom)
for (let i = pieces.length -1; i >= 0; i--) {
    if (pieces[i].prix > 35) {
        nomsElements.splice(i, 1) 
    }
}
//splice est une fonction pour supprimer des éléments.
//i après splice() est la valeur du quel je veux que la vérification et la suppression commence, 1 est le nombre d'éléments à supprimer depuis i.
console.log(nomsElements)

//------

//J'affiche maintenant les prix abordable sur le site : 
const fiches = document.querySelector('.fiches')
const abordables = document.createElement('div')
abordables.classList.add("abordables")
abordables.innerText = "Pièces abordables"
fiches.insertBefore(abordables, fiches.firstChild) //insertBefore sert à placer un élément avant un autre, ici div ira en 1er après .fiches

const abordableElements = document.createElement('ul')
for (let i = 0; i < nomsElements.length; i++) {
    const puceNom = document.createElement('li')
    puceNom.innerText = nomsElements[i]
    abordableElements.appendChild(puceNom)
}
document.querySelector('.abordables')
    .appendChild(abordableElements)

//-----

//j'affiche sur le site la liste de pièces disponible avec leur prix
const blocDisponible = document.createElement('div')
blocDisponible.classList.add('disponible')
blocDisponible.innerText = "Pièces disponibles"
fiches.insertBefore(blocDisponible, abordables.nextSibling)

const pieceDisponible = pieces.map(piece => `${piece.nom} - ${piece.prix} €`)

for (let i = pieces.length -1; i >= 0; i--) {

    if (pieces[i].disponibilité === false) {
        pieceDisponible.splice(i, 1)
    } 
}

const puceUl = document.createElement('ul')
for (let i = 0; i < pieceDisponible.length; i++) {
    const puceLi = document.createElement('li')
    puceLi.innerText = pieceDisponible[i]
    puceUl.appendChild(puceLi)
}
blocDisponible.appendChild(puceUl)

//bonus (rien à voir avec le site, juste pour voir une autre syntaxe de map() ) : 
const prix = [100, 5, 1.5]
for (let i = 0; i < prix.length; i++) {
    const prixAJour = prix.map(p => p * 1.2)
    console.log(prixAJour[i])
}

//-----

//--------------------------METTRE A JOUR LES ELEMENTS D'UNE PAGE---------------------
console.error('Mettre à jour les éléments d\'une page')
//------
//Disclaimer: innerHTML remplace le contenu de la balise ciblée avec = et prend en compte les balises en string
//ex : maVariable.innerHTML = "" , ensuite j'ajoute le contenu mis à jour, cela peut être une fonction comme celle d'en haut de ce fichier js
//Pour ajouter du contenu sans remplacer ce qui est déjà existant je met +=
//ex : maVariable.innerHTML += "mon code"

//----------------------LOCALSTORAGE-----------------

//Je supprime les données dans le dans le local storage au click pour mettre à jour les données car elle ne sont pas forcément à jour.
const btnMaj = document.querySelector('.btn-maj')
btnMaj.addEventListener('click', function () {
    window.localStorage.removeItem('pieces')
})
//Si je click sur le bouton cela supprime les données, et si je recharge la page je vois bien une nouvelle requête coté api-http.

//--------------------

//Je pense que await ne sert à rien ici car la fonction elle même est en mode async (et elle marche sans), mais le formateur l'a mis...
await afficherGraphiqueAvis()
await afficherGraphiqueDisponibilité()