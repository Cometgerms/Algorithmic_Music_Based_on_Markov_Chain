// music_graph_markov.js
//test
autowatch = 1;

var graph = {};

function generate_markov_chain() {
    var notes = [];
    for (var i = 34; i <= 108; i++) { //cant do 21 since the datasize is too large
        notes.push(i);
    }

    for (var i = 0; i < notes.length; i++) {
        var note = notes[i];
        graph[note] = {};
        for (var j = 0; j < notes.length; j++) {
            var target = notes[j];
            var distance = Math.abs(note - target);
            var probability = 0;

            if (distance === 0) {
                probability = 0.1; // self
            } else if (distance === 1 || distance === 2) {
                probability = 0.2; // semitone and tone has higher probability
            } else if (distance <= 4) {
                probability = 0.15; // small interval probability
            } else if (distance <= 7) {
                probability = 0.05; // a large interval probability
            }

            // harmony
            if ((note % 12 === 0 && target % 12 === 7) || (note % 12 === 7 && target % 12 === 0)) {
                probability += 0.1; // from tonic to dominant
            } else if ((note % 12 === 0 && target % 12 === 5) || (note % 12 === 5 && target % 12 === 0)) {
                probability += 0.05; // from tonic to subdominant
            }

            // ensure the probability equals to 1
            if (probability > 0) {
                graph[note][target] = probability;
            }
        }
        var total = 0;
        for (var target in graph[note]) {
            total += graph[note][target];
        }
        for (var target in graph[note]) {
            graph[note][target] /= total;
        }
    }
    post("Markov Chain Graph generated\n");
    outlet(0, JSON.stringify(graph));
}

function get_graph() {
    outlet(0, JSON.stringify(graph));
}

function bang() {
    generate_markov_chain();
}

function msg_int(val) {
    post("Received int: " + val + "\n");
}