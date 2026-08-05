import { db } from './firebase-config.js';
import { doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

async function updateLogo() {
  const entityRef = doc(db, "entities", "aadmi-productions");
  try {
    await updateDoc(entityRef, {
      "logo.white": "assets/logo/aadmi-logo.svg",
      "photo": "assets/logo/aadmi-logo.svg"
    });
    console.log("Successfully updated AADMI logo in Firestore");
  } catch (err) {
    console.error("Error updating Firestore:", err);
  }
}

updateLogo();
