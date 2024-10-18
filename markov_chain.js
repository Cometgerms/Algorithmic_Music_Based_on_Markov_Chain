// markov_chain.js
autowatch = 1;

var graph = {};
var jsonBuffer = "";

function set_graph(json_graph) {
    post("Received JSON length: " + json_graph.length + "\n");
    jsonBuffer += json_graph;

    try {
        graph = JSON.parse(jsonBuffer);
        post("Markov Chain Graph updated\n");
        jsonBuffer = "";
    } catch (e) {
        post("Error parsing JSON: " + e.message + "\n");
    }
}

function next_note(current) {
    if (!graph[current]) {
        post("No transitions defined for current state: " + current + "\n");
        return;
    }
    var transitions = graph[current];
    var rand = Math.random();
    var cumulative = 0;
    for (var note in transitions) {
        cumulative += transitions[note];
        if (rand < cumulative) {
            outlet(0, parseInt(note));
            return;
        }
    }
    outlet(0, parseInt(current));
}

function print_graph() {
    outlet(0, JSON.stringify(graph));
}

function generate_markov(start, length) {
    var current = start;

    post("Starting Markov Chain from " + start + " for " + length + " notes\n");
    var sequence = [];
    post("Current state: " + current + "\n");
    for (var i = 0; i < length; i++) {
        sequence.push(current);
        current = next_state(current);
        if (current === undefined){
            post("No transitions defined for current state: " + current + "\n");
            break;
        }
    }
    outlet(0, sequence);
}

function next_state(current) {
    if (!graph[current]) return undefined;
    var transitions = graph[current];
    var rand = Math.random();
    var cumulative = 0;
    for (var note in transitions) {
        cumulative += transitions[note];
        if (rand < cumulative) {
            return parseInt(note);
        }
    }
    return undefined;
}

function bang() {
    print_graph();
}
function msg_int(val) {}
function list() {}
function anything() {}