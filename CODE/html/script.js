var slides = document.querySelectorAll(".slide");
var index = 0;
var interval;

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

function demarrer() {
    clearInterval(interval);
    interval = setInterval(function () {
        afficher(index + 1);
    }, 4000);
}

document.getElementById("next").onclick = function () {
    afficher(index + 1);
    demarrer();
};

document.getElementById("prev").onclick = function () {
    afficher(index - 1);
    demarrer();
};

demarrer();