import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { scene, textPlanes, createTextTexture } from '/js/main.js'; // Adjust the path as needed

export const spaceships = [];  // Array to hold references to the spaceship models
export const numberOfSpaceships = 100;  // Adjust this number as needed
export const collidingPairs = new Set(); // Tracks pairs of colliding spaceships

export const loader = new GLTFLoader();  // Now properly instantiated after the import

export function createPlane(yPosition, offset = 0) {
    const planeGeometry = new THREE.PlaneGeometry(100, 100); // Match the size of the walls (100x100)
    const planeMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ff00, // Green color for visibility
        side: THREE.DoubleSide, // Make the plane visible from both sides
        wireframe: true,
        transparent: true, // Transparency
        opacity: 0.3 // Adjust transparency level
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2; // Rotate the plane to be horizontal
    plane.position.y = yPosition + offset; // Position the plane with the offset applied
    scene.add(plane);
}

export function loadSpaceships(loader, scene) {
    for (let i = 0; i < numberOfSpaceships; i++) {
        loader.load(
            '/3DModels/spaceship_lowpoly.glb', // Adjust this path to your spaceship model
            function (gltf) {
                const model = gltf.scene;
                model.scale.set(0.25, 0.25, 0.25); // Scale the model
        
                // Calculate the bounding box
                const boundingBox = new THREE.Box3().setFromObject(model);
        
                // Create a wireframe box around the spaceship
                const boxGeometry = new THREE.BoxGeometry(
                    boundingBox.max.x - boundingBox.min.x, // Width
                    boundingBox.max.y - boundingBox.min.y, // Height
                    boundingBox.max.z - boundingBox.min.z  // Depth
                );
                const boxMaterial = new THREE.MeshBasicMaterial({
                    color: new THREE.Color(0x000000), // Set the base color (black in this case)
                    transparent: true, // Enable transparency
                    opacity: 0 // Set opacity to 0 for full transparency
                });
                const wireframeBox = new THREE.Mesh(boxGeometry, boxMaterial);
        
                // Position the wireframe box at the same position as the spaceship
                wireframeBox.position.copy(model.position);
        
                // Add the wireframe box to the scene
                scene.add(wireframeBox);
        
                // Position the model randomly but within bounds, considering its size
                const randomX = Math.random() * (100 - (boundingBox.max.x - boundingBox.min.x)) - 50;
                const randomY = 12.5; // y position (on the ground)
                const randomZ = Math.random() * (100 - (boundingBox.max.z - boundingBox.min.z)) - 50;
        
                model.position.set(randomX, randomY, randomZ);
                wireframeBox.position.set(randomX, randomY, randomZ); // Match the wireframe box position
        
                scene.add(model);
                spaceships.push({ model, boundingBox, wireframeBox });  // Store the model and its bounding box in the spaceships array
        
                // Animate the spaceship (flying effect)
                animateSpaceship(model, wireframeBox, boundingBox); // Pass the wireframeBox to the animate function
            },
            undefined,
            function (error) {
                console.error(error);
            }
        );
    }
}


export let collisionCount = 0;
export let totalCrashCount = 0; // Variable to track total crash counts
let hasInteracted = false;
export const collisionSound = new Audio('/Big_Explosion_Sound_Effect.mp3');  // Path to your MP3 file
export const backgroundMusic = new Audio('/Sci-Fi_Weapons_2_Sound_Effects_Futuristic_Cyber_Weapon_Sci-Fi_Sound_Effects.mp3');  // Path to your new MP3 file

collisionSound.volume = 0.5;
backgroundMusic.volume = 0.2;  // Set the background music volume (adjust as needed)
backgroundMusic.loop = true;  // Set background music to loop

// Play sounds when the user first interacts
document.addEventListener('click', () => {
    if (!hasInteracted) {
        hasInteracted = true;
        backgroundMusic.play();  // Start playing the background music on first interaction
    }
});

// Function to handle collision sound without overlap
function playCollisionSound() {
    if (collisionSound.paused || collisionSound.ended) {
        collisionSound.play();  // Play collision sound only if it's not currently playing
    }
}

export function checkCollisions() {
    for (let i = 0; i < spaceships.length; i++) {
        for (let j = i + 1; j < spaceships.length; j++) {
            const shipA = spaceships[i];
            const shipB = spaceships[j];

            // Update bounding boxes without affecting rendering
            shipA.boundingBox.setFromObject(shipA.model);
            shipB.boundingBox.setFromObject(shipB.model);

            if (shipA.boundingBox.intersectsBox(shipB.boundingBox)) {
                const pairKey = `${i}-${j}`;
                if (!collidingPairs.has(pairKey)) {
                    collidingPairs.add(pairKey);
                    collisionCount++; // Increment collision count when collision is detected

                    // Play sound when collision occurs, only if interaction has happened
                    if (hasInteracted) {
                        playCollisionSound();  // Play the collision sound
                    }
                }
            } else {
                collidingPairs.delete(`${i}-${j}`);
            }
        }
    }

    // Check if the collisionCount has reached 200 or more
    if (collisionCount >= 200) {
        totalCrashCount += Math.floor(collisionCount / 200); // Increment totalCrashCount for each 200 collisions
        console.log(`Crash count: ${totalCrashCount}`); // Log the total crash count
        collisionCount = collisionCount % 200; // Keep the remainder of collisionCount for the next cycle
    }

    // Update the text on all text planes
    textPlanes.forEach((textPlane) => {
        // Update the text texture with the pretext
        const text = `Total Spaceship Crashes: ${totalCrashCount}`; // Add pretext before the count
        const { texture, width, height } = createTextTexture(text);
        textPlane.material.map = texture; // Update the material texture with the new one
        textPlane.material.needsUpdate = true; // Flag the material for update
    });
}

setInterval(checkCollisions, 200);

export function animateSpaceship(model, wireframeBox, boundingBox) {
    // Random speed for movement
    const speed = Math.random() * 0.2 + 0.1; // Random speed between 0.1 and 0.3

    // Random direction of movement for the spaceship
    const direction = new THREE.Vector3(
        Math.random() * 2 - 1, // Random x direction
        (0), // Slight vertical movement (y direction)
        Math.random() * 2 - 1  // Random z direction
    ).normalize();

    // Define the boundaries of the plane (100x100 units)
    const planeSize = 100; // Assuming the plane is 100x100 units
    const planeMinX = -planeSize / 2;
    const planeMaxX = planeSize / 2;
    const planeMinZ = -planeSize / 2;
    const planeMaxZ = planeSize / 2;

    function move() {
        // Move the spaceship in the random direction
        model.position.add(direction.clone().multiplyScalar(speed));

        // Update the wireframe box position to match the spaceship
        wireframeBox.position.copy(model.position);

        // Check if the spaceship is outside the plane boundaries and reverse direction if necessary
        if (model.position.x > planeMaxX || model.position.x < planeMinX) {
            direction.x *= -1; // Reverse the x direction
        }
        if (model.position.z > planeMaxZ || model.position.z < planeMinZ) {
            direction.z *= -1; // Reverse the z direction
        }

        // Check if the spaceship is outside the bounding box's y-axis limits and reverse direction if necessary
        if (model.position.y > boundingBox.max.y || model.position.y < boundingBox.min.y) {
            direction.y *= -1; // Reverse the y direction
        }

        // Call the next frame
        requestAnimationFrame(move);
    }

    // Start the animation loop
    move();
}
