// midi_sender.js
autowatch = 1;
outlets = 1;
var msg = [];
var global_bang = 0;

function init(){
    global_bang = 0;
    // msg = [];
    post("midi_sender.js: Initialized\n");
}

function midi_messages() {
    var args = arrayfromargs(arguments);
    post("midi_sender.js: Received MIDI Messages\n");
    msg = args;
    // receive_midi_messages();
    post("midi_sender.js: MIDI Messages completed by midi_sender.js\n");
}

function receive_midi_messages() {
    post("Processing MIDI Messages\n");
    for (var i = 0; i < msg.length; i += 4) {
        var delay_time = msg[i];
        var status = msg[i + 1];
        var note = msg[i + 2];
        var velocity = msg[i + 3];

        post("midi_sender.js: Sending to pipe: " + delay_time + " " + status + " " + note + " " + velocity + "\n");

        outlet(0, delay_time, "note", status, note, velocity);
    }
    post("midi_sender.js: MIDI Messages processed by midi_sender.js\n");
}

function outlet_midi_messages(i) {
    post("i: " + i + "\n");
    var delay_time = msg[i];
    var status = msg[i + 1];
    var note = msg[i + 2];
    var velocity = msg[i + 3];
    outlet(0, delay_time, note, velocity, 0);
}

function anything() {
    var msg = arrayfromargs(arguments);
    if (msg[0] === "midi_messages") {
        // midi_messages.apply(this, msg.slice(1));
    }
}

function bang() {
    if(global_bang<= msg.length-4){
        post("midi_sender: Received bang\n");
        post("global_bang: " + global_bang + "\n");
        outlet_midi_messages(global_bang);
        global_bang+=4;
    }
    else{
        outlet(0, 0,0,0, 1);
        post("midi_sender: End of MIDI Messages\n");
    }
}

