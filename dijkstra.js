// dijkstra.js
autowatch = 1;

var graph = {};

function set_graph(json_graph) {
    graph = JSON.parse(json_graph);
    post("dijkstra.js graph updated\n");
}

function PriorityQueue() {
    this.elements = [];
}

PriorityQueue.prototype.enqueue = function(item, priority) {
    this.elements.push({item: item, priority: priority});
    this.elements.sort(function(a, b) {
        return a.priority - b.priority;
    });
}

PriorityQueue.prototype.dequeue = function() {
    return this.elements.shift().item;
}

PriorityQueue.prototype.isEmpty = function() {
    return this.elements.length === 0;
}

function dijkstra(start, end) {
    post("Starting Dijkstra from " + start + " to " + end + "\n");

    if (!graph[start] || !graph[end]) {
        post("Start or end node not in graph.\n");
        outlet(0, []);
        return;
    }

    var distances = {};
    var previous = {};
    var queue = new PriorityQueue();

    for (var node in graph) {
        distances[node] = Infinity;
        previous[node] = null;
        queue.enqueue(node, Infinity);
    }
    distances[start] = 0;
    queue.enqueue(start, 0); // 更新起始节点的优先级

    var max_iterations = 1000;
    var iteration = 0;

    while (!queue.isEmpty()) {
        iteration++;
        if (iteration > max_iterations) {
            post("Exceeded maximum iterations.\n");
            outlet(0, []);
            return;
        }

        var current = queue.dequeue();

        post("Current node: " + current + " with distance: " + distances[current] + "\n");

        if (current === end) break;

        if (!graph[current]) {
            post("No neighbors for node: " + current + "\n");
            continue;
        }

        for (var neighbor in graph[current]) {
            var weight = graph[current][neighbor];
            var alt = distances[current] + weight;
            if (alt < distances[neighbor]) {
                distances[neighbor] = alt;
                previous[neighbor] = current;
                queue.enqueue(neighbor, alt);
                post("Updating distance of " + neighbor + " to " + alt + "\n");
            }
        }
    }

    var path = [];
    var u = end;
    while (previous[u] !== null && previous[u] !== undefined) {
        path.unshift(parseInt(u));
        u = previous[u];
    }
    if (u == start) path.unshift(parseInt(u));
    else {
        post("No path found from " + start + " to " + end + "\n");
        path = [];
    }

    post("Path found: " + path + "\n");
    outlet(0, path);
}



function find_path(start, end) {
    dijkstra(start, end);
}
