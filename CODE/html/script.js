
// CARROUSEL


// Récupération des slides
var slides = document.querySelectorAll(".slide");
var index = 0;
var interval;

// Fonction pour afficher une slide
function afficher(n) {

    if (n >= slides.length) {
        n = 0;
    }

    if (n < 0) {
        n = slides.length - 1;
    }

    for (var i = 0; i < slides.length; i++) {
        slides[i].className = "slide";
    }

    slides[n].className = "slide active";

    index = n;
}

// Fonction pour faire défiler automatiquement
function demarrer() {

    clearInterval(interval);

    interval = setInterval(function () {
        afficher(index + 1);
    }, 4000);
}

// Bouton suivant
document.getElementById("next").onclick = function () {
    afficher(index + 1);
    demarrer();
};

// Bouton précédent
document.getElementById("prev").onclick = function () {
    afficher(index - 1);
    demarrer();
};

// Démarrage du carrousel
demarrer();

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

    if (ecurie === "Alpine F1 Team") {
        return "#FF87BC";
    }

    if (ecurie === "Williams") {
        return "#64C4FF";
    }

    if (ecurie === "Haas F1 Team") {
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
// DERNIER PODIUM F1
// ==========================================

// Fonction pour récupérer les résultats
function chargerPodium() {

    // Connexion à l'API F1
    fetch("https://api.jolpi.ca/ergast/f1/current/last/results.json")

        // Vérification de la réponse
        .then(function(reponse) {

            if (!reponse.ok) {
                throw new Error("Erreur de chargement");
            }

            return reponse.json();
        })

        // Récupération des données
        .then(function(donnees) {

            // Récupération de la dernière course
            var courses = donnees.MRData.RaceTable.Races;

            if (courses.length === 0) {
                document.getElementById("nom-gp").textContent =
                    "Aucun Grand Prix disponible";
                return;
            }

            var course = courses[0];

            // Affichage du nom du Grand Prix
            document.getElementById("nom-gp").textContent =
                course.raceName;

            // Récupération des résultats
            var resultats = course.Results;
            // ==========================================
            // // MEILLEUR TOUR DU GRAND PRIX
            // // ==========================================
            var meilleurPilote = "";
            var meilleurTemps = "";
            // On parcourt les résultats
            for (var i = 0; i < resultats.length; i++) {
                // On vérifie si le pilote possède un meilleur tour
                if (resultats[i].FastestLap) {
                    // Le rang 1 correspond au meilleur tour de la course
                    if (resultats[i].FastestLap.rank == "1") {
                        meilleurPilote =
                        resultats[i].Driver.givenName + " " +
                        resultats[i].Driver.familyName;
                        meilleurTemps = resultats[i].FastestLap.Time.time;
                        // Couleur de l'écurie du pilote ayant réalisé le meilleur tour
                        var ecurieMeilleurTour = resultats[i].Constructor.name;
                        document.getElementById("meilleur-tour").style.borderLeftColor =
                        couleurEcurie(ecurieMeilleurTour);
                    }
                }
            }
            // Affichage du meilleur tour
            if (meilleurPilote != "") {
                document.getElementById("meilleur-tour").textContent =
                meilleurPilote + " (" + meilleurTemps + ")";
            } else {
                document.getElementById("meilleur-tour").textContent =
                "Information indisponible";
            }

            // Sélection de la liste HTML
            var liste = document.getElementById("liste-podium");

            // Suppression des anciens résultats
            liste.replaceChildren();

            // Affichage des trois premiers pilotes
            for (var i = 0; i < 3 && i < resultats.length; i++) {

                // Récupération du pilote
                var pilote = resultats[i].Driver;
                // Nom complet du pilote
                var nom = pilote.givenName + " " + pilote.familyName;
                // Numéro du pilote
                var numero = pilote.permanentNumber;
                // Écurie du pilote
                var ecurie = resultats[i].Constructor.name;
                // Création d'une ligne
                var ligne = document.createElement("li");
                // Affichage des informations
                ligne.textContent =
                    (i + 1) + ". " + nom + " — #" + numero + " — " + ecurie;
                // Couleur de la bordure selon l'écurie
                ligne.style.borderLeftColor = couleurEcurie(ecurie);
                // Ajout dans la liste
                liste.appendChild(ligne);
            }

        })

        // Gestion des erreurs
        .catch(function(erreur) {

            console.log("Erreur API F1 :", erreur);

            document.getElementById("nom-gp").textContent =
                "Résultats indisponibles";

            document.getElementById("liste-podium").textContent =
                "Impossible de charger le podium.";
        });
}

// Chargement des résultats à l'ouverture
chargerPodium();

// Actualisation automatique toutes les heures
setInterval(chargerPodium, 3600000);


// PODIUM DU GRAND PRIX PRÉCÉDENT


function chargerAncienPodium() {

    // Récupération des deux derniers Grands Prix
    fetch("https://api.jolpi.ca/ergast/f1/current/races.json?limit=100")

        .then(function(reponse) {
            return reponse.json();
        })

        .then(function(donnees) {

            var courses = donnees.MRData.RaceTable.Races;

            // On vérifie qu'il y a au moins deux courses
            if (courses.length < 2) {
                document.getElementById("ancien-podium").textContent =
                    "Information indisponible";
                return;
            }

            // On récupère le numéro de l'avant-dernière course
            var numero = 0;
            for (var i = 0; i < courses.length; i++) {
                var dateCourse = new Date(courses[i].date);
                var aujourdHui = new Date();
                if (dateCourse < aujourdHui) {
                    numero = courses[i].round;
                }
            }
            numero = numero - 1;

            // On récupère les résultats de cette course
            return fetch(
                "https://api.jolpi.ca/ergast/f1/current/" +
                numero + "/results.json"
            );

        })

        .then(function(reponse) {

            if (!reponse) {
                return;
            }

            return reponse.json();

        })

        .then(function(donnees) {

            if (!donnees) {
                return;
            }

            var course = donnees.MRData.RaceTable.Races[0];
            // Sélection du podium précédent
            var podium = document.getElementById("ancien-podium");
            // Suppression de l'ancien contenu
            podium.replaceChildren();
            // Affichage des trois pilotes
            for (var i = 0; i < 3 && i < course.Results.length; i++) {
                // Informations du pilote
                var pilote = course.Results[i].Driver;
                var nom = pilote.givenName + " " + pilote.familyName;
                var numero = pilote.permanentNumber;
                var ecurie = course.Results[i].Constructor.name;
                // Création d'une carte
                var ligne = document.createElement("div");
                ligne.className = "pilote-ancien";
                // Texte de la carte
                ligne.textContent = (i + 1) + ". " + nom + " — #" + numero + " — " + ecurie;
                // Couleur de l'écurie
                ligne.style.borderLeftColor = couleurEcurie(ecurie);
                // Ajout au podium
                podium.appendChild(ligne);
            } // Fin de la boucle for
        }) // Fin du .then(function(donnees)
        .catch(function(erreur) {
            console.log("Erreur podium précédent :", erreur);
            document.getElementById("ancien-podium").textContent =
            "Résultats indisponibles";
        });

} // Fin de chargerAncienPodium


// Chargement à l'ouverture
chargerAncienPodium();

// Actualisation toutes les heures
setInterval(chargerAncienPodium, 3600000);
// ==========================================
// CLASSEMENT GÉNÉRAL DES PILOTES
// ==========================================

function chargerClassementPilotes() {

    // Récupération du classement actuel
    fetch("https://api.jolpi.ca/ergast/f1/current/driverStandings.json")

        .then(function(reponse) {
            return reponse.json();
        })

        .then(function(donnees) {

            var classements = donnees.MRData.StandingsTable.StandingsLists;

            if (classements.length === 0) {
                document.getElementById("classement-pilotes").textContent =
                    "Classement indisponible";
                return;
            }

            // Récupération des pilotes
            var pilotes = classements[0].DriverStandings;
            // Sélection du bloc HTML
            var classement = document.getElementById("classement-pilotes");
            // Suppression de l'ancien contenu
            classement.replaceChildren();
            // Affichage des trois premiers pilotes
            for (var i = 0; i < 3 && i < pilotes.length; i++) {
                var pilote = pilotes[i].Driver;
                var nom = pilote.givenName + " " + pilote.familyName;
                var numero = pilote.permanentNumber;
                var ecurie = pilotes[i].Constructors[0].name;
                var points = pilotes[i].points;
                // Création d'une ligne pour chaque pilote
                var ligne = document.createElement("div");
                // Texte de la ligne
                ligne.textContent =
                (i + 1) + ". " +
                nom +
                " — #" + numero +
                " — " + ecurie +
                " — " + points + " pts";
                // Ajout de la ligne dans le classement
                classement.appendChild(ligne);
                }
            })
            .catch(function(erreur) {
                console.log("Erreur classement pilotes :", erreur);
                document.getElementById("classement-pilotes").textContent =
                "Impossible de charger le classement.";
            });
        }
        // Chargement à l'ouverture
        chargerClassementPilotes();
        // Actualisation toutes les heures
        setInterval(chargerClassementPilotes, 3600000);
        // ==========================================
        // CLASSEMENT GÉNÉRAL DES ÉCURIES
        // ==========================================
        function chargerClassementEcuries() {
            // Récupération du classement des écuries
            fetch("https://api.jolpi.ca/ergast/f1/current/constructorStandings.json")
            .then(function(reponse) {
                return reponse.json();
            })
            .then(function(donnees) {
                var classements = donnees.MRData.StandingsTable.StandingsLists;
                if (classements.length === 0) {
                    document.getElementById("classement-ecuries").textContent =
                    "Classement indisponible"
                document.getElementById("ecurie-leader").textContent =
                    "Information indisponible";

                return;
            }

            // Récupération des écuries
            var ecuries = classements[0].ConstructorStandings;// Sélection du bloc HTML
            var classement = document.getElementById("classement-ecuries");
            // Suppression de l'ancien contenu
            classement.replaceChildren();
            // Affichage des trois premières écuries
            for (var i = 0; i < 3 && i < ecuries.length; i++) {
                var nom = ecuries[i].Constructor.name;
                var points = ecuries[i].points;
                // Création d'une ligne
                var ligne = document.createElement("div");
                // Ajout des informations
                ligne.textContent =
                (i + 1) + ". " +
                nom + " — " + points + " pts";
                // Ajout de la ligne au classement
                classement.appendChild(ligne);
            }

            // Affichage de l'écurie leader
            if (ecuries.length > 0) {

                document.getElementById("ecurie-leader").textContent =
                    ecuries[0].Constructor.name +
                    " (" + ecuries[0].points + " pts)";
            }
            // Couleur de l'écurie leader
            var nomEcurieLeader = ecuries[0].Constructor.name;
            document.getElementById("ecurie-leader").style.borderLeftColor =
            couleurEcurie(nomEcurieLeader);

        })

        .catch(function(erreur) {

            console.log("Erreur classement écuries :", erreur);

            document.getElementById("classement-ecuries").textContent =
                "Impossible de charger le classement.";

            document.getElementById("ecurie-leader").textContent =
                "Information indisponible";
        });
}

// Chargement à l'ouverture
chargerClassementEcuries();

// Actualisation toutes les heures
setInterval(chargerClassementEcuries, 3600000);