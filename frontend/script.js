
// ========================================
// MEMORA - NAVIGATION
// ========================================

const navLinks = document.querySelectorAll(".nav-link");

navLinks.forEach(function (link) {

    link.addEventListener("click", function (event) {

        navLinks.forEach(function (item) {
            item.classList.remove("active");
        });

        link.classList.add("active");

        // Normal navigation for logged-out visitors
        if (!currentUser) {
            return;
        }

        event.preventDefault();

        const destination = link.getAttribute("href");

        // HOME: Return to dashboard
        if (destination === "#") {

            const musicSection = document.getElementById("music");

            if (musicSection) {
                musicSection.hidden = true;
            }

            showPublicContent(false);

            dashboard.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }

        // TRAVEL: Open My Trips
        else if (destination === "#travel") {

            const musicSection = document.getElementById("music");

            if (musicSection) {
                musicSection.hidden = true;
            }

            myTripsSection.hidden = false;

            myTripsSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

            loadMyTrips();
        }

        // MUSIC: Open Music section
        else if (destination === "#music") {

            const musicSection = document.getElementById("music");

            if (musicSection) {
                musicSection.hidden = false;

                musicSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        }

    });

});



// ========================================
// MUSIC CARD SELECTION
// ========================================

const songCards = document.querySelectorAll(".song-card");

songCards.forEach(function (card) {
    card.addEventListener("click", function (event) {
        if (event.target.closest("a")) {
            return;
        }

        songCards.forEach(function (song) {
            song.classList.remove("selected");
        });

        card.classList.add("selected");
    });
});


// ========================================
// MEMORA AUTHENTICATION
// ========================================

const API_BASE_URL = "http://127.0.0.1:8081/api/auth";

const authOverlay = document.getElementById("auth-overlay");
const openLoginButton = document.getElementById("open-login");
const openSignupButton = document.getElementById("open-signup");
const closeAuthButton = document.getElementById("close-auth");

const authForm = document.getElementById("auth-form");
const authTitle = document.getElementById("auth-title");
const authSubtitle = document.getElementById("auth-subtitle");
const nameGroup = document.getElementById("name-group");

const nameInput = document.getElementById("auth-name");
const emailInput = document.getElementById("auth-email");
const passwordInput = document.getElementById("auth-password");

const authSubmitButton = document.getElementById("auth-submit");
const authMessage = document.getElementById("auth-message");
const switchText = document.getElementById("switch-text");
const switchAuthButton = document.getElementById("switch-auth");

const dashboard = document.getElementById("dashboard");
const dashboardUser = document.getElementById("dashboard-user");
const logoutButton = document.getElementById("logout-btn");

let authMode = "login";
let currentUser = null;


// ========================================
// PUBLIC PAGE AND DASHBOARD
// ========================================

// Public content selectors.
// These elements are hidden while the dashboard is active.
const publicContentSelectors = [
    ".hero",
    "#hero",
    "#travel",
    "#music",
    ".travel-section",
    ".music-section"
];

function showPublicContent(show) {
    publicContentSelectors.forEach(function (selector) {
        document.querySelectorAll(selector).forEach(function (element) {
            element.hidden = !show;
        });
    });

    if (openLoginButton) {
        openLoginButton.hidden = !show;
    }

    if (openSignupButton) {
        openSignupButton.hidden = !show;
    }
}


// Display the authenticated user's dashboard.
function showDashboard(user) {
    currentUser = user;

    if (dashboardUser) {
        dashboardUser.textContent = user.name || "Dreamer";
    }

    if (dashboard) {
        dashboard.hidden = false;
    }

    showPublicContent(false);
    closeAuthModal();
    loadMyTrips();

    // Show the dashboard below the navbar.
    dashboard.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

    document.title = "My Dashboard | MEMORA";
}


// Return to the public homepage.
function showHomepage() {
    currentUser = null;

    if (dashboard) {
        dashboard.hidden = true;
    }

    showPublicContent(true);
    document.title = "MEMORA | Your Memories, Your Story";
}


// ========================================
// AUTHENTICATION MODAL
// ========================================

function openAuthModal(mode) {
    authMode = mode;

    authForm.reset();
    authMessage.textContent = "";
    authMessage.className = "auth-message";

    authOverlay.classList.add("active");
    document.body.style.overflow = "hidden";

    updateAuthForm();

    setTimeout(function () {
        if (authMode === "signup") {
            nameInput.focus();
        } else {
            emailInput.focus();
        }
    }, 100);
}


function updateAuthForm() {
    if (authMode === "signup") {
        authTitle.textContent = "Create Your Account";

        authSubtitle.textContent =
            "Start collecting the moments that matter.";

        nameGroup.hidden = false;
        nameInput.required = true;

        passwordInput.autocomplete = "new-password";

        authSubmitButton.textContent = "Create Account";

        switchText.textContent = "Already have an account?";
        switchAuthButton.textContent = "Log In";
    } else {
        authTitle.textContent = "Welcome Back";

        authSubtitle.textContent =
            "Sign in to revisit your memories.";

        nameGroup.hidden = true;
        nameInput.required = false;

        passwordInput.autocomplete = "current-password";

        authSubmitButton.textContent = "Log In";

        switchText.textContent = "Don't have an account?";
        switchAuthButton.textContent = "Sign Up";
    }
}


function closeAuthModal() {
    authOverlay.classList.remove("active");
    document.body.style.overflow = "";
}


openLoginButton.addEventListener("click", function () {
    openAuthModal("login");
});

openSignupButton.addEventListener("click", function () {
    openAuthModal("signup");
});

closeAuthButton.addEventListener("click", closeAuthModal);

authOverlay.addEventListener("click", function (event) {
    if (event.target === authOverlay) {
        closeAuthModal();
    }
});

document.addEventListener("keydown", function (event) {
    if (
        event.key === "Escape" &&
        authOverlay.classList.contains("active")
    ) {
        closeAuthModal();
    }
});

switchAuthButton.addEventListener("click", function () {
    openAuthModal(authMode === "login" ? "signup" : "login");
});


function showAuthMessage(message, type) {
    authMessage.textContent = message;
    authMessage.className = "auth-message " + type;
}


// ========================================
// CHECK CURRENT SESSION
// ========================================

async function checkCurrentSession() {
    try {
        const response = await fetch(`${API_BASE_URL}/me`, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            showHomepage();
            return;
        }

        const user = await response.json();

        showDashboard(user);

        console.log("MEMORA session restored successfully.");
    } catch (error) {
        console.error("Could not restore session:", error);

        // Keep the public homepage available if the backend
        // cannot be reached during initial page loading.
        showHomepage();
    }
}


// ========================================
// LOGIN AND SIGNUP
// ========================================

authForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    showAuthMessage("", "");

    const submittedMode = authMode;

    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;

    const requestBody = {
        email: email,
        password: password
    };

    if (submittedMode === "signup") {
        const name = nameInput.value.trim();

        if (!name) {
            showAuthMessage("Please enter your name.", "error");
            return;
        }

        if (password.length < 8) {
            showAuthMessage(
                "Password must contain at least 8 characters.",
                "error"
            );
            return;
        }

        requestBody.name = name;
    }

    authSubmitButton.disabled = true;
    authSubmitButton.textContent = "Please wait...";

    try {
        const endpoint = submittedMode === "signup"
            ? `${API_BASE_URL}/signup`
            : `${API_BASE_URL}/login`;

        const response = await fetch(endpoint, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody)
        });

        const responseText = await response.text();

        if (!response.ok) {
            let errorMessage = responseText;

            try {
                const errorData = JSON.parse(responseText);
                errorMessage = errorData.message || responseText;
            } catch (error) {
                // The backend may return a plain-text error.
            }

            throw new Error(
                errorMessage || "Something went wrong. Please try again."
            );
        }

        // Signup successful.
        if (submittedMode === "signup") {
            showAuthMessage(
                "Account created successfully! You can now log in.",
                "success"
            );

            authMode = "login";
            updateAuthForm();

            passwordInput.value = "";
            return;
        }

        // Login successful: retrieve the authenticated user's details.
        const sessionResponse = await fetch(`${API_BASE_URL}/me`, {
            method: "GET",
            credentials: "include"
        });

        if (!sessionResponse.ok) {
            throw new Error(
                "Login succeeded, but the session could not be verified. Please try again."
            );
        }

        const user = await sessionResponse.json();

        showAuthMessage(
            "Login successful! Welcome to MEMORA.",
            "success"
        );

        // Give the success message a moment before opening the dashboard.
        setTimeout(function () {
            showDashboard(user);
        }, 500);

    } catch (error) {
        console.error("Authentication error:", error);

        if (error instanceof TypeError) {
            showAuthMessage(
                "Cannot connect to the server. Make sure the MEMORA backend is running.",
                "error"
            );
        } else {
            showAuthMessage(error.message, "error");
        }
    } finally {
        authSubmitButton.disabled = false;
        updateAuthForm();
    }
});


