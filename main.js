import './style.css';
import javascriptLogo from './javascript.svg';
import viteLogo from '/vite.svg';
import { setupCounter } from './counter.js';
import { Clerk } from '@clerk/clerk-js';

// Retrieve Clerk Publishable Key from environment variables
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Initialize Clerk
const clerk = new Clerk(clerkPubKey);

try {
  await clerk.load(); // Load Clerk SDK
  console.log('Clerk loaded successfully.');
} catch (error) {
  console.error('Failed to load Clerk:', error);
}

// Redirect logic based on user authentication state
if (clerk.user) {
  // If user is logged in, redirect to home.html
  window.location.href = '/home.html';
} else {
  // If user is not logged in, render sign-in form
  const appDiv = document.getElementById('app');
  appDiv.innerHTML = `<div id="sign-in"></div>`;
  const signInDiv = document.getElementById('sign-in');

  // Mount Sign-In Form
  clerk.mountSignIn(signInDiv);

  // Optional: Handle user sign-in event
  clerk.on('user:authenticated', () => {
    window.location.href = '/home.html'; // Redirect after sign-in
  });
}

// Setup counter button functionality
setupCounter(document.querySelector('#counter'));


