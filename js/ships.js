import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { scene } from '/js/main.js'; // Adjust the path as needed

export const spaceships = [];  // Array to hold references to the spaceship models
export const numberOfSpaceships = 100;  // Adjust this number as needed

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
export function animateSpaceship(model) {
    // Random speed for movement
    const speed = Math.random() * 0.2 + 0.1; // Random speed between 0.1 and 0.3

    // Random direction of movement for the spaceship
    const direction = new THREE.Vector3(
        Math.random() * 2 - 1, // Random x direction
        0, // No vertical movement (y direction)
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

        // Check if the spaceship is outside the plane boundaries and reverse direction if necessary
        if (model.position.x > planeMaxX || model.position.x < planeMinX) {
            direction.x *= -1; // Reverse the x direction
        }
        if (model.position.z > planeMaxZ || model.position.z < planeMinZ) {
            direction.z *= -1; // Reverse the z direction
        }

        // Call the next frame
        requestAnimationFrame(move);
    }

    // Start the animation loop
    move();
}