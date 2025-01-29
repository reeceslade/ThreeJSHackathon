import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { scene } from './main.js'; // Adjust the path as needed

export const spaceships = [];  // Array to hold references to the spaceship models
export const numberOfSpaceships = 100;  // Adjust this number as needed


export function createPlane(yPosition, offset = 0) {
    const planeGeometry = new THREE.PlaneGeometry(200, 200); // Adjust the size of the plane
    const planeMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ff00, // Use a green color for the box planes for visibility
        side: THREE.DoubleSide, // Make the plane visible from both sides
        wireframe: true,
        transparent: true, // Set transparency
        opacity: 0.3 // Adjust the transparency level
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2; // Rotate the plane to be horizontal
    plane.position.y = yPosition + offset; // Position the plane with the offset applied
    scene.add(plane);
}

export function loadSpaceships(loader, scene) {
    for (let i = 0; i < numberOfSpaceships; i++) {
        loader.load(
            '/spaceship_lowpoly.glb', // Adjust this path to your spaceship model
            function (gltf) {
                const model = gltf.scene;
                model.scale.set(0.25, 0.25, 0.25); // Scale the model
                model.position.set(
                    Math.random() * 150 - 50, // Random x position within the plane's bounds
                    12.5, // y position (on the ground)
                    Math.random() * 150 - 50  // Random z position within the plane's bounds
                );
                scene.add(model);

                spaceships.push(model);  // Store the model in the spaceships array

                // Calculate the bounding box and height of the spaceship
                const boundingBox = new THREE.Box3().setFromObject(model);
                const shipHeight = boundingBox.max.y - boundingBox.min.y;
                console.log('Spaceship height:', shipHeight); // Log the height of the spaceship

                // Create transparent boxes around the spaceship at both heights
                createPlane(boundingBox.min.y, -5); // Move it further down
                createPlane(boundingBox.max.y, 5);  // Move it further up

                // Randomly position the spaceship within the bounding box
                const randomX = Math.random() * (boundingBox.max.x - boundingBox.min.x) + boundingBox.min.x;
                const randomZ = Math.random() * (boundingBox.max.z - boundingBox.min.z) + boundingBox.min.z;
                const randomY = Math.random() * (boundingBox.max.y - boundingBox.min.y) + boundingBox.min.y;

                // Position the spaceship inside the box
                model.position.set(randomX, randomY, randomZ);

                // Animate the spaceship (flying effect)
                animateSpaceship(model, boundingBox, scene);
            },
            undefined,
            function (error) {
                console.error(error);
            }
        );
    }
}

export function animateSpaceship(model, boundingBox, scene) {
    // Random speed for movement
    const speed = Math.random() * 0.2 + 0.1; // Random speed between 0.1 and 0.3

    // Random direction of movement for the spaceship
    const direction = new THREE.Vector3(
        Math.random() * 2 - 1, // Random x direction
        Math.random() * 2 - 1, // Random y direction (this can be toned down if you want less vertical movement)
        Math.random() * 2 - 1  // Random z direction
    ).normalize();

    function move() {
        // Move the spaceship in the random direction
        model.position.add(direction.clone().multiplyScalar(speed));

        // Ensure the spaceship stays within the bounding box, but prioritize lateral movement
        if (model.position.x > boundingBox.max.x || model.position.x < boundingBox.min.x) {
            // Reverse the lateral direction with a bit more movement in x
            direction.x = Math.random() * 0.5 + 0.5 * (direction.x > 0 ? 1 : -1); 
        }
        if (model.position.y > boundingBox.max.y || model.position.y < boundingBox.min.y) {
            // Keep vertical movement minimal to avoid bouncing too much up and down
            direction.y = Math.random() * 0.1 * (direction.y > 0 ? -1 : 1); // Slower bounce in y
        }
        if (model.position.z > boundingBox.max.z || model.position.z < boundingBox.min.z) {
            // Reverse the lateral direction with a bit more movement in z
            direction.z = Math.random() * 0.5 + 0.5 * (direction.z > 0 ? 1 : -1);
        }

        // Call the next frame
        requestAnimationFrame(move);
    }

    // Start the animation loop
    move();
}
