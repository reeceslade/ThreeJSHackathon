import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import {generateRoad } from '/js/generateRoad.js';
import { loadSpaceships } from '/js/ships.js';
import { animate } from '/js/animate.js';

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
console.log("floor", floor.position)
scene.add(floor);

// Create walls
const wallHeight = 5; // Height of the walls
const wallThickness = 1; // Thickness of the walls

// Wall on the left
const leftWallGeometry = new THREE.BoxGeometry(wallThickness, wallHeight, 100);
const leftWallMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // Green color
const leftWall = new THREE.Mesh(leftWallGeometry, leftWallMaterial);
leftWall.position.set(-50, wallHeight / 2, 0); // Position left wall
scene.add(leftWall);

// Wall on the right
const rightWallGeometry = new THREE.BoxGeometry(wallThickness, wallHeight, 100);
const rightWallMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // Green color
const rightWall = new THREE.Mesh(rightWallGeometry, rightWallMaterial);
rightWall.position.set(50, wallHeight / 2, 0); // Position right wall
scene.add(rightWall);

// Wall at the front
const frontWallGeometry = new THREE.BoxGeometry(100, wallHeight, wallThickness);
const frontWallMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // Green color
const frontWall = new THREE.Mesh(frontWallGeometry, frontWallMaterial);
frontWall.position.set(0, wallHeight / 2, -50); // Position front wall
scene.add(frontWall);

// Wall at the back
const backWallGeometry = new THREE.BoxGeometry(100, wallHeight, wallThickness);
const backWallMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // Green color
const backWall = new THREE.Mesh(backWallGeometry, backWallMaterial);
backWall.position.set(0, wallHeight / 2, 50); // Position back wall
scene.add(backWall);

// PointerLockControls for first-person movement
const controls = new PointerLockControls(camera, renderer.domElement);
scene.add(controls.getObject());

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

// Night-time Sky
scene.background = new THREE.Color(0x000000); // Dark background for night

// Modify the ambient light to simulate night-time
ambientLight.intensity = 0.2; // Lower ambient light intensity for night-time feel

// Simulate moonlight with a directional light (optional)
const moonLight = new THREE.DirectionalLight(0x8888ff, 1.0); // Soft blue moonlight
moonLight.position.set(-5, 5, -5); // Adjust position to simulate moon
scene.add(moonLight);

// Add stars to simulate a starry night
const starGeometry = new THREE.SphereGeometry(0.5, 5, 5); // Increase size slightly for better visibility
const starMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, emissive: 0xffffff }); // Make stars emissive for better glow effect

for (let i = 0; i < 1000; i++) {
    const star = new THREE.Mesh(starGeometry, starMaterial);
    star.position.set(
        Math.random() * 1000 - 500, // Random x position
        Math.random() * 500, // Random y position
        Math.random() * 1000 - 500  // Random z position
    );
    scene.add(star);
}

const geometry = new THREE.BoxGeometry(8, 5, 1); 
const material = new THREE.MeshBasicMaterial({ color: 0xffffff }); 
const cube = new THREE.Mesh(geometry, material); 

cube.position.y = 5;
scene.add(cube);

const newGeometry = new THREE.CylinderGeometry(0.1, 0.1, 5, 32);  
const newMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });  
const newCylinder = new THREE.Mesh(newGeometry, newMaterial);

console.log(newCylinder.position);

// Positioning it near the first cube
newCylinder.position.set(0, 1, 0);  

scene.add(newCylinder);





// Create a function to create text textures
function createTextTexture(text) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size and font properties
    const fontSize = 20;
    canvas.width = 400;
    canvas.height = 200;
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.fillStyle = 'blue';
    ctx.fillText(text, 10, 40); // Add text to the canvas
    
    // Create a texture from the canvas
    const texture = new THREE.CanvasTexture(canvas);
    return { texture, width: canvas.width, height: canvas.height };
}

// Create text for the cube
const text = "In Front of Cube";

// Create the texture for the text
const { texture, width, height } = createTextTexture(text);

// Create a plane geometry for the text
const planeGeometry = new THREE.PlaneGeometry(width / 50, height / 50); // Adjust size based on text dimensions
const planeMaterial = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });

// Create the plane and position it in front of the cube
const textPlane = new THREE.Mesh(planeGeometry, planeMaterial);

// Position the text in front of the cube and center it
textPlane.position.set(0, 5, 0.55); // Adjust position as needed

// Add the text plane to the scene
scene.add(textPlane);





// Load 3D Model
const loader = new GLTFLoader();
loadSpaceships(loader, scene);
generateRoad(scene, 150, 20); // Creates roads in each direction, spaced 20 units apart
animate();
