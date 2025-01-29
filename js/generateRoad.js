import * as THREE from 'three';
import { loader, scene } from '/js/main.js';

export function generateRoad(scene, roadCount, roadSpacing) {
    const roadWidth = 1;
    const roadLength = 100; // Same as the plane's size
    const roadMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide });

    // Calculate the bounds of the plane
    const planeSize = 100;
    const halfPlaneSize = planeSize / 2;

    // Create roads and add them to the scene
    const roads = []; // Array to hold road meshes for later use (car placement)
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
            roads.push({ road: road1, direction: 'x' });
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
            roads.push({ road: road2, direction: 'z' });
        }
    }

    // Now, load and place cars on the roads
    const numberOfCars = 5; // You can adjust this number

    for (let i = 0; i < numberOfCars; i++) {
        loader.load(
            '/tesla_cybertruck.glb', // Path to your model
            function (gltf) {
                const model = gltf.scene;
                model.scale.set(0.05, 0.05, 0.05); // Scale the model

                // Randomly select a road and place the car on it
                const roadData = roads[Math.floor(Math.random() * roads.length)];
                const road = roadData.road;
                const direction = roadData.direction;

                let randomPosition = new THREE.Vector3();

                // Randomly choose a position along the selected road
                if (direction === 'x') {
                    // For front-to-back roads (X direction)
                    randomPosition.x = road.position.x;
                    randomPosition.z = Math.random() * roadLength - roadLength / 2;
                } else {
                    // For left-to-right roads (Z direction)
                    randomPosition.x = Math.random() * roadLength - roadLength / 2;
                    randomPosition.z = road.position.z;
                }

                randomPosition.y = 0.02; // Slightly above the road surface

                model.position.set(randomPosition.x, randomPosition.y, randomPosition.z);
                scene.add(model);
            }
        );
    }
}
