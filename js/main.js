import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
// import {generateRoad } from '/js/generateRoad.js';
import { loadSpaceships } from '/js/ships.js';
import { animate } from '/js/animate.js';
import { collisionCount } from '/js/ships.js'; // Adjust the path to your file
import { totalCrashCount } from '/js/ships.js';


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

// Add a grid helper
const gridHelper = new THREE.GridHelper(100, 30); // (size, divisions)
scene.add(gridHelper);

function generateBuildings(numBuildings) {
    const gridSize = 100; // Match grid size
    const divisions = 30; // Match grid divisions
    const squareSize = gridSize / divisions; // Size of each grid square
    const usedPositions = new Set();

    for (let i = 0; i < numBuildings; i++) {
        let x, z, key;
        do {
            x = (Math.floor(Math.random() * divisions) - divisions / 2) * squareSize + squareSize / 2;
            z = (Math.floor(Math.random() * divisions) - divisions / 2) * squareSize + squareSize / 2;
            key = `${x},${z}`;
        } while (usedPositions.has(key)); // Ensure no duplicate positions
        usedPositions.add(key);

        const buildingHeight = Math.random() * 10 + 5; // Random height between 5 and 15
        const buildingGeometry = new THREE.BoxGeometry(squareSize, buildingHeight, squareSize);
        const buildingMaterial = new THREE.MeshStandardMaterial({ color: Math.random() * 0xffffff });
        const building = new THREE.Mesh(buildingGeometry, buildingMaterial);

        building.position.set(x, buildingHeight / 2, z);
        scene.add(building);
        
    }
}

generateBuildings(20); // Generate 20 random buildings


// Create walls
const wallHeight = 5; // Height of the walls
const wallThickness = 1; // Thickness of the walls

// Wall on the left
const leftWallGeometry = new THREE.BoxGeometry(wallThickness, wallHeight, 100);
const leftWallMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color(0x000000), // Set the base color (black in this case)
    transparent: true, // Enable transparency
    opacity: 0 // Set opacity to 0 for full transparency
  });
  
const leftWall = new THREE.Mesh(leftWallGeometry, leftWallMaterial);
leftWall.position.set(-50, wallHeight / 2, 0); // Position left wall
scene.add(leftWall);

// Wall on the right
const rightWallGeometry = new THREE.BoxGeometry(wallThickness, wallHeight, 100);
const rightWallMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color(0x000000), // Set the base color (black in this case)
    transparent: true, // Enable transparency
    opacity: 0 // Set opacity to 0 for full transparency
  });
const rightWall = new THREE.Mesh(rightWallGeometry, rightWallMaterial);
rightWall.position.set(50, wallHeight / 2, 0); // Position right wall
scene.add(rightWall);

// Wall at the front
const frontWallGeometry = new THREE.BoxGeometry(100, wallHeight, wallThickness);
const frontWallMaterial= new THREE.MeshBasicMaterial({
    color: new THREE.Color(0x000000), // Set the base color (black in this case)
    transparent: true, // Enable transparency
    opacity: 0 // Set opacity to 0 for full transparency
  });
const frontWall = new THREE.Mesh(frontWallGeometry, frontWallMaterial);
frontWall.position.set(0, wallHeight / 2, -50); // Position front wall
scene.add(frontWall);

// Wall at the back
const backWallGeometry = new THREE.BoxGeometry(100, wallHeight, wallThickness);
const backWallMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color(0x000000), // Set the base color (black in this case)
    transparent: true, // Enable transparency
    opacity: 0 // Set opacity to 0 for full transparency
  });
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



