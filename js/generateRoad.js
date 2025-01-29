import * as THREE from 'three';
import { renderer, camera } from '/js/main.js';  // Adjust the path as needed

export function generateRoad(scene, roadCount, roadSpacing) {
    const roadWidth = 1;
    const roadLength = 100; // Road length
    const roadMaterial = new THREE.MeshBasicMaterial({ color: 0x333333, side: THREE.DoubleSide });

    const roadGeometry = new THREE.PlaneGeometry(roadWidth, roadLength);

    const shapes = [];  // Array to store the shapes

    // Create and add roads to the scene
    for (let i = 0; i < roadCount; i++) {
        // Calculate road position
        const xPosition = i * roadSpacing - (roadSpacing * (roadCount - 1)) / 2;
        const road = new THREE.Mesh(roadGeometry, roadMaterial);
        road.position.set(xPosition, 0.01, 0);
        road.rotation.x = -Math.PI / 2;
        scene.add(road);

        // Add a basic shape (sphere) on the road
        const shapeGeometry = new THREE.SphereGeometry(1, 16, 16);  // You can use a Sphere or Cube
        const shapeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });  // Red color
        const shape = new THREE.Mesh(shapeGeometry, shapeMaterial);

        // Position the shape randomly on the road
        shape.position.set(xPosition, 0.5, Math.random() * roadLength - roadLength / 2);
        scene.add(shape);

        // Add the shape to the array for animation
        shapes.push({
            mesh: shape,
            direction: new THREE.Vector3(0, 0, 1),  // Movement direction along the z-axis
        });
    }

    // Function to animate the shapes
    function animate() {
        requestAnimationFrame(animate);

        // Set speed to 0.5
        const speed = 0.5;

        // Move each shape up and down using a sine wave, and along the road
        const time = Date.now() * 0.002;  // Time-based movement for smooth oscillation
        for (const shapeObj of shapes) {
            const shape = shapeObj.mesh;
            const direction = shapeObj.direction;

            // Apply sine wave function for vertical movement (y-axis)
           // shape.position.y = Math.sin(time + shape.position.x) * 2 + 0.5;  // Up and down movement

            // Move shapes along the road (forward in the z-axis)
            shape.position.z += direction.z * speed;  // Move according to the direction vector

            // Reverse direction if hitting the road boundaries
            if (shape.position.z > roadLength / 2 || shape.position.z < -roadLength / 2) {
                // Reverse direction
                direction.z *= -1;
                // Make sure the shape doesn't get stuck in the wall
                shape.position.z = Math.max(Math.min(shape.position.z, roadLength / 2), -roadLength / 2);
            }
        }

        // Render the scene (assuming you have a renderer and camera)
        renderer.render(scene, camera);
    }

    // Start the animation loop
    animate();
}