// ========================================
// LOGOUT
// ========================================

if (logoutButton) {
    logoutButton.addEventListener("click", async function () {
        logoutButton.disabled = true;
        logoutButton.textContent = "Logging out...";

        try {
            const response = await fetch(`${API_BASE_URL}/logout`, {
                method: "POST",
                credentials: "include"
            });

            if (!response.ok) {
                throw new Error("The server could not log you out.");
            }

            showHomepage();

            console.log("Logged out successfully.");

        } catch (error) {
            console.error("Logout error:", error);

            alert(
                "Could not complete logout. Please check your connection and try again."
            );
        } finally {
            logoutButton.disabled = false;
            logoutButton.textContent = "Log Out ↗";
        }
    });
}


// ========================================
// INITIALIZE MEMORA
// ========================================

// Restore the dashboard if the user already has a valid session.
checkCurrentSession();

// Explore My Memories: reliable smooth scrolling
document.addEventListener("click", function (event) {
    const button = event.target.closest(".explore-btn");

    if (!button) {
        return;
    }

    const targetId = button.getAttribute("href");

    if (!targetId || !targetId.startsWith("#")) {
        return;
    }

    const target = document.querySelector(targetId);

    if (target) {
        event.preventDefault();

        target.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
});

// ========================================
// MEMORA - MY TRIPS
// ========================================

const TRIPS_API_URL = "http://127.0.0.1:8081/api/trips";

const myTripsSection = document.getElementById("my-trips-section");
const createTripButton = document.getElementById("create-trip-btn");
const createTripForm = document.getElementById("create-trip-form");
const cancelTripButton = document.getElementById("cancel-trip-btn");
const savedTripsGrid = document.getElementById("saved-trips-grid");

const tripTitleInput = document.getElementById("trip-title");
const tripDestinationInput = document.getElementById("trip-destination");
const tripDescriptionInput = document.getElementById("trip-description");

const tripMessage = document.getElementById("trip-message");
const saveTripButton = document.getElementById("save-trip-btn");


// Open My Trips section
document.querySelectorAll('[data-collection="trips"]').forEach(function (button) {
    button.addEventListener("click", function () {

        myTripsSection.hidden = false;

        myTripsSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

        loadMyTrips();
    });
});


// Open Create Trip form
createTripButton.addEventListener("click", function () {

    createTripForm.hidden = false;
    tripMessage.textContent = "";

    tripTitleInput.focus();
});


// Cancel Create Trip form
cancelTripButton.addEventListener("click", function () {

    createTripForm.reset();
    createTripForm.hidden = true;
    tripMessage.textContent = "";
});


// Load trips from database


async function loadMyTrips() {

    try {
        const response = await fetch(TRIPS_API_URL, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Could not load your trips.");
        }

        const trips = await response.json();
        savedTripsGrid.innerHTML = "";

        if (trips.length === 0) {
            savedTripsGrid.textContent =
                "No trips yet. Create your first trip!";
            return;
        }

        trips.forEach(function (trip) {

            const tripCard = document.createElement("article");
            tripCard.className = "saved-trip-card";
            tripCard.dataset.tripId = trip.id;

            const title = document.createElement("h3");
            title.textContent = trip.title;

            const destination = document.createElement("p");
            destination.textContent = "📍 " + trip.destination;

            const description = document.createElement("p");
            description.textContent =
                trip.description || "A memory waiting to be explored.";

            // Edit Button
            const editButton = document.createElement("button");
            editButton.type = "button";
            editButton.textContent = "✎ Edit";
            editButton.className = "trip-edit-btn";
            editButton.addEventListener("click", function () {
                editTrip(trip);
            });

            // Delete Trip Button
            const deleteButton = document.createElement("button");
            deleteButton.type = "button";
            deleteButton.textContent = "Delete Trip";
            deleteButton.className = "trip-delete-btn";
            deleteButton.addEventListener("click", function () {
                deleteTrip(trip.id);
            });

            // Add Photos Button
            const addPhotoButton = document.createElement("button");
            addPhotoButton.type = "button";
            addPhotoButton.textContent = "+ Add Photos";
            addPhotoButton.className = "trip-photo-btn";

            // Hidden File Input
            const fileInput = document.createElement("input");
            fileInput.type = "file";
            fileInput.accept = "image/*";
            fileInput.multiple = true;
            fileInput.hidden = true;

            addPhotoButton.addEventListener("click", function () {
                fileInput.click();
            });

            fileInput.addEventListener("change", async function () {
                if (fileInput.files.length > 0) {
                    await uploadTripPhotos(trip.id, fileInput.files);
                    fileInput.value = "";
                }
            });

            // View Photos Button
            const viewPhotoButton = document.createElement("button");
            viewPhotoButton.type = "button";
            viewPhotoButton.textContent = "View Photos";
            viewPhotoButton.className = "trip-view-btn";

            const gallery = document.createElement("div");
            gallery.className = "trip-photo-gallery";
            gallery.hidden = true;

            viewPhotoButton.addEventListener("click", async function () {
                gallery.hidden = !gallery.hidden;

                if (!gallery.hidden) {
                    await showTripPhotos(trip.id, gallery);
                }
            });

            // Button Container
            const actions = document.createElement("div");
            actions.className = "trip-card-actions";

            actions.appendChild(editButton);
            actions.appendChild(deleteButton);
            actions.appendChild(addPhotoButton);
            actions.appendChild(viewPhotoButton);

            tripCard.appendChild(title);
            tripCard.appendChild(destination);
            tripCard.appendChild(description);
            tripCard.appendChild(actions);
            tripCard.appendChild(fileInput);
            tripCard.appendChild(gallery);

            savedTripsGrid.appendChild(tripCard);

        });

    } catch (error) {
        console.error("Trips loading error:", error);
        savedTripsGrid.textContent =
            "Unable to load trips. Please try again.";
    }
}




// Save a new trip
createTripForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const tripData = {
        title: tripTitleInput.value.trim(),
        destination: tripDestinationInput.value.trim(),
        description: tripDescriptionInput.value.trim()
    };

    if (!tripData.title || !tripData.destination) {
        tripMessage.textContent = "Please enter the trip title and destination.";
        return;
    }

    saveTripButton.disabled = true;
    saveTripButton.textContent = "Saving...";

    try {

        const response = await fetch(TRIPS_API_URL, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(tripData)
        });

        const responseText = await response.text();

        if (!response.ok) {
            throw new Error(responseText || "Could not save trip.");
        }

        tripMessage.textContent = "Your trip has been saved successfully! ♡";
        tripMessage.style.color = "green";

        createTripForm.reset();
        createTripForm.hidden = true;

        await loadMyTrips();

    } catch (error) {

        console.error("Trip saving error:", error);

        tripMessage.textContent = error.message;
        tripMessage.style.color = "red";

    } finally {

        saveTripButton.disabled = false;
        saveTripButton.textContent = "Save Trip";

    }

});


