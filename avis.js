export function ajoutListenersAvis() {
    const piecesElements = document.querySelectorAll('.fiches article button')
    for (let i = 0; i < piecesElements.length; i++) {
        piecesElements[i].addEventListener('click', async function (event) {
            const id = event.target.dataset.id //je redéclare le dataset du à la porté des variables, pour l'utiliser dans fetch
            const reponse = await fetch(`http://localhost:8081/pieces/${id}/avis`)
            const avis = await reponse.json()

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




/**
 * ici je creer une fonction pour ajouter un écouteur d'événement, au click le navigateur enverra une requête de type GET à l'adresse dans fetch
 * dans la ressource pieces, puis j'ajoute l'id ce qui précisera quelle élément nous voulons dans la ressource pieces.
 * */ 

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