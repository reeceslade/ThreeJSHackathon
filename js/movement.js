// movement.js
// Movement variables
export const movement = {
    moveForward: false,
    moveBackward: false,
    moveLeft: false,
    moveRight: false,
    moveUp: false,
    moveDown: false
};

// Event listeners for keyboard input
document.addEventListener('keydown', (event) => {
    switch (event.code) {
        case 'KeyW': movement.moveForward = true; break;
        case 'KeyS': movement.moveBackward = true; break;
        case 'KeyA': movement.moveLeft = true; break;
        case 'KeyD': movement.moveRight = true; break;
        case 'Space': movement.moveUp = true; break; // Move up with Space key
        case 'ShiftLeft': movement.moveDown = true; break; // Move down with Left Shift key
    }
});

document.addEventListener('keyup', (event) => {
    switch (event.code) {
        case 'KeyW': movement.moveForward = false; break;
        case 'KeyS': movement.moveBackward = false; break;
        case 'KeyA': movement.moveLeft = false; break;
        case 'KeyD': movement.moveRight = false; break;
        case 'Space': movement.moveUp = false; break; // Stop moving up when Space is released
        case 'ShiftLeft': movement.moveDown = false; break; // Stop moving down when Left Shift is released
    }
});
