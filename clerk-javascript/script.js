// Import Firebase and Firestore
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { Clerk } from '@clerk/clerk-js';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAHwklOtuFqwalaTuDyguWCvmz_8RvvtlQ",
  authDomain: "todoodle-37016.firebaseapp.com",
  projectId: "todoodle-37016",
  storageBucket: "todoodle-37016.firebasestorage.app",
  messagingSenderId: "61172894346",
  appId: "1:61172894346:web:fdf5fe0449ccab90f33b73",
  measurementId: "G-6752CXNQLE"
};

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Initialize Clerk
const clerk = new Clerk(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);
await clerk.load();

// Redirect to login if no user is signed in
if (!clerk.user) {
    window.location.href = "index.html";
}

// DOM references
const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const addButton = document.querySelector("button");

// Add a task to the list
function addTask() {
    if (inputBox.value === '') {
        alert("You must write something!");
    } else {
        let li = document.createElement("li");
        li.innerHTML = inputBox.value;
        listContainer.appendChild(li);
        let span = document.createElement("span");
        span.innerHTML = "\u00d7"; // Close button
        li.appendChild(span);
    }
    inputBox.value = "";
    saveData();
}

// Handle task interactions
listContainer.addEventListener("click", function (e) {
    if (e.target.tagName === "LI") {
        e.target.classList.toggle("checked"); // Mark task as done
        saveData();
    } else if (e.target.tagName === "SPAN") {
        e.target.parentElement.remove(); // Remove task
        saveData();
    }
}, false);

// Save tasks to Firestore
async function saveData() {
    if (!clerk.user) {
        alert("No user is logged in!");
        return;
    }
    const userId = clerk.user.id; // Get Clerk user ID
    const userTasks = {
        tasks: listContainer.innerHTML,
    };
    try {
        await setDoc(doc(db, "tasks", userId), userTasks); // Save tasks to Firestore
    } catch (error) {
        console.error("Error saving tasks:", error);
    }
}

// Load tasks from Firestore
async function showTask() {
    if (!clerk.user) {
        alert("No user is logged in!");
        return;
    }
    const userId = clerk.user.id; // Get Clerk user ID
    try {
        const docSnap = await getDoc(doc(db, "tasks", userId));
        if (docSnap.exists()) {
            const userData = docSnap.data();
            listContainer.innerHTML = userData.tasks || ""; // Load tasks
        }
    } catch (error) {
        console.error("Error loading tasks:", error);
    }
}

// Logout function
async function logout() {
    try {
        await clerk.signOut(); // Clerk logout
        alert("You have been logged out.");
        window.location.href = "index.html"; // Redirect to login page
    } catch (error) {
        console.error("Logout failed:", error);
    }
}


// Attach event listeners
addButton.addEventListener("click", addTask);
document.getElementById("logout-button").addEventListener("click", logout);

// Show tasks on page load
await showTask();