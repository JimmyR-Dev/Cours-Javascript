export function ajoutListenersAvis() {
    const piecesElements = document.querySelectorAll('.fiches article button')
    for (let i = 0; i < piecesElements.length; i++) {
        piecesElements[i].addEventListener('click', async function (event) {
            const id = event.target.dataset.id //Va faire correspondre l'evenement click au bonne id de boutons (précédement crée dans pieces.js)
                const reponse = await fetch(`http://localhost:8081/pieces/${id}/avis`) //id va permettre d'envoyer les données au bon bouton.
                const avis = await reponse.json() //Réponse de fetch au format json
            
            const avisElement = document.createElement('p')
            const pieceElement = event.target.parentElement //parentElement est une propriété
            for (let i = 0; i < avis.length; i++) {
                avisElement.innerHTML += `<b>${avis[i].utilisateur}</b>: ${avis[i].commentaire} <br>`
            }
            pieceElement.appendChild(avisElement) //avisElement va être mis dans le parent pieceElement
        })
    }
}

export function ajoutListenerEnvoyerAvis() {
    const formulaireAvis = document.querySelector('.formulaire-avis')
    formulaireAvis.addEventListener('submit', (event) => {
        event.preventDefault()
        const avis = {
            pieceId: parseInt(event.target.querySelector("#piece-id").value), //parseInt transforme en nombre entier
            utilisateur: event.target.querySelector("#utilisateur").value,
            commentaire: event.target.querySelector("#commentaire").value,
            nbEtoiles: event.target.querySelector("#nbre-etoiles").value
            
        }
        console.log(avis)
        //Je dois toujours transformer le contenu de la requête javascript (body) au format JSON pour qu'il soit lisible :
        const chargeUtile = JSON.stringify(avis) //Equivaut à avis mais au format JSON
        fetch("http://localhost:8081/avis", {
            method: "POST", //La méthode de requête que l'on va utiliser GET, POST, PUT, DELETE, en fonction l'on veut faire.
            headers: {"Content-Type": "application/json"}, //L'en tête sera en json, c'est ça qui arrive en 1er au serveur et il l'accepte si il est au bon format.
            body: chargeUtile //Le contenu de mon objet transformé en json, ici la piece concerné, l'utilisateur, et son commentaire.
        })
    })
}

//---------------------Intégrer un graphique via la librairie chart.js-----------------
//La doc pour la librairie chart.js se trouve sur https://www.chartjs.org/docs/latest/

// Calcul du nombre total de commentaires par quantité d'étoiles attribuées
export async function afficherGraphiqueAvis(){
    const avis = await fetch("http://localhost:8081/avis").then(avis => avis.json())
    const nbCommentaires = [0, 0, 0, 0, 0]
    for (let commentaire of avis) {
        //j'incrémente la note des utilisateurs jusqu'à sa valeur maximale (5) et précise - 1 car en info nous commençons à 0 et sans cela ce serait une note de 0 à 5 et cela ferait une notation à 6 et non 5 comme prévu.
        nbCommentaires[commentaire.nbEtoiles - 1]++ //parcours toutes les propriétés nbEtoiles du json
    }
    console.log(nbCommentaires)
    //on obtiens [1,1,3,6,9] un commentaire à 1étoile, 1 à 2étoile, 3 à 3 étoiles, 6 à 4 étoiles, 9 à 5 étoiles.

    // Légende qui s'affichera sur la gauche à côté de la barre horizontale :
    const labels = ["5", "4", "3", "2", "1"]
    //Les données et personalisation du graphique :
    const data = {
        labels: labels,
        datasets: [{
            label: "Etoiles attribuées",
            data: nbCommentaires.reverse(), //inverse l'ordre d'affichage du tableau
            backgroundColor: "rgba(255, 230, 0, 1)" //jaune
            
        }],
}
    const config = {
        type: "bar",
        data: data, //j'utilise la variable data ici d'en haut.
        options: {
        indexAxis: "y",
        },
    };
    // Rendu du graphique dans l'élément canvas
    const graphiqueAvis = new Chart(
        document.querySelector("#graphique-avis"),
        config,
    );

}

//Afficher un graphique avec une barre ou le nombres de commentaires sont publié sur des article disponible et une deuxiéme sur non disponible
export async function afficherGraphiqueDisponibilité() {

    const articlesJson = window.localStorage.getItem('pieces')
    const articles = JSON.parse(articlesJson)
    const avis = await fetch("http://localhost:8081/avis").then(avis => avis.json())
    let nbCommentaireDisponible = 0
    let nbCommentaireIndisponible = 0
    for (let article of articles) {

        //Je lie les pieceId des utilisateurs et les id des articles et filtre
        if (article.disponibilite) {
            const commentaireDeCetArticle = avis.filter(commentaire => commentaire.pieceId === article.id)
            nbCommentaireDisponible += commentaireDeCetArticle.length
            
        }else{
            const commentaireDeCetArticle = avis.filter(commentaire => commentaire.pieceId === article.id)
            nbCommentaireIndisponible += commentaireDeCetArticle.length
            
        }
    }
    console.log(nbCommentaireDisponible)
    console.log(nbCommentaireIndisponible)
    const nbcommentaireDispoEtIndispo = [nbCommentaireDisponible, nbCommentaireIndisponible]

    const labels = ["disponible", "non disponible"]
    const data = {
        labels: labels,
        datasets: [{
            label: "Nombres de commentaires sur pièces",
            data: nbcommentaireDispoEtIndispo,
            backgroundColor: "rgba(115, 7, 82, 1)"
        }],
    }
    const config = {
        type: "bar",
        data: data, //j'utilise la variable data ici d'en haut.
        options: {
        indexAxis: "x",
        },
    };
    // Rendu du graphique dans l'élément canvas
    const graphiqueAvis = new Chart(
        document.querySelector("#graphique-avis-stock"),
        config,
    );

}

/**
 * Pour attendre des données sans bloquer le code nous utilisont le mot clé await, si la réponse qu'on attend est
 * dans une fonction nous utilisons async function à la place pour passer en "mode" asynchrone.
 * await attend donc la réponse avant de continuer le code sans créer d'erreur bloquant.
 */

/**
 * fetch("http://monsite.fr/ma-ressource").then(function () {
      console.log("Le script continuera après avoir reçu la réponse");
});
    Ceci est l'ancienne façon de coder, avec .then qui est aussi asynchrone, je met le lien de la requête avec fetch puis (.then) 
    je continue le script
 */