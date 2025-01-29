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

// Load 3D Model
const loader = new GLTFLoader();
loadSpaceships(loader, scene);
generateRoad(scene, 150, 20); // Creates roads in each direction, spaced 20 units apart
animate();