// ========================================
// EDIT TRIP
// ========================================


async function editTrip(trip) {

    const tripCard = [...savedTripsGrid.children].find(function (card) {
        return card.dataset.tripId === String(trip.id);
    });

    if (!tripCard) return;

    tripCard.innerHTML = "";

    const form = document.createElement("form");
    form.className = "inline-edit-form";

    form.innerHTML = `
        <h3>Edit Your Trip</h3>

        <label>Trip Title</label>
        <input type="text" id="edit-title" required>

        <label>Destination</label>
        <input type="text" id="edit-destination" required>

        <label>Description</label>
        <textarea id="edit-description" rows="4"></textarea>

        <div class="trip-card-actions">
            <button type="submit" class="trip-edit-btn">
                Save Changes
            </button>

            <button type="button" class="trip-cancel-btn">
                Cancel
            </button>
        </div>
    `;

    tripCard.appendChild(form);

    form.querySelector("#edit-title").value = trip.title;
    form.querySelector("#edit-destination").value = trip.destination;
    form.querySelector("#edit-description").value =
        trip.description || "";

    form.querySelector("#edit-title").focus();

    form.addEventListener("submit", async function (event) {

        event.preventDefault();

        const updatedTrip = {
            title: form.querySelector("#edit-title").value.trim(),
            destination: form.querySelector("#edit-destination").value.trim(),
            description: form.querySelector("#edit-description").value.trim()
        };

        if (!updatedTrip.title || !updatedTrip.destination) {
            alert("Title and destination are required.");
            return;
        }

        const saveButton = form.querySelector('[type="submit"]');
        saveButton.disabled = true;
        saveButton.textContent = "Saving...";

        try {

            const response = await fetch(
                `${TRIPS_API_URL}/${trip.id}`,
                {
                    method: "PUT",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(updatedTrip)
                }
            );

            const result = await response.text();

            if (!response.ok) {
                throw new Error(result);
            }

            await loadMyTrips();

        } catch (error) {

            console.error("Edit error:", error);
            alert("Could not update trip: " + error.message);

            saveButton.disabled = false;
            saveButton.textContent = "Save Changes";
        }
    });

    form.querySelector(".trip-cancel-btn").addEventListener(
        "click",
        function () {
            loadMyTrips();
        }
    );
}



