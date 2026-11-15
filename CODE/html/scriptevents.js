// ========================================
// EVENTS F1 FAN ZONE
// ========================================


// ========================================
// 1. FILTRER LES EVENEMENTS
// ========================================

var boutonsFiltres = document.querySelectorAll(".filtre");
var cartes = document.querySelectorAll(".carte-evenement");

for (var i = 0; i < boutonsFiltres.length; i++) {

    boutonsFiltres[i].addEventListener("click", function() {

        var filtreChoisi = this.getAttribute("data-filtre");

        for (var j = 0; j < boutonsFiltres.length; j++) {
            boutonsFiltres[j].classList.remove("actif");
        }

        this.classList.add("actif");

        for (var k = 0; k < cartes.length; k++) {

            var categorie = cartes[k].getAttribute("data-categorie");

            if (filtreChoisi === "tous" || categorie === filtreChoisi) {
                cartes[k].style.display = "block";
            } else {
                cartes[k].style.display = "none";
            }

        }

    });

}


// ========================================
// 2. INSCRIPTIONS AUX EVENEMENTS
// ========================================

// Liste des événements et de leurs compteurs
var evenements = [
    { id: "monaco", compteur: "nombre-monaco", participants: 128 },
    { id: "silverstone", compteur: "nombre-silverstone", participants: 96 },
    { id: "simracing", compteur: "nombre-simracing", participants: 42 },
    { id: "battle", compteur: "nombre-battle", participants: 75 },
    { id: "karting", compteur: "nombre-karting", participants: 32 },
    { id: "soiree", compteur: "nombre-soiree", participants: 64 }
];


// Récupération des boutons participer
var boutonsParticiper = document.querySelectorAll(".bouton-participer");


// Fonction pour retrouver un événement
function trouverEvenement(id) {

    for (var i = 0; i < evenements.length; i++) {

        if (evenements[i].id === id) {
            return evenements[i];
        }

    }

    return null;
}


// ========================================
// 3. AFFICHER LES INSCRIPTIONS EXISTANTES
// ========================================

function afficherInscriptions() {

    for (var i = 0; i < boutonsParticiper.length; i++) {

        var bouton = boutonsParticiper[i];

        var id = bouton.getAttribute("data-evenement");

        var evenement = trouverEvenement(id);

        if (evenement !== null) {

            var inscription = localStorage.getItem("inscription-" + id);

            var compteur = document.getElementById(evenement.compteur);

            if (inscription === "oui") {

                compteur.textContent = evenement.participants + 1;

                bouton.textContent = "✓ INSCRIPTION CONFIRMÉE";

                bouton.classList.add("inscrit");

            } else {

                compteur.textContent = evenement.participants;

                bouton.textContent = "🎟️ JE PARTICIPE";

                bouton.classList.remove("inscrit");

            }

        }

    }

}


// ========================================
// 4. CLIQUER SUR JE PARTICIPE
// ========================================

for (var i = 0; i < boutonsParticiper.length; i++) {

    boutonsParticiper[i].addEventListener("click", function() {

        var id = this.getAttribute("data-evenement");

        var inscription = localStorage.getItem("inscription-" + id);

        var message = document.getElementById("message-inscription");

        if (inscription === "oui") {

            // Annuler l'inscription
            localStorage.removeItem("inscription-" + id);

            message.textContent =
                "Ton inscription de démonstration a été annulée.";

        } else {

            // Enregistrer l'inscription
            localStorage.setItem("inscription-" + id, "oui");

            message.textContent =
                "🏁 Inscription de démonstration confirmée !";

        }

        // Actualiser les boutons et compteurs
        afficherInscriptions();

    });

}


// ========================================
// 5. CHARGEMENT INITIAL
// ========================================

afficherInscriptions();