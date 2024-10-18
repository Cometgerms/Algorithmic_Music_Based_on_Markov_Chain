// visualization.js
autowatch = 1;
outlets = 2; // One outlet for nodes, one for links

var graph = {};
var currentNote = null;

var nodeMatrix = new JitterMatrix(4, "float32", "nodeMatrix"); // 4 planes for x, y, z, size
var linkMatrix = new JitterMatrix(7, "float32", "linkMatrix"); // 7 planes for x1, y1, z1, r, g, b, a

function findNodeById(nodes, id) {
    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].id === id) {
            return nodes[i];
        }
    }
    return null;
}

function visGraph(currentNote) {
    try {
        post("visG: Start\n");

        // Generate nodes
        var nodes = Object.keys(graph).map(function(note) {
            return {
                id: note,
                x: Math.random() * 2 - 1, // OpenGL coordinates (-1 to 1)
                y: Math.random() * 2 - 1,
                z: 0,
                size: Math.random() * 0.1 + 0.05, // Random size between 0.05 and 0.15
                color: [Math.random(), Math.random(), Math.random(), 1] // Random color
            };
        }).slice();

        if (nodes.length === 0) {
            post("Error: No nodes generated from graph\n");
            return;
        }

        // Generate links
        var links = [];
        for (var source in graph) {
            if (graph.hasOwnProperty(source)) {
                var targets = graph[source];
                for (var target in targets) {
                    if (targets.hasOwnProperty(target)) {
                        var probability = targets[target];
                        links.push({ source: source, target: target, probability: probability });
                    }
                }
            }
        }

        // Update node matrix
        nodeMatrix.dim = [nodes.length, 1];
        nodeMatrix.type = "float32";
        nodeMatrix.planecount = 4;
        nodeMatrix.clear();

        for (var i = 0; i < nodes.length; i++) {
            nodeMatrix.setcell1d(i, [nodes[i].x, nodes[i].y, nodes[i].z, nodes[i].size]);
        }
        post("Node Matrix updated successfully\n");

        linkMatrix.dim = [links.length, 1];
        linkMatrix.type = "float32";
        linkMatrix.planecount = 7; // x1, y1, z1, r, g, b, a
        linkMatrix.clear();

        post("Updating Link Matrix...\n");

        if (!Array.isArray(nodes)) {
            post("Error: Nodes is not an array, cannot use find()\n");
            return;
        }

        for (var i = 0; i < links.length; i++) {
            var sourceNode = findNodeById(nodes, links[i].source);
            var targetNode = findNodeById(nodes, links[i].target);

            if (sourceNode && targetNode) {
                var intensity = links[i].probability; // Use probability for color intensity
                linkMatrix.setcell1d(i, [
                    sourceNode.x, sourceNode.y, sourceNode.z,
                    intensity, intensity, intensity, 1, // Color based on probability
                    targetNode.x, targetNode.y, targetNode.z
                ]);
            } else {
                post("Warning: Source or Target Node not found for link " + JSON.stringify(links[i]) + "\n");
            }
        }
        post("Link Matrix updated successfully\n");

        // Output matrices for visualization
        outlet(0, "jit_matrix", nodeMatrix.name);
        outlet(1, "jit_matrix", linkMatrix.name);

        post("Node Matrix Dimensions: " + nodeMatrix.dim + "\n");
        post("Link Matrix Dimensions: " + linkMatrix.dim + "\n");

        // Highlight the current note
        if (currentNote) {
            post("visG Current Note: " + currentNote + "\n");
        }

        post("vis: End\n");

    } catch (e) {
        post("Error in visGraph: " + e + "\n");
    }
}

function set_graph(json_graph) {
    graph = JSON.parse(json_graph);
    post("Markov Chain Graph updated for visualization\n");
}

function note_receive(note) {
    currentNote = note;
    post("Visualization: Note received " + note + "\n");

    if (Object.keys(graph).length === 0) {
        post("Error: Graph data not set before calling visGraph\n");
        return; // Exit function if empty
    }

    // Check if currentNote is valid
    if (typeof currentNote !== 'number' || isNaN(currentNote)) {
        post("Error: Current note is not a valid number\n");
        return; // Exit function to avoid errors from invalid data
    }

    try {
        visGraph(currentNote);
    } catch (e) {
        post("Error calling visGraph: " + e + "\n");
    }
}