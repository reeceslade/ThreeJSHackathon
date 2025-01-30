import * as THREE from 'three';
import { scene, camera, renderer, controls } from '/js/main.js';
import { spaceships } from '/js/ships.js';
import { movement } from '/js/movement.js';
import { isPaused } from '/js/menu.js';

export function animate() {
    if (isPaused) {
        requestAnimationFrame(animate); // Keep requesting animation frames but skip the logic if paused
        return;
    }

    requestAnimationFrame(animate);

    const velocity = new THREE.Vector3();

    // Movement logic
    const delta = 0.5; // Adjust movement speed

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

    spaceships.forEach(spaceship => {
        spaceship.model.rotation.y += 0.01;  // Rotate the model around the y-axis
    });

    renderer.render(scene, camera);
}
