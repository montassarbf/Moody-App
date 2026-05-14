document.addEventListener("DOMContentLoaded", function() {
    // Récupérer l'utilisateur actuel depuis localStorage
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    // Vérifier si l'utilisateur est connecté
    if (currentUser && currentUser.name) {
        // Afficher le nom de l'utilisateur dans le span
        document.getElementById('currentUser').textContent = currentUser.name;
    } else {
        // Si aucun utilisateur n'est trouvé, afficher un message d'erreur ou rediriger
        document.getElementById('currentUser').textContent = "Utilisateur inconnu";
        // Vous pouvez aussi rediriger l'utilisateur vers la page de connexion si nécessaire :
        // window.location.href = 'login.html';
    }
});


document.addEventListener("DOMContentLoaded", function() {
    // Phrase positive dynamique (affichage aléatoire)
    const positiveMessages = [
        "Vous êtes incroyable aujourd'hui !",
        "Continuez à briller !",
        "Votre énergie est contagieuse !",
        "Aujourd'hui est votre jour !",
        "Gardez le sourire, tout est possible !"
    ];

    const messageElement = document.getElementById('positiveMessage');

    // Changer la phrase immédiatement au chargement de la page
    messageElement.textContent = positiveMessages[Math.floor(Math.random() * positiveMessages.length)];

    // Changer la phrase toutes les 10 secondes
    setInterval(function() {
        messageElement.textContent = positiveMessages[Math.floor(Math.random() * positiveMessages.length)];
    }, 3000);
    

    // Graphique d'activité
    const studentsHelpingPerDay = [3, 5, 7, 4, 6, 8, 10]; // Exemple de données
    const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

    const ctx = document.getElementById('activityGraph')?.getContext('2d');
    if (ctx) {
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: days,
                datasets: [{
                    label: 'Étudiants aidés',
                    data: studentsHelpingPerDay,
                    backgroundColor: 'rgba(69, 162, 158, 0.5)',
                    borderColor: '#45a29e',
                    borderWidth: 2,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
  // Gestion de la sélection des emojis
  const emojis = document.querySelectorAll('.emoji');
  const selectedEmojiDisplay = document.getElementById('selectedEmoji');

  emojis.forEach(emoji => {
      emoji.addEventListener('click', function() {
          const selectedEmoji = emoji.dataset.emoji;
          selectedEmojiDisplay.textContent = `Emoji sélectionné: ${selectedEmoji}`;
      });
  });
    // Charger les posts depuis localStorage
    const postsContainer = document.getElementById("posts");
    const posts = JSON.parse(localStorage.getItem("posts")) || [];

    // Fonction pour afficher les posts sans likes ni commentaires
    function displayPosts() {
        postsContainer.innerHTML = ""; // Réinitialiser l'affichage
        posts.forEach((post) => {
            const postDiv = document.createElement("div");
            postDiv.classList.add("post");

            // Affichage des posts sans les fonctionnalités de commentaires et likes
            postDiv.innerHTML = `
                <h3>${post.title} ${post.emoji}</h3>
                <p>${post.content}</p>
                ${post.image ? `<img src="${post.image}" alt="Post image" style="width: 100px;">` : ""}
            `;
            postsContainer.appendChild(postDiv);
        });
    }

    // Afficher les posts au chargement
    displayPosts();

    // Fonction pour gérer la soumission des posts dans create.html
    const problemForm = document.getElementById("problemForm");
    if (problemForm) {
        problemForm.addEventListener("submit", function(event) {
            event.preventDefault();

            const title = document.getElementById("title").value;
            const content = document.getElementById("content").value;
            const emoji = document.getElementById("emoji").value;
            const imageFile = document.getElementById("image").files[0];

            const post = {
                title,
                content,
                emoji,
                image: imageFile ? URL.createObjectURL(imageFile) : null,
                comments: [],
                likes: 0
            };

            // Enregistrement du post dans localStorage
            const posts = JSON.parse(localStorage.getItem("posts")) || [];
            posts.push(post);
            localStorage.setItem("posts", JSON.stringify(posts));

            // Affichage du message de succès et redirection
            const messageSuccess = document.getElementById("message-success");
            if (messageSuccess) {
                messageSuccess.textContent = "Votre problème a été partagé avec succès !";
                messageSuccess.style.color = "green"; // Mettre le message en vert
            }

            setTimeout(function() {
                // Rediriger vers view.html après 2 secondes
                window.location.href = "view.html";
            }, 2000);
        });
    }
});
document.addEventListener("DOMContentLoaded", function() {
    // Charger les posts depuis localStorage
    const postsContainer = document.getElementById("posts");
    const posts = JSON.parse(localStorage.getItem("posts")) || [];

    // Fonction pour afficher les posts
    function displayPosts() {
        postsContainer.innerHTML = ""; // Réinitialiser l'affichage
        posts.forEach((post, index) => {
            const postDiv = document.createElement("div");
            postDiv.classList.add("post");

            // Affichage des posts
            postDiv.innerHTML = `
                <h3>${post.title} ${post.emoji}</h3>
                <p>${post.content}</p>
                ${post.image ? `<img src="${post.image}" alt="Post image" style="width: 100px;">` : ""}
                
                <!-- Section des réactions -->
                <div class="like-section">
                    <div class="emoji-buttons">
                        <button class="emoji" onclick="addReaction(${index}, '❤️')">❤️</button>
                        <button class="emoji" onclick="addReaction(${index}, '👍')">👍</button>
                        <button class="emoji" onclick="addReaction(${index}, '😂')">😂</button>
                        <button class="emoji" onclick="addReaction(${index}, '😮')">😮</button>
                        <button class="emoji" onclick="addReaction(${index}, '😢')">😢</button>
                    </div>
                    <p id="reaction-count-${index}">
                        ${post.reactions ? Object.entries(post.reactions).map(([emoji, count]) => `${emoji}: ${count}`).join(", ") : "Pas de réactions"}
                    </p>
                </div>

                <!-- Section des commentaires -->
                <div class="comment-section">
                    <input type="text" id="comment-input-${index}" style="border:1px solid black; margin:10px;" placeholder="Écrivez un commentaire..."/>
                    <button onclick="addComment(${index})" style="width:200px; height:35px; margin:10px;">Ajouter un commentaire</button>
                </div>    
                    <div id="comments-${index}" style="margin:10px;">
                        ${post.comments && post.comments.length > 0 ? post.comments.map(comment => `<p>${comment}</p>`).join("") : "Pas de commentaires."}
                    </div>
                
            `;
            postsContainer.appendChild(postDiv);
        });
    }

    // Fonction pour ajouter une réaction (like avec emoji)
    window.addReaction = function(postIndex, emoji) {
        const post = posts[postIndex];
        post.reactions = post.reactions || {};

        // Si l'emoji existe déjà, incrémenter le compteur
        if (post.reactions[emoji]) {
            post.reactions[emoji] += 1;
        } else {
            post.reactions[emoji] = 1;
        }

        // Enregistrer les posts avec les réactions dans localStorage
        localStorage.setItem("posts", JSON.stringify(posts));
        
        // Rafraîchir l'affichage des posts
        displayPosts();
    };

    // Fonction pour ajouter un commentaire
    window.addComment = function(postIndex) {
        const commentInput = document.getElementById(`comment-input-${postIndex}`);
        const commentText = commentInput.value.trim();

        if (commentText) {
            posts[postIndex].comments = posts[postIndex].comments || [];
            posts[postIndex].comments.push(commentText);

            // Enregistrer les posts avec les commentaires dans localStorage
            localStorage.setItem("posts", JSON.stringify(posts));

            // Rafraîchir l'affichage des posts
            displayPosts();
        }
    };

    // Afficher les posts au chargement
    displayPosts();

    // Fonction pour gérer la soumission des posts dans create.html
    const problemForm = document.getElementById("problemForm");
    if (problemForm) {
        problemForm.addEventListener("submit", function(event) {
            event.preventDefault();

            const title = document.getElementById("title").value;
            const content = document.getElementById("content").value;
            const emoji = document.getElementById("emoji").value;
            const imageFile = document.getElementById("image").files[0];

            const post = {
                title,
                content,
                emoji,
                image: imageFile ? URL.createObjectURL(imageFile) : null,
                comments: [], // Initialiser les commentaires
                likes: 0,
                reactions: {} // Initialiser les réactions
            };

            // Enregistrement du post dans localStorage
            const posts = JSON.parse(localStorage.getItem("posts")) || [];
            posts.push(post);
            localStorage.setItem("posts", JSON.stringify(posts));

            // Affichage du message de succès et redirection
            const messageSuccess = document.getElementById("message-success");
            if (messageSuccess) {
                messageSuccess.textContent = "Votre problème a été partagé avec succès !";
                messageSuccess.style.color = "green"; // Mettre le message en vert
            }

            setTimeout(function() {
                // Rediriger vers view.html après 2 secondes
                window.location.href = "view.html";
            }, 2000);
        });
    }
});

// Quand la page 'create.html' se charge
document.addEventListener("DOMContentLoaded", function() {
    // Gestion de la soumission du problème dans create.html
    const problemForm = document.getElementById("problemForm");
    problemForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const title = document.getElementById("title").value;
        const content = document.getElementById("content").value;
        const emoji = document.getElementById("emoji").value;
        const imageFile = document.getElementById("image").files[0];

        const post = {
            title,
            content,
            emoji,
            image: imageFile ? URL.createObjectURL(imageFile) : null,
            comments: [],
            likes: 0
        };

        // Enregistrement du post dans localStorage
        const posts = JSON.parse(localStorage.getItem("posts")) || [];
        posts.push(post);
        localStorage.setItem("posts", JSON.stringify(posts));

        // Affichage du message de succès et redirection
        const messageSuccess = document.getElementById("message-success");
        messageSuccess.textContent = "Votre problème a été partagé avec succès !";
        messageSuccess.style.color = "green"; // Mettre le message en vert

        setTimeout(function() {
            // Rediriger vers view.html après 2 secondes
            window.location.href = "view.html";
        }, 2000);
    });
});