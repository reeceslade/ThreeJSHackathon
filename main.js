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


// Example usage
generateRoad(scene, 150, 20); // Creates roads in each direction, spaced 20 units apart


const textureLoader = new THREE.TextureLoader();

// PointerLockControls for first-person movement
const controls = new PointerLockControls(camera, renderer.domElement);
scene.add(controls.getObject());

// Movement variables
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;

// Event listeners for keyboard input
document.addEventListener('keydown', (event) => {
    switch (event.code) {
        case 'KeyW': moveForward = true; break;
        case 'KeyS': moveBackward = true; break;
        case 'KeyA': moveLeft = true; break;
        case 'KeyD': moveRight = true; break;
    }
});

document.addEventListener('keyup', (event) => {
    switch (event.code) {
        case 'KeyW': moveForward = false; break;
        case 'KeyS': moveBackward = false; break;
        case 'KeyA': moveLeft = false; break;
        case 'KeyD': moveRight = false; break;
    }
});

/* Create a simple building using BoxGeometry
const building = new THREE.Group(); // Group to hold all parts of the building

// Base of the building
const baseGeometry = new THREE.BoxGeometry(5, 5, 5);
const baseMaterial = new THREE.MeshBasicMaterial({ color: 0x808080 });
const base = new THREE.Mesh(baseGeometry, baseMaterial);
base.position.y = 2.5; // Move base up so it sits on the ground
building.add(base);

// Roof of the building
const roofGeometry = new THREE.BoxGeometry(6, 1, 6);
const roofMaterial = new THREE.MeshBasicMaterial({ color: 0x8B4513 });
const roof = new THREE.Mesh(roofGeometry, roofMaterial);
roof.position.y = 5.5; // Position roof on top of the base
building.add(roof);

// Add the building to the scene
scene.add(building);
*/ 

const spaceships = [];  // Array to hold references to the spaceship models

function loadSpaceships() {
    for (let i = 0; i < numberOfAliens; i++) {
        loader.load(
            '/spaceship_lowpoly.glb', // Adjust this path to your spaceship model
            function (gltf) {
                const model = gltf.scene;
                model.scale.set(2, 2, 2); // Scale the model
                model.position.set(
                    Math.random() * 100 - 50, // Random x position within the plane's bounds
                    0, // y position (on the ground)
                    Math.random() * 100 - 50  // Random z position within the plane's bounds
                );
                scene.add(model);
                
                spaceships.push(model);  // Store the model in the spaceships array
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
loadSpaceships();

animate();
