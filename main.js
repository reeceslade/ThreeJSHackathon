import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { TGALoader } from 'three/addons/loaders/TGALoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {generateRoad } from '/generateRoad.js';
export { camera, renderer, controls, animate};

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff); // White background

// Camera setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0.5, 5); // Start position for the camera

// Renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add a floor for reference
const floorGeometry = new THREE.PlaneGeometry(100, 100);
const floorMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc, side: THREE.DoubleSide });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2; // Rotate the floor to be horizontal
scene.add(floor);

// PointerLockControls for first-person movement
const controls = new PointerLockControls(camera, renderer.domElement);
scene.add(controls.getObject());

// Generate road
generateRoad(scene, 150, 20); // Creates roads in each direction, spaced 20 units apart

// Movement variables
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let moveUp = false; // New variable for moving up
let moveDown = false; // New variable for moving down

// Event listeners for keyboard input
document.addEventListener('keydown', (event) => {
    switch (event.code) {
        case 'KeyW': moveForward = true; break;
        case 'KeyS': moveBackward = true; break;
        case 'KeyA': moveLeft = true; break;
        case 'KeyD': moveRight = true; break;
        case 'Space': moveUp = true; break; // Move up with Space key
        case 'ShiftLeft': moveDown = true; break; // Move down with Left Shift key
    }
});

document.addEventListener('keyup', (event) => {
    switch (event.code) {
        case 'KeyW': moveForward = false; break;
        case 'KeyS': moveBackward = false; break;
        case 'KeyA': moveLeft = false; break;
        case 'KeyD': moveRight = false; break;
        case 'Space': moveUp = false; break; // Stop moving up when Space is released
        case 'ShiftLeft': moveDown = false; break; // Stop moving down when Left Shift is released
    }
});


const spaceships = [];  // Array to hold references to the spaceship models
const numberOfSpaceships = 100;  // Adjust this number as needed
function createPlane(yPosition, offset = 0) {
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

function loadSpaceships() {
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

                // Lower box
                createPlane(boundingBox.min.y, -5); // Move it further down

                // Upper box
                createPlane(boundingBox.max.y, 5);  // Move it further up
            },
            undefined,
            function (error) {
                console.error(error);
            }
        );
    }
}

// Animation loop
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

function animate() {
    requestAnimationFrame(animate);

    // Movement logic
    const delta = 0.1; // Adjust movement speed

    if (controls.isLocked) {
        if (moveForward) velocity.z -= delta;
        if (moveBackward) velocity.z += delta;
        if (moveLeft) velocity.x -= delta;
        if (moveRight) velocity.x += delta;

        // Handle up and down movement
        if (moveUp) camera.position.y += delta; // Move up
        if (moveDown) camera.position.y -= delta; // Move down

        controls.moveRight(velocity.x);
        controls.moveForward(-velocity.z);

        // Apply damping (optional)
        velocity.x *= 0.9;
        velocity.z *= 0.9;
    }

    // Rotate each spaceship in the array
    spaceships.forEach(spaceship => {
        spaceship.rotation.y += 0.01;  // Rotate around the y-axis (you can adjust the speed)
    });

    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambientLight);

const light = new THREE.DirectionalLight(0xffffff, 2.5);
light.position.set(1, 1, 1);
scene.add(light);

// Load 3D Model
const loader = new GLTFLoader();

const numberOfAliens = 100; // Adjust this number as needed
loadSpaceships();

animate();


/*
const numberOfAliens = 10; // Adjust this number as needed

function loadAliens() {
    for (let i = 0; i < numberOfAliens; i++) {
        loader.load(
            '/alien_creature.glb', // Adjust this path to your model
            function (gltf) {
                const model = gltf.scene;
                model.scale.set(2, 2, 2); // Scale the model
                model.position.set(
                    Math.random() * 100 - 50, // Random x position within the plane's bounds
                    0, // y position (on the ground)
                    Math.random() * 100 - 50  // Random z position within the plane's bounds
                );
                scene.add(model);
            },
            undefined,
            function (error) {
                console.error(error);
            }
        );
    }
}
*/
// Call to load aliens
//loadAliens();