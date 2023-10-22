const reponse = await fetch("pieces-autos.json")
const pieces = await reponse.json() // sera le résultat attendu contenu dans pieces-auto.json en json

//--------METTRE EN FORME NOS ELEMENTS----------
for (let i = 0; i < pieces.length; i++) {

    const article = pieces[i] // Va parcourir tout les éléments du tableau json [i], article vaudra toujours pieces[i]
    const imageElement = document.createElement('img')
    imageElement.src = article.image //va stocker la valeur de la propriété image contenu dans le fichier pieces-autos.json
    const nomElement = document.createElement('h2')
    nomElement.innerText = article.nom
    const prixElement = document.createElement('p') //si le prix est abordable alors on affiche 1 symbole euro si pas abordable 3 symbole (ternaire)
    prixElement.innerText = `prix : ${article.prix} € (${article.prix < 35 ? "€" : "€€€"})` //affiche avec backstick car sinon cela affichera juste 60 et non prix 60
    const categorieElement = document.createElement('p')
    categorieElement.innerText = article.categorie ?? "(aucune catégorie)"
    const descriptionElement = document.createElement('p')
    descriptionElement.innerText = article.description ?? "(Pas de description pour le moment)"
    //cette dernière est un opérateur Nullish, on peut le préciser lorsque l'on pense avoir une valeur mais qu'on ne l'a pas
    //Ex : si un client entre une valeur ce sera cette valeur qui sera affichée, si ce n'est pas le cas la valeur renseignée (aucune catégorie)
    //s'affichera au lieu de null ou undefined
    const stockElement = document.createElement('p')
    stockElement.innerText = `(${article.disponibilité ? "En stock" : "Rupture de stock"})`

    const fiches = document.querySelector('.fiches')
    const articleElement = document.createElement('article')
    fiches.appendChild(articleElement)

    //j'ajoute chaques propriété du json à la balise article
    articleElement.appendChild(imageElement)
    articleElement.appendChild(nomElement)
    articleElement.appendChild(prixElement)
    articleElement.appendChild(categorieElement)
    articleElement.appendChild(descriptionElement)
    articleElement.appendChild(stockElement)
}

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
    piecesOrdonnees.sort(function (a, b) {     //cela permet nottament de ne pas entrer en conflit avec les autres filtres
        return a.prix - b.prix
    })
    console.log(piecesOrdonnees)
})

btnTrierDecroissant.addEventListener('click', function () {
    const piecesOrdonnees = Array.from(pieces)
    piecesOrdonnees.sort(function (a, b) {
        return b.prix - a.prix
    })
    console.log(piecesOrdonnees)
})

//n'afficher que les articles avec une description
btnTrierParDescription.addEventListener('click', function () {
    const selectionDescription = pieces.filter(function (piece) {
        return piece.description
    })
    console.log(selectionDescription)
})

//je filtre les prix, avec la fonction filter, je me sert du tableau dans le json, je créer une fonction anonyme (sans nom)
//et je veux qu'il retourne tout les articles qui ont un prix égal ou inférieur à 35
btnFiltrer.addEventListener('click', function () {
    const piecesFiltrees = pieces.filter(function (piece) {
        return piece.prix <= 35
    })
    console.log(piecesFiltrees)
})

