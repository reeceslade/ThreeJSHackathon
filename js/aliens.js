import { loader, scene } from '/js/main.js';

export function loadAliens() {
    const numberOfAliens = 10; // Adjust this number as needed
    const gridSize = 100; // Match grid size
    const divisions = 30; // Match grid divisions
    const squareSize = gridSize / divisions; // Size of each grid square
    const usedPositions = new Set(); // Keep track of used positions

    const modelPaths = [
        '/tesla_cybertruck.glb',
        '/stylized_robot_0_9_max.glb',
        '/posed_black_man_shopping_humano_064_4985.glb',        // Add more paths as needed
    ];

    const scales = [
        { x: 0.2, y: 0.2, z: 0.2 }, // Scale for the first model
        { x: 8, y: 8, z: 8 }, // Scale for the second model
        { x: 2, y: 2, z: 2 }, // Scale for the third model
    ];
    
    let currentIndex = 0;

    function loadNextModel() {
        if (currentIndex >= numberOfAliens) {
            return; // All models have been loaded
        }

        const modelPath = modelPaths[currentIndex % modelPaths.length]; // Cycle through model paths
        const scale = scales[currentIndex % scales.length]; // Cycle through scale values for models

        loader.load(
            modelPath,
            function (gltf) {
                const originalModel = gltf.scene;

                let x, z, key;
                do {
                    x = (Math.floor(Math.random() * divisions) - divisions / 2) * squareSize + squareSize / 2;
                    z = (Math.floor(Math.random() * divisions) - divisions / 2) * squareSize + squareSize / 2;
                    key = `${x},${z}`; // Create a unique key for the position
                } while (usedPositions.has(key)); // Ensure no duplicate positions
                usedPositions.add(key);

                const model = originalModel.clone(); // Clone the model for each alien
                model.scale.set(scale.x, scale.y, scale.z); // Scale the model based on the scale array

                model.position.set(x, 0, z); // Position based on the grid
                scene.add(model);

                currentIndex++;
                loadNextModel(); // Load the next model
            },
            undefined,
            function (error) {
                console.error(error);
                currentIndex++;
                loadNextModel(); // Continue loading the next model even if there's an error
            }
        );
    }

    loadNextModel(); // Start loading the first model
}
