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

                // Calculate the bounding box before setting the position
                const boundingBox = new THREE.Box3().setFromObject(model);
                const shipWidth = boundingBox.max.x - boundingBox.min.x;
                const shipHeight = boundingBox.max.y - boundingBox.min.y;
                const shipDepth = boundingBox.max.z - boundingBox.min.z;

                // Position the model randomly but within bounds, considering its size
                const randomX = Math.random() * (100 - shipWidth) - 50; // Random x within bounds, accounting for width
                const randomY = 12.5; // y position (on the ground)
                const randomZ = Math.random() * (100 - shipDepth) - 50; // Random z within bounds, accounting for depth

                model.position.set(randomX, randomY, randomZ);
                scene.add(model);

                spaceships.push(model);  // Store the model in the spaceships array

                console.log('Spaceship dimensions:', shipWidth, shipHeight, shipDepth); // Log dimensions

                // Create transparent boxes around the spaceship at both heights
                createPlane(boundingBox.min.y, -5); // Move it further down
                createPlane(boundingBox.max.y, 5);  // Move it further up

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

export function animateSpaceship(model, boundingBox) {
    // Random speed for movement
    const speed = Math.random() * 0.2 + 0.1; // Random speed between 0.1 and 0.3

    // Random direction of movement for the spaceship
    const direction = new THREE.Vector3(
        Math.random() * 2 - 1, // Random x direction
        (Math.random() * 0.2 - 0.1), // Slight vertical movement (y direction)
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