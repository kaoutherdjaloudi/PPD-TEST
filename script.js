document.addEventListener("DOMContentLoaded", function () {
    // Gestion des popups
    const popupContainer = document.getElementById("popup-container");
    const loginPopup = document.getElementById("login-popup");
    const signupPopup = document.getElementById("signup-popup");
    const confirmationPopup = document.getElementById("confirmation-popup");
    const showLogin = document.getElementById("show-login");
    const showSignup = document.getElementById("show-signup");
    const openLogin = document.getElementById("open-login");
    const openSignup = document.getElementById("open-signup");
    const closeButtons = document.querySelectorAll(".close-popup");
    const closeConfirmation = document.getElementById("close-confirmation");

    // Fonction pour ouvrir une popup
    function openPopup(type) {
        // Toujours masquer toutes les popups avant d'en afficher une
        popupContainer.classList.add("active"); // Activer le conteneur de fond sombre
        loginPopup.classList.remove("active");
        signupPopup.classList.remove("active");
        confirmationPopup.classList.remove("active");

        // Afficher uniquement la popup demandée
        if (type === "login") {
            loginPopup.classList.add("active");
        } else if (type === "signup") {
            signupPopup.classList.add("active");
        } else if (type === "confirmation") {
            confirmationPopup.classList.add("active");
        }
    }

    // Ouvrir la popup de connexion
    if (openLogin) {
        openLogin.addEventListener("click", function (event) {
            event.preventDefault();
            openPopup("login");
        });
    }

    // Ouvrir la popup d'inscription
    if (openSignup) {
        openSignup.addEventListener("click", function (event) {
            event.preventDefault();
            openPopup("signup");
        });
    }

    // Basculer de connexion à inscription
    if (showSignup) {
        showSignup.addEventListener("click", function (event) {
            event.preventDefault();
            openPopup("signup");
        });
    }

    // Basculer d'inscription à connexion
    if (showLogin) {
        showLogin.addEventListener("click", function (event) {
            event.preventDefault();
            openPopup("login");
        });
    }

    // Fermer les popups avec le bouton fermer
    closeButtons.forEach(button => {
        button.addEventListener("click", () => {
            popupContainer.classList.remove("active");
            document.querySelectorAll(".popup").forEach(popup => {
                popup.classList.remove("active");
            });
        });
    });

    // Fermer les popups en cliquant à l'extérieur
    popupContainer.addEventListener("click", function (event) {
        if (event.target === popupContainer) {
            popupContainer.classList.remove("active");
            loginPopup.classList.remove("active");
            signupPopup.classList.remove("active");
            confirmationPopup.classList.remove("active");
        }
    });

    // Gestion de l'envoi du formulaire d'inscription
    const signupForm = document.getElementById("signup-form");

    if (signupForm) {
        signupForm.addEventListener("submit", function (event) {
            event.preventDefault(); // Empêche l'envoi immédiat du formulaire

            // Fermer la popup d'inscription et afficher celle de confirmation
            signupPopup.classList.remove("active");
            openPopup("confirmation");

            // Réinitialiser le formulaire après soumission
            signupForm.reset();
        });
    }

    // Fermer la popup de confirmation
    if (closeConfirmation) {
        closeConfirmation.addEventListener("click", function () {
            popupContainer.classList.remove("active");
            confirmationPopup.classList.remove("active");
        });
    }

    // Fonctionnalité "Ajouter au Panier"
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Section Nouveautés
    const produitsSection = document.querySelector(".row"); // Cible la section Nouveautés

    // Section Nos Meilleurs Produits
    const meilleursProduitsSection = document.querySelector(".section_meilleurs_produits");

    fetch("produits.json") // Assure-toi que le chemin est correct
        .then(response => response.json())
        .then(data => {
            // Charger Nouveautés
            data.forEach(produit => {
                const nouveauteHTML = `
                    <div class="col-lg-4 col-md-6 col-sm-12 mb-4">
                        <div class="card">
                            <img src="${produit.image}" class="card-img-top" alt="${produit.nom}">
                            <div class="card-body">
                                <h5 class="card-title">${produit.nom}</h5>
                                <p class="card-text">${produit.description}</p>
                                <div class="d-flex justify-content-between align-items-center">
                                    <span class="text-danger fw-bold">${produit.prix}</span>
                                    <button class="btn btn-primary achat">Acheter</button>
                                </div>
                            </div>
                        </div>
                    </div>`;
                produitsSection.innerHTML += nouveauteHTML;
            });

            // Charger "Nos Meilleurs Produits"
            data.forEach(produit => {
                if (produit.categorie === "Laptop" || produit.categorie === "Smartphone") { // Exemple de filtre
                    const bestProductHTML = `
                        <div class="col-lg-4 col-md-6 col-sm-12 mb-4">
                            <div class="card">
                                <img src="${produit.image}" class="card-img-top" alt="${produit.nom}">
                                <div class="card-body">
                                    <h5 class="card-title">${produit.nom}</h5>
                                    <p class="card-text">${produit.description}</p>
                                    <div class="d-flex justify-content-between align-items-center">
                                        <span class="text-danger fw-bold">${produit.prix}</span>
                                        <button class="btn btn-primary achat">Acheter</button>
                                    </div>
                                </div>
                            </div>
                        </div>`;
                    meilleursProduitsSection.innerHTML += bestProductHTML;
                }
            });

            // Ajouter la fonctionnalité "Ajouter au Panier" pour tous les boutons dynamiques
            const addToCartButtons = document.querySelectorAll(".achat");
            addToCartButtons.forEach(button => {
                button.addEventListener("click", event => {
                    const productCard = event.target.closest(".card");
                    const productName = productCard.querySelector(".card-title").innerText;
                    const productPrice = productCard.querySelector(".text-danger").innerText;

                    // Sauvegarder les détails du produit dans le panier
                    cart.push({ name: productName, price: productPrice });
                    localStorage.setItem("cart", JSON.stringify(cart));

                    // Notifier l'utilisateur
                    alert(`${productName} a été ajouté à votre panier !`);
                });
            });
        })
        .catch(error => {
            console.error("Erreur lors du chargement des produits :", error);

            // Messages d'erreur pour chaque section
            produitsSection.innerHTML = "<p class='text-center text-danger'>Impossible de charger les nouveautés.</p>";
            meilleursProduitsSection.innerHTML = "<p class='text-center text-danger'>Impossible de charger les meilleurs produits.</p>";
        });
});
