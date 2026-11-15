// ==========================================
// COULEURS DES ÉCURIES F1
// ==========================================

function couleurEcurie(ecurie) {

    if (ecurie === "McLaren") {
        return "#FF8000";
    }

    if (ecurie === "Red Bull") {
        return "#3671C6";
    }

    if (ecurie === "Ferrari") {
        return "#E80020";
    }

    if (ecurie === "Mercedes") {
        return "#27F4D2";
    }

    if (ecurie === "Aston Martin") {
        return "#229971";
    }

    if (ecurie === "Alpine F1 Team" || ecurie === "Alpine") {
        return "#FF87BC";
    }

    if (ecurie === "Williams") {
        return "#64C4FF";
    }

    if (ecurie === "Haas F1 Team" || ecurie === "Haas") {
        return "#B6BABD";
    }

    if (ecurie === "RB F1 Team" || ecurie === "Racing Bulls") {
        return "#6692FF";
    }

    if (ecurie === "Sauber" || ecurie === "Audi") {
        return "#52E252";
    }

    return "#E10600";
}


// ==========================================
// FONCTION POUR CRÉER UNE CELLULE
// ==========================================

function ajouterCellule(ligne, texte, classe) {

    var cellule = document.createElement("td");

    cellule.textContent = texte;

    if (classe) {
        cellule.className = classe;
    }

    ligne.appendChild(cellule);
}


// ==========================================
// AFFICHER UN MESSAGE DANS UN TABLEAU
// ==========================================

function ajouterMessage(tableau, message, colonnes) {

    var ligne = document.createElement("tr");

    var cellule = document.createElement("td");

    cellule.colSpan = colonnes;

    cellule.textContent = message;

    ligne.appendChild(cellule);

    tableau.appendChild(ligne);
}


// ==========================================
// CLASSEMENT COMPLET DES PILOTES
// ==========================================

function chargerTousLesPilotes() {

    fetch("https://api.jolpi.ca/ergast/f1/current/driverStandings.json?limit=100")

        .then(function(reponse) {

            if (!reponse.ok) {
                throw new Error("Erreur de chargement");
            }

            return reponse.json();
        })

        .then(function(donnees) {

            var listes = donnees.MRData.StandingsTable.StandingsLists;

            var tableau = document.getElementById("tableau-pilotes");

            tableau.replaceChildren();

            if (listes.length === 0) {

                ajouterMessage(
                    tableau,
                    "Aucun classement disponible.",
                    4
                );

                return;
            }

            var pilotes = listes[0].DriverStandings;

            // Affichage de tous les pilotes
            for (var i = 0; i < pilotes.length; i++) {

                var pilote = pilotes[i];

                var nom = pilote.Driver.givenName + " " +
                          pilote.Driver.familyName;

                var ecurie = pilote.Constructors[0].name;

                var points = pilote.points;

                var position = pilote.position;

                // Création d'une ligne
                var ligne = document.createElement("tr");

                // Couleur de l'écurie
                ligne.style.setProperty(
                    "--couleur-equipe",
                    couleurEcurie(ecurie)
                );

                // Création des cellules
                ajouterCellule(ligne, position, "position");

                ajouterCellule(ligne, nom, "nom-pilote");

                ajouterCellule(ligne, ecurie, "nom-ecurie");

                ajouterCellule(ligne, points + " pts", "points");

                // Ajout de la ligne dans le tableau
                tableau.appendChild(ligne);
            }
        })

        .catch(function(erreur) {

            console.log("Erreur classement pilotes :", erreur);

            var tableau = document.getElementById("tableau-pilotes");

            tableau.replaceChildren();

            ajouterMessage(
                tableau,
                "Impossible de charger le classement des pilotes.",
                4
            );
        });
}


// ==========================================
// CLASSEMENT COMPLET DES ÉCURIES
// ==========================================

function chargerToutesLesEcuries() {

    fetch("https://api.jolpi.ca/ergast/f1/current/constructorStandings.json?limit=100")

        .then(function(reponse) {

            if (!reponse.ok) {
                throw new Error("Erreur de chargement");
            }

            return reponse.json();
        })

        .then(function(donnees) {

            var listes = donnees.MRData.StandingsTable.StandingsLists;

            var tableau = document.getElementById("tableau-ecuries");

            tableau.replaceChildren();

            if (listes.length === 0) {

                ajouterMessage(
                    tableau,
                    "Aucun classement disponible.",
                    3
                );

                return;
            }

            var ecuries = listes[0].ConstructorStandings;

            // Affichage de toutes les écuries
            for (var i = 0; i < ecuries.length; i++) {

                var ecurie = ecuries[i];

                var nom = ecurie.Constructor.name;

                var points = ecurie.points;

                var position = ecurie.position;

                // Création d'une ligne
                var ligne = document.createElement("tr");

                // Couleur de l'écurie
                ligne.style.setProperty(
                    "--couleur-equipe",
                    couleurEcurie(nom)
                );

                // Création des cellules
                ajouterCellule(ligne, position, "position");

                ajouterCellule(ligne, nom, "nom-ecurie");

                ajouterCellule(ligne, points + " pts", "points");

                // Ajout dans le tableau
                tableau.appendChild(ligne);
            }
        })

        .catch(function(erreur) {

            console.log("Erreur classement écuries :", erreur);

            var tableau = document.getElementById("tableau-ecuries");

            tableau.replaceChildren();

            ajouterMessage(
                tableau,
                "Impossible de charger le classement des écuries.",
                3
            );
        });
}


// ==========================================
// CHARGEMENT AUTOMATIQUE
// ==========================================

// Chargement à l'ouverture
chargerTousLesPilotes();

chargerToutesLesEcuries();

// Actualisation toutes les heures
setInterval(chargerTousLesPilotes, 3600000);

setInterval(chargerToutesLesEcuries, 3600000);