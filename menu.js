import { camera, renderer, controls, animate } from './main.js'; // Import from main.js

document.getElementById('startButton').addEventListener('click', () => {
    // Hide the start menu
    document.getElementById('startMenu').style.display = 'none';

    // Show the crosshair
    document.getElementById('crosshair').style.display = 'block';

    // Start the game (show Three.js scene)
    controls.lock(); // Lock the pointer

    animate(); // Start the animation loop
});