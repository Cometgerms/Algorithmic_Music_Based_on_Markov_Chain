// music_generator.js
autowatch = 1;
outlets = 2;

var coloring = {};
var melody = [];

var color_to_instrument = {
    0: 0,
    1: 1,
    2: 2
};

var duration = 500;

function set_coloring(json_coloring) {
    try {
        coloring = JSON.parse(json_coloring);
        outlet(0, JSON.stringify(coloring));
        post("Coloring updated\n");
    } catch (e) {
        post("Error parsing coloring: " + e.message + "\n");
    }
}

function set_melody() {
    melody = arrayfromargs(arguments);
    post("Melody updated: " + melody + "\n");
    post("melody length: " + melody.length + "\n");
    generate_music();
    post("Music generated\n");
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generate_music() {
    var midi_messages = [];
    var time = 0;
    post("Generating music with length " + melody.length + "\n");
    post("Melody: " + melody + "\n");
    for (var i = 0; i < melody.length; i++) {
        // post("Note: " + melody[i] + "\n");
        var note = melody[i];
        var color = coloring[note] !== undefined ? coloring[note] : 0; // 默认乐器
        var channel = color_to_instrument[color] || 0; // 默认通道0

        // post("I am okay here\n");
        var rand_velocity = getRandomInt(1, 127);
        var rand_duration = getRandomInt(30, 1000);
        post("rand_d: " + rand_duration/4*3 + "\n");

        //rand_duration/4*3 int
        midi_messages.push(Math.round(rand_duration/4*3));
        midi_messages.push(0x90 + channel); // Note On
        midi_messages.push(note);
        midi_messages.push(rand_velocity); // Velocity

        midi_messages.push(Math.round(rand_duration/4));
        midi_messages.push(0x80 + channel); // Note Off
        midi_messages.push(note);
        midi_messages.push(0); // Velocity

        time += duration;
    }
    // post("MIDI Messages: " + midi_messages + "\n");
    post("MIDI Messages Complete\n");
    outlet(1, midi_messages); // outlet 2 sending midi messages
}

function bang() {}
function msg_int(val) {}
function list() {}
function anything(msg) {
    post("Received message: " + msg + "\n");
}
