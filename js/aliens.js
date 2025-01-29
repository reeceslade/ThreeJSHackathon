
/*
const numberOfAliens = 10; // Adjust this number as needed

function loadAliens() {
    for (let i = 0; i < numberOfAliens; i++) {
        loader.load(
            '/alien_creature.glb', // Adjust this path to your model
            function (gltf) {
                const model = gltf.scene;
                model.scale.set(2, 2, 2); // Scale the model
                model.position.set(
                    Math.random() * 100 - 50, // Random x position within the plane's bounds
                    0, // y position (on the ground)
                    Math.random() * 100 - 50  // Random z position within the plane's bounds
                );
                scene.add(model);
            },
            undefined,
            function (error) {
                console.error(error);
            }
        );
    }
}
*/
// Call to load aliens
//loadAliens();