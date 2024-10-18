// graph_coloring.js
autowatch = 1;

var graph = {};
var coloring = {};


var color_to_instrument = {
    0: 0,
    1: 14,
    2: 25
};

function print_graph() {
    post(JSON.stringify(graph) + "\n");
}

function set_graph(json_graph) {
    graph = JSON.parse(json_graph);
    // print_graph();
    post("Graph Coloring Graph updated\n");
    coloring = color_graph(graph);
    outlet(0, JSON.stringify(coloring));
    post("Graph Coloring complete\n");
}

function color_graph(graph) {
    var coloring = {};
    var colors = Object.keys(color_to_instrument).map(Number);
    // post("Colors: " + colors + "\n");
    for (var node in graph) {
        // post("Coloring node: " + node + "\n");
        var usedColors = [];
        for (var neighbor in graph[node]) {
            // post("Neighbor: " + neighbor + "\n");
            if (coloring[neighbor] !== undefined) {
                // post("Neighbor " + neighbor + " has color " + coloring[neighbor] + "\n");
                usedColors.push(coloring[neighbor]);
            }
        }
        for (var i = 0; i < colors.length; i++) {
            if (usedColors.indexOf(colors[i]) === -1) { // 使用indexOf替代Set.has
                coloring[node] = colors[i];
                post("Assigned color " + colors[i] + " to node " + node + "\n"); // 添加这一行
                break;
            }
        }
    }
    return coloring;
}

// 接收消息
function bang() {}
function msg_int(val) {}
function list() {}
function anything() {}

