import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { TGALoader } from 'three/addons/loaders/TGALoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {generateRoad } from '/generateRoad.js';
import { loadSpaceships, spaceships } from '/ships.js';
export { camera, renderer, controls, animate, scene, loader };

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


// animation.js (or whatever the file is named)
import { movement } from './movement.js'; // Adjust the path as needed

// Animation loop
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

function animate() {
    requestAnimationFrame(animate);

    // Movement logic
    const delta = 0.1; // Adjust movement speed

    if (controls.isLocked) {
        if (movement.moveForward) velocity.z -= delta;
        if (movement.moveBackward) velocity.z += delta;
        if (movement.moveLeft) velocity.x -= delta;
        if (movement.moveRight) velocity.x += delta;

        // Handle up and down movement
        if (movement.moveUp) camera.position.y += delta; // Move up
        if (movement.moveDown) camera.position.y -= delta; // Move down

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

loadSpaceships(loader, scene);
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