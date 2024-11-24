document.addEventListener("DOMContentLoaded", function() {
    // Récupérer les victoires stockées dans localStorage
    const victories = JSON.parse(localStorage.getItem("victories")) || [];
    const victoryList = document.getElementById("victory-list");

    // Fonction pour afficher les victoires
    function displayVictories() {
        victoryList.innerHTML = ""; // Réinitialiser la liste
        victories.forEach((victory, index) => {
            const victoryDiv = document.createElement("div");
            victoryDiv.classList.add("victory");
            victoryDiv.innerHTML = `<p>${victory}</p>`;
            victoryList.appendChild(victoryDiv);
        });
    }

    // Fonction pour ajouter une nouvelle victoire
    const addVictoryBtn = document.getElementById("add-victory-btn");
    addVictoryBtn.addEventListener("click", function() {
        const victoryInput = document.getElementById("victory-input");
        const newVictory = victoryInput.value.trim();

        if (newVictory) {
            victories.push(newVictory); // Ajouter la nouvelle victoire au tableau
            localStorage.setItem("victories", JSON.stringify(victories)); // Sauvegarder dans localStorage
            victoryInput.value = ""; // Réinitialiser le champ
            displayVictories(); // Rafraîchir l'affichage des victoires
        }
    });

    // Afficher les victoires existantes au chargement
    displayVictories();
});