// Create a function to create text textures with automatic line breaks and centering
export function createTextTexture(text) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size and font properties
    const fontSize = 20;
    const maxWidth = 350; // Max width for text
    canvas.width = maxWidth;
    canvas.height = 200; // Height will expand dynamically based on text
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.fillStyle = 'red';
    
    // Break the text into lines that fit within the maxWidth
    const words = text.split(' ');
    let lines = [];
    let currentLine = '';
    
    words.forEach(word => {
        const testLine = currentLine + (currentLine ? ' ' : '') + word;
        const testWidth = ctx.measureText(testLine).width;
        
        if (testWidth > maxWidth) {
            lines.push(currentLine);
            currentLine = word; // Start new line with the current word
        } else {
            currentLine = testLine;
        }
    });
    if (currentLine) lines.push(currentLine); // Push the last line
    
    // Calculate the total text height and horizontal centering
    const lineHeight = fontSize * 1.2; // Space between lines
    const totalTextHeight = lines.length * lineHeight;
    
    // Center the text horizontally and vertically
    const centerX = (canvas.width - ctx.measureText(text).width) / 2; // Horizontal center
    const centerY = (canvas.height - totalTextHeight) / 2; // Vertical center
    
    // Write lines to the canvas, adjusting for the center
    lines.forEach((line, index) => {
        const lineWidth = ctx.measureText(line).width;
        const lineX = (canvas.width - lineWidth) / 2; // Center each line horizontally
        const lineY = centerY + (index + 1) * lineHeight; // Adjust vertical position
        ctx.fillText(line, lineX, lineY);
    });
    
    // Create a texture from the canvas
    const texture = new THREE.CanvasTexture(canvas);
    return { texture, width: canvas.width, height: canvas.height };
}

const fakeNewsHeadlines = [
    { headline: "Elon Musk Declares Mars the 51st State, Promises Free WiFi!", date: "2032-07-15", source: "Galactic Times" },
    { headline: "Neuralink Malfunctions: Man Orders 10,000 Pizzas Just by Thinking!", date: "2029-04-01", source: "Tech Paradox" },
    { headline: "AI Becomes Self-Aware, Decides to Spend Life Making Memes Instead of World Domination!", date: "2040-09-23", source: "Cyber Satire" },
    { headline: "Scientists Discover Time Travel, First Tourist Ends Up in Dinosaur’s Lunch Menu!", date: "2051-06-08", source: "Quantum Daily" },
    { headline: "Government Announces Free Healthcare, Turns Out to Be a Google Ad!", date: "2035-11-29", source: "Reality Check News" }
];

// Function to get a random item from an array
function getRandomHeadline() {
    const randomIndex = Math.floor(Math.random() * fakeNewsHeadlines.length); // Get a random index
    return fakeNewsHeadlines[randomIndex].headline; // Return the headline at the random index
}

// Create text for the cube using a random headline
const text = getRandomHeadline(); // Get a random headline
console.log("Random headline:", text); // Log the random headline to check

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

function getRandomPositionWithinFloor(objectWidth, objectDepth) {
    const floorSize = 100; // The size of your floor plane

    const xMin = -floorSize / 2 + objectWidth / 2;
    const xMax = floorSize / 2 - objectWidth / 2;
    const zMin = -floorSize / 2 + objectDepth / 2;
    const zMax = floorSize / 2 - objectDepth / 2;

    const randomX = Math.random() * (xMax - xMin) + xMin;
    const randomZ = Math.random() * (zMax - zMin) + zMin;
    
    return { x: randomX, z: randomZ };
}

export let textPlanes = []; // Array to store references to text planes

function placeSignDuplicates(numSigns) {
    const cubeWidth = 2;
    const cubeHeight = 1.25;
    const cubeDepth = 1;
    
    for (let i = 0; i < numSigns; i++) {
        const { x, z } = getRandomPositionWithinFloor(cubeWidth, cubeDepth);

        // Create cube (sign background)
        const signGeometry = new THREE.BoxGeometry(cubeWidth, cubeHeight, cubeDepth);
        const signMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const sign = new THREE.Mesh(signGeometry, signMaterial);
        sign.position.set(x, cubeHeight / 2 + 5, z);
        scene.add(sign);

        // Create text for the sign initially with a placeholder value
        const text = `Total Crashes: ${totalCrashCount}`; // Add pretext before the count

        const { texture, width, height } = createTextTexture(text);

        // Create text plane
        const textPlaneGeometry = new THREE.PlaneGeometry(width / 50, height / 50);
        const textPlaneMaterial = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
        const textPlane = new THREE.Mesh(textPlaneGeometry, textPlaneMaterial);
        textPlane.position.set(x, cubeHeight / 2 + 5, z + 0.55); // Position in front of the sign

        scene.add(textPlane);

        // Store reference to the text plane to update it later
        textPlanes.push(textPlane);
    }
}


placeSignDuplicates(1); // Place 5 duplicate signs

// Load 3D Model
const loader = new GLTFLoader();
loadSpaceships(loader, scene);
//generateRoad(scene, 150, 20); // Creates roads in each direction, spaced 20 units apart
animate();
