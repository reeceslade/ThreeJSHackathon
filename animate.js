import * as THREE from 'three';
import { scene, camera, renderer, controls } from './main.js';
import { spaceships } from './ships.js';
import { movement } from './movement.js';

export function animate() {
    requestAnimationFrame(animate);

    
    const velocity = new THREE.Vector3();

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