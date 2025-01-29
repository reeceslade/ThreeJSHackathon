import { scene, camera, renderer, controls } from '/js/main.js';
import { animate } from '/js/animate.js';

export let isPaused = false; // Declare the global pause state

// Define the togglePause function
function togglePause() {
    if (isPaused) {
        isPaused = false;
        document.getElementById("pauseMenu").style.display = "none";
        controls.lock(); // Lock cursor when resuming
        animate(); // Resume the animation loop
    } else {
        isPaused = true;
        document.getElementById("pauseMenu").style.display = "block";
        controls.unlock(); // Unlock cursor when paused
    }
}

// Attach the event listener to the Resume button
document.getElementById('resumeButton').addEventListener('click', togglePause);

// Other menu-related code
document.getElementById('startButton').addEventListener('click', () => {
    document.getElementById('startMenu').style.display = 'none';
    document.getElementById('crosshair').style.display = 'block';
    controls.lock(); // Lock the pointer
    animate(); // Start the animation loop
});

window.addEventListener('keydown', (event) => {
    if (event.key === 'x') {
        togglePause();
    }
});