// ========================================
// DELETE TRIP
// ========================================

async function deleteTrip(tripId) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this trip?"
    );

    if (!confirmDelete) return;

    try {

        const response = await fetch(
            `${TRIPS_API_URL}/${tripId}`,
            {
                method: "DELETE",
                credentials: "include"
            }
        );

        const result = await response.text();

        if (!response.ok) {
            throw new Error(result);
        }

        alert("Trip deleted successfully.");

        await loadMyTrips();

    } catch (error) {

        console.error("Delete trip error:", error);
        alert("Could not delete trip: " + error.message);

    }
}



// ========================================
// MEMORA - TRIP PHOTO GALLERY
// ========================================

const PHOTOS_API_URL = "http://127.0.0.1:8081/api/photos";


// UPLOAD PHOTOS
async function uploadTripPhotos(tripId, files) {

    const formData = new FormData();

    for (const file of files) {
        formData.append("files", file);
    }

    try {

        const response = await fetch(
            `${PHOTOS_API_URL}/upload/${tripId}`,
            {
                method: "POST",
                credentials: "include",
                body: formData
            }
        );

        const result = await response.text();

        if (!response.ok) {
            throw new Error(result);
        }

        alert("Photos uploaded successfully! ♡");

    } catch (error) {

        console.error("Photo upload error:", error);
        alert("Photo upload failed: " + error.message);

    }
}


