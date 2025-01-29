import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
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

// Add a road outline
const roadGeometry = new THREE.PlaneGeometry(1, 100); // Road dimensions
const roadMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide });
const road = new THREE.Mesh(roadGeometry, roadMaterial);
road.position.y = 0.01; // Slightly above the floor to avoid z-fighting
road.rotation.x = -Math.PI / 2; // Same orientation as the floor
scene.add(road);

function createGridRoads(scene, roadCount, roadSpacing) {
    const roadWidth = 1;
    const roadLength = 100;
    
    const roadMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide });

    for (let i = 0; i < roadCount; i++) {
        // Front-to-back roads
        const roadGeometry1 = new THREE.PlaneGeometry(roadWidth, roadLength);
        const road1 = new THREE.Mesh(roadGeometry1, roadMaterial);
        road1.position.set(i * roadSpacing - (roadSpacing * (roadCount - 1)) / 2, 0.01, 0);
        road1.rotation.x = -Math.PI / 2;
        scene.add(road1);

        // Left-to-right roads
        const roadGeometry2 = new THREE.PlaneGeometry(roadLength, roadWidth);
        const road2 = new THREE.Mesh(roadGeometry2, roadMaterial);
        road2.position.set(0, 0.01, i * roadSpacing - (roadSpacing * (roadCount - 1)) / 2);
        road2.rotation.x = -Math.PI / 2;
        scene.add(road2);
    }
}

// Example usage
createGridRoads(scene, 15, 20); // Creates 5 roads in each direction, spaced 20 units apart



const textureLoader = new THREE.TextureLoader();

// Load the textures
const roadColor = textureLoader.load('/Road007_2K-JPG_Color.jpg'); // Base color
const roadDisplacement = textureLoader.load('/Road007_2K-JPG_Displacement.jpg'); // Displacement map
const roadNormal = textureLoader.load('/Road007_2K-JPG_NormalGL.jpg'); // Normal map
const roadRoughness = textureLoader.load('/Road007_2K-JPG_Roughness.jpg'); // Roughness map




// Add a cube for testing
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.set(0, 0.5, 0); // Place the cube slightly above the floor
scene.add(cube);

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

    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
