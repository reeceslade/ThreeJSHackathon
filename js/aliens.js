import { loader, scene } from '/js/main.js';

export function loadAliens() {
    const numberOfAliens = 10; // Adjust this number as needed

    loader.load(
        '/posed_black_man_shopping_humano_064_4985.glb', // Adjust this path to your model
        function (gltf) {
            const originalModel = gltf.scene;

            for (let i = 0; i < numberOfAliens; i++) {
                const model = originalModel.clone(); // Clone the model
                model.scale.set(0.5,0.5,0.5 ); // Scale the model
                model.position.set(
                    Math.random() * 100 - 50, // Random x position within the plane's bounds
                    0, // y position (on the ground)
                    Math.random() * 100 - 50  // Random z position within the plane's bounds
                );
                scene.add(model);
            }
        },
        undefined,
        function (error) {
            console.error(error);
        }
    );
}