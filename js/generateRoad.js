/* 

import * as THREE from 'three';
import { renderer, camera } from '/js/main.js';  // Adjust the path as needed

export function generateRoad(scene, roadCount, roadSpacing) {
    const roadWidth = 1;
    const roadLength = 100; // Same as the plane's size
    
    const roadMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide });

    // Calculate the bounds of the plane
    const planeSize = 100;
    const halfPlaneSize = planeSize / 2;

    const markingWidth = 0.2; // Thin white line
    const markingMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });

    // First loop: Create the initial grid roads (perpendicular)
    for (let i = 0; i < roadCount; i++) {
        // Calculate the position for front-to-back roads
        const xPosition = i * roadSpacing - (roadSpacing * (roadCount - 1)) / 2;
    
        // Check if the road is within the plane's bounds for front-to-back roads
        if (Math.abs(xPosition) <= halfPlaneSize) {
            const roadGeometry1 = new THREE.PlaneGeometry(roadWidth, roadLength);
            const road1 = new THREE.Mesh(roadGeometry1, roadMaterial);
            road1.position.set(xPosition, 0.01, 0);
            road1.rotation.x = -Math.PI / 2;
            scene.add(road1);
    
            // Add road marking for front-to-back roads
            const markingGeometry1 = new THREE.PlaneGeometry(markingWidth, roadLength);
            const marking1 = new THREE.Mesh(markingGeometry1, markingMaterial);
            marking1.position.set(xPosition, 0.02, 0); // Slightly above the road
            marking1.rotation.x = -Math.PI / 2;
            scene.add(marking1);
        }
    
        // Calculate the position for left-to-right roads
        const zPosition = i * roadSpacing - (roadSpacing * (roadCount - 1)) / 2;
    
        // Check if the road is within the plane's bounds for left-to-right roads
        if (Math.abs(zPosition) <= halfPlaneSize) {
            const roadGeometry2 = new THREE.PlaneGeometry(roadLength, roadWidth);
            const road2 = new THREE.Mesh(roadGeometry2, roadMaterial);
            road2.position.set(0, 0.01, zPosition);
            road2.rotation.x = -Math.PI / 2;
            scene.add(road2);
    
            // Add road marking for left-to-right roads
            const markingGeometry2 = new THREE.PlaneGeometry(roadLength, markingWidth);
            const marking2 = new THREE.Mesh(markingGeometry2, markingMaterial);
            marking2.position.set(0, 0.02, zPosition); // Slightly above the road
            marking2.rotation.x = -Math.PI / 2;
            scene.add(marking2);
        }
    }

    // Second loop: Create inner roads within the grid (smaller perpendicular roads)
    for (let i = 0; i < roadCount - 1; i++) {
        // Create roads within the front-to-back grid (vertically oriented)
        const xPosition1 = i * roadSpacing - (roadSpacing * (roadCount - 1)) / 2 + roadSpacing / 2;
        const xPosition2 = (i + 1) * roadSpacing - (roadSpacing * (roadCount - 1)) / 2 - roadSpacing / 2;

        // Check if the position is within the bounds for additional vertical roads
        if (Math.abs(xPosition1) <= halfPlaneSize && Math.abs(xPosition2) <= halfPlaneSize) {
            const roadGeometry1 = new THREE.PlaneGeometry(roadWidth, roadLength);
            const road1 = new THREE.Mesh(roadGeometry1, roadMaterial);
            road1.position.set(xPosition1, 0.01, 0);
            road1.rotation.x = -Math.PI / 2;
            scene.add(road1);
    
            const roadGeometry2 = new THREE.PlaneGeometry(roadWidth, roadLength);
            const road2 = new THREE.Mesh(roadGeometry2, roadMaterial);
            road2.position.set(xPosition2, 0.01, 0);
            road2.rotation.x = -Math.PI / 2;
            scene.add(road2);
    
            // Add road markings for these new vertical roads
            const markingGeometry1 = new THREE.PlaneGeometry(markingWidth, roadLength);
            const marking1 = new THREE.Mesh(markingGeometry1, markingMaterial);
            marking1.position.set(xPosition1, 0.02, 0); // Slightly above the road
            marking1.rotation.x = -Math.PI / 2;
            scene.add(marking1);
    
            const markingGeometry2 = new THREE.PlaneGeometry(markingWidth, roadLength);
            const marking2 = new THREE.Mesh(markingGeometry2, markingMaterial);
            marking2.position.set(xPosition2, 0.02, 0); // Slightly above the road
            marking2.rotation.x = -Math.PI / 2;
            scene.add(marking2);
        }

        // Create roads within the left-to-right grid (horizontally oriented)
        const zPosition1 = i * roadSpacing - (roadSpacing * (roadCount - 1)) / 2 + roadSpacing / 2;
        const zPosition2 = (i + 1) * roadSpacing - (roadSpacing * (roadCount - 1)) / 2 - roadSpacing / 2;

        // Check if the position is within the bounds for additional horizontal roads
        if (Math.abs(zPosition1) <= halfPlaneSize && Math.abs(zPosition2) <= halfPlaneSize) {
            const roadGeometry3 = new THREE.PlaneGeometry(roadLength, roadWidth);
            const road3 = new THREE.Mesh(roadGeometry3, roadMaterial);
            road3.position.set(0, 0.01, zPosition1);
            road3.rotation.x = -Math.PI / 2;
            scene.add(road3);
    
            const roadGeometry4 = new THREE.PlaneGeometry(roadLength, roadWidth);
            const road4 = new THREE.Mesh(roadGeometry4, roadMaterial);
            road4.position.set(0, 0.01, zPosition2);
            road4.rotation.x = -Math.PI / 2;
            scene.add(road4);
    
            // Add road markings for these new horizontal roads
            const markingGeometry3 = new THREE.PlaneGeometry(roadLength, markingWidth);
            const marking3 = new THREE.Mesh(markingGeometry3, markingMaterial);
            marking3.position.set(0, 0.02, zPosition1); // Slightly above the road
            marking3.rotation.x = -Math.PI / 2;
            scene.add(marking3);
    
            const markingGeometry4 = new THREE.PlaneGeometry(roadLength, markingWidth);
            const marking4 = new THREE.Mesh(markingGeometry4, markingMaterial);
            marking4.position.set(0, 0.02, zPosition2); // Slightly above the road
            marking4.rotation.x = -Math.PI / 2;
            scene.add(marking4);
        }
    }

    // Third loop: Add diagonal roads
    const diagonalRoadLength = Math.sqrt(2) * roadLength; // Length of diagonal roads (Pythagorean theorem)
    for (let i = 0; i < roadCount; i++) {
        // Diagonal roads from bottom-left to top-right
        const diagonalPosition1 = i * roadSpacing - (roadSpacing * (roadCount - 1)) / 2;
        if (Math.abs(diagonalPosition1) <= halfPlaneSize) {
            const diagonalGeometry1 = new THREE.PlaneGeometry(roadWidth, diagonalRoadLength);
            const diagonalRoad1 = new THREE.Mesh(diagonalGeometry1, roadMaterial);
            diagonalRoad1.position.set(diagonalPosition1, 0.01, diagonalPosition1);
            diagonalRoad1.rotation.x = -Math.PI / 2;
            diagonalRoad1.rotation.z = Math.PI / 4; // Rotate 45 degrees
            scene.add(diagonalRoad1);
        }

        // Diagonal roads from top-left to bottom-right
        const diagonalPosition2 = i * roadSpacing - (roadSpacing * (roadCount - 1)) / 2;
        if (Math.abs(diagonalPosition2) <= halfPlaneSize) {
            const diagonalGeometry2 = new THREE.PlaneGeometry(roadWidth, diagonalRoadLength);
            const diagonalRoad2 = new THREE.Mesh(diagonalGeometry2, roadMaterial);
            diagonalRoad2.position.set(diagonalPosition2, 0.01, -diagonalPosition2);
            diagonalRoad2.rotation.x = -Math.PI / 2;
            diagonalRoad2.rotation.z = -Math.PI / 4; // Rotate -45 degrees
            scene.add(diagonalRoad2);
        }
    }
}

*/