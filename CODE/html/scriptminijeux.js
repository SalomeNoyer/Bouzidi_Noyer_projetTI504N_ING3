// ==========================================
// MINI-JEU F1 : QUIZ ET COURSE
// ==========================================


// 1. QUESTIONS DU QUIZ

var questions = [
    {
        question: "Quel pilote possède 7 titres de champion du monde de F1 ?",
        reponses: ["Charles Leclerc", "Lewis Hamilton", "Lando Norris", "Fernando Alonso"],
        bonneReponse: 1
    },
    {
        question: "Quelle couleur est traditionnellement associée à Ferrari ?",
        reponses: ["Bleu", "Vert", "Rouge", "Jaune"],
        bonneReponse: 2
    },
    {
        question: "Combien de points rapporte une victoire en Grand Prix de F1 ?",
        reponses: ["15", "20", "25", "30"],
        bonneReponse: 2
    },
    {
        question: "Dans quel pays se déroule le Grand Prix de Monaco ?",
        reponses: ["France", "Italie", "Monaco", "Espagne"],
        bonneReponse: 2
    },
    {
        question: "Quel pilote est surnommé Mad Max ?",
        reponses: ["Max Verstappen", "George Russell", "Oscar Piastri", "Carlos Sainz"],
        bonneReponse: 0
    },
    {
        question: "Que signifie un drapeau jaune en Formule 1 ?",
        reponses: [
            "Fin de la course",
            "Danger sur la piste",
            "Dépassement obligatoire",
            "Départ de la course"
        ],
        bonneReponse: 1
    },
    {
        question: "Quelle écurie est basée à Maranello ?",
        reponses: ["Mercedes", "McLaren", "Ferrari", "Williams"],
        bonneReponse: 2
    },
    {
        question: "Que signifie DRS en Formule 1 ?",
        reponses: [
            "Driver Racing System",
            "Drag Reduction System",
            "Direct Racing Speed",
            "Dynamic Race Start"
        ],
        bonneReponse: 1
    },
    {
        question: "Quel pilote a remporté son premier titre mondial en 2021 ?",
        reponses: [
            "Lewis Hamilton",
            "Sebastian Vettel",
            "Max Verstappen",
            "Fernando Alonso"
        ],
        bonneReponse: 2
    },
    {
        question: "Quel drapeau indique la fin d'une course de F1 ?",
        reponses: [
            "Drapeau rouge",
            "Drapeau bleu",
            "Drapeau jaune",
            "Drapeau à damier"
        ],
        bonneReponse: 3
    }
];


// ==========================================
// 2. VARIABLES DU JEU
// ==========================================

var numeroQuestion = 0;
var bonnesReponses = 0;

var pseudoJoueur = "";

var temps = 0;
var chronometre = null;

var jeuCommence = false;


// ==========================================
// 3. RECUPERATION DES ELEMENTS HTML
// ==========================================

var boutonDemarrer = document.getElementById("bouton-demarrer");
var boutonRejouer = document.getElementById("bouton-rejouer");

var zoneDepart = document.getElementById("zone-depart");
var zoneQuiz = document.getElementById("zone-quiz");
var zoneFin = document.getElementById("zone-fin");

var questionHTML = document.getElementById("question");
var reponsesHTML = document.getElementById("reponses");

var messageReponse = document.getElementById("message-reponse");

var voiture = document.getElementById("voiture");

var affichageTemps = document.getElementById("chronometre");
var affichageProgression = document.getElementById("progression");


// ==========================================
// 4. FORMAT DU CHRONOMETRE
// ==========================================

function formaterTemps(secondes) {

    var minutes = Math.floor(secondes / 60);
    var secondesRestantes = secondes % 60;

    var texteMinutes = minutes.toString();
    var texteSecondes = secondesRestantes.toString();

    if (minutes < 10) {
        texteMinutes = "0" + texteMinutes;
    }

    if (secondesRestantes < 10) {
        texteSecondes = "0" + texteSecondes;
    }

    return texteMinutes + ":" + texteSecondes;
}


// ==========================================
// 5. DEMARRER LA COURSE
// ==========================================

function demarrerCourse() {

    var pseudo = document.getElementById("pseudo").value.trim();

    if (pseudo === "") {
        alert("Entre ton pseudo avant de commencer !");
        return;
    }

    pseudoJoueur = pseudo;

    numeroQuestion = 0;
    bonnesReponses = 0;
    temps = 0;

    jeuCommence = true;

    // Réinitialisation des affichages

    affichageTemps.textContent = "00:00";
    affichageProgression.textContent = "0/10";

    voiture.style.left = "2%";

    messageReponse.textContent = "";

    zoneDepart.style.display = "none";
    zoneFin.hidden = true;
    zoneQuiz.style.display = "block";

    // Démarrage du chronomètre

    clearInterval(chronometre);

    chronometre = setInterval(function() {

        temps++;

        affichageTemps.textContent = formaterTemps(temps);

    }, 1000);

    // Première question

    afficherQuestion();
}


// ==========================================
// 6. AFFICHER UNE QUESTION
// ==========================================