// DISPLAY PHOTOS
async function showTripPhotos(tripId, gallery) {

    gallery.innerHTML = "Loading photos...";

    try {

        const response = await fetch(
            `${PHOTOS_API_URL}/${tripId}`,
            {
                method: "GET",
                credentials: "include"
            }
        );

        if (!response.ok) {
            throw new Error("Could not load photos.");
        }

        const photos = await response.json();

        gallery.innerHTML = "";

        if (photos.length === 0) {
            gallery.textContent =
                "No photos yet. Add your first memory! ♡";
            return;
        }

        photos.forEach(function (photo) {

            const photoCard = document.createElement("div");
            photoCard.className = "trip-photo-item";

            const image = document.createElement("img");

            image.src =
                `${PHOTOS_API_URL}/view/${photo.id}`;

            image.alt = photo.fileName;
            image.loading = "lazy";

            const deleteButton = document.createElement("button");
            deleteButton.type = "button";
            deleteButton.textContent = "Delete Photo";
            deleteButton.className = "trip-delete-photo-btn";

            deleteButton.addEventListener("click", async function () {

                if (!confirm("Delete this photo?")) {
                    return;
                }

                try {

                    const deleteResponse = await fetch(
                        `${PHOTOS_API_URL}/${photo.id}`,
                        {
                            method: "DELETE",
                            credentials: "include"
                        }
                    );

                    if (!deleteResponse.ok) {
                        throw new Error("Could not delete photo.");
                    }

                    await showTripPhotos(tripId, gallery);

                } catch (error) {

                    alert(error.message);

                }
            });

            photoCard.appendChild(image);
            photoCard.appendChild(deleteButton);

            gallery.appendChild(photoCard);

        });

    } catch (error) {

        console.error("Gallery error:", error);
        gallery.textContent = "Unable to load photos.";

    }
}