function afficherQuestion() {

    var questionActuelle = questions[numeroQuestion];

    questionHTML.textContent =
        "QUESTION " + (numeroQuestion + 1) + "/10 : " +
        questionActuelle.question;

    // Supprimer les anciennes réponses

    reponsesHTML.replaceChildren();

    messageReponse.textContent = "";

    // Créer les quatre boutons

    for (var i = 0; i < questionActuelle.reponses.length; i++) {

        var bouton = document.createElement("button");

        bouton.textContent = questionActuelle.reponses[i];

        bouton.className = "bouton-reponse";

        // Mémoriser le numéro de la réponse

        bouton.value = i;

        bouton.addEventListener("click", function() {

            verifierReponse(Number(this.value));

        });

        reponsesHTML.appendChild(bouton);
    }
}


// ==========================================
// 7. VERIFIER LA REPONSE
// ==========================================

function verifierReponse(reponseChoisie) {

    if (jeuCommence === false) {
        return;
    }

    var questionActuelle = questions[numeroQuestion];

    if (reponseChoisie === questionActuelle.bonneReponse) {

        // Bonne réponse

        bonnesReponses++;

        messageReponse.textContent = "✅ Bonne réponse ! Ta voiture avance !";

        messageReponse.style.color = "#20e6c0";

        // Mise à jour de la progression

        affichageProgression.textContent =
            bonnesReponses + "/10";

        // Déplacement de la voiture

        var position = 2 + (bonnesReponses * 8.5);

        voiture.style.left = position + "%";

        // Passer à la question suivante

        numeroQuestion++;

        // Désactiver les boutons pendant la transition

        var boutons = reponsesHTML.querySelectorAll("button");

        for (var i = 0; i < boutons.length; i++) {
            boutons[i].disabled = true;
        }

        if (numeroQuestion === questions.length) {

            terminerCourse();

        } else {

            setTimeout(function() {

                afficherQuestion();

            }, 800);
        }

    } else {

        // Mauvaise réponse

        messageReponse.textContent =
            "❌ Mauvaise réponse ! Réessaie pour avancer.";

        messageReponse.style.color = "#ff5555";
    }
}


// ==========================================
// 8. TERMINER LA COURSE
// ==========================================

function terminerCourse() {

    jeuCommence = false;

    // Arrêter le chronomètre

    clearInterval(chronometre);

    // Afficher le résultat

    zoneQuiz.style.display = "none";

    zoneFin.hidden = false;

    document.getElementById("temps-final").textContent =
        "Bravo " + pseudoJoueur +
        " ! Tu as terminé la course en " +
        formaterTemps(temps) + " ! 🏁";

    // Enregistrer le score

    enregistrerScore(pseudoJoueur, temps);

    // Actualiser le classement

    afficherClassement();
}


// ==========================================
// 9. ENREGISTRER LE SCORE
// ==========================================

function enregistrerScore(pseudo, tempsJoueur) {

    var scores = JSON.parse(localStorage.getItem("scoresF1"));

    if (scores === null) {
        scores = [];
    }

    // Ajouter le nouveau résultat

    scores.push({
        pseudo: pseudo,
        temps: tempsJoueur
    });

    // Classer du plus rapide au plus lent

    scores.sort(function(a, b) {
        return a.temps - b.temps;
    });

    // Garder les dix meilleurs résultats

    scores = scores.slice(0, 10);

    // Sauvegarder dans le navigateur

    localStorage.setItem("scoresF1", JSON.stringify(scores));
}


// ==========================================
// 10. AFFICHER LE CLASSEMENT
// ==========================================

function afficherClassement() {

    var tableau = document.getElementById("tableau-scores");

    tableau.replaceChildren();

    var scores = JSON.parse(localStorage.getItem("scoresF1"));

    if (scores === null || scores.length === 0) {

        var ligneVide = document.createElement("tr");

        var celluleVide = document.createElement("td");

        celluleVide.colSpan = 3;

        celluleVide.textContent =
            "Aucun score enregistré pour le moment.";

        ligneVide.appendChild(celluleVide);

        tableau.appendChild(ligneVide);

        return;
    }

    for (var i = 0; i < scores.length; i++) {

        var ligne = document.createElement("tr");

        var position = document.createElement("td");
        var pseudo = document.createElement("td");
        var tempsScore = document.createElement("td");

        position.textContent = i + 1;

        pseudo.textContent = scores[i].pseudo;

        tempsScore.textContent = formaterTemps(scores[i].temps);

        ligne.appendChild(position);
        ligne.appendChild(pseudo);
        ligne.appendChild(tempsScore);

        tableau.appendChild(ligne);
    }
}


// ==========================================
// 11. REJOUER
// ==========================================

function rejouer() {

    clearInterval(chronometre);

    jeuCommence = false;

    numeroQuestion = 0;
    bonnesReponses = 0;
    temps = 0;

    voiture.style.left = "2%";

    affichageTemps.textContent = "00:00";
    affichageProgression.textContent = "0/10";

    zoneDepart.style.display = "block";

    zoneQuiz.style.display = "block";

    zoneFin.hidden = true;

    questionHTML.textContent = "Prêt à prendre le départ ?";

    reponsesHTML.replaceChildren();

    messageReponse.textContent = "";
}


// ==========================================
// 12. EVENEMENTS
// ==========================================

// Bouton démarrer

boutonDemarrer.addEventListener("click", demarrerCourse);

// Bouton rejouer

boutonRejouer.addEventListener("click", rejouer);

// Affichage du classement au chargement

afficherClassement();