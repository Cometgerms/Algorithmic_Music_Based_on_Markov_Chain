// harmony_generator1.js
autowatch = 1;
outlets = 1;
var previousNote = 60;
var times = 0;

var interval_Transition_Table = {
    "Unison": { "Minor Third": 0.3, "Perfect Fifth": 0.5, "Major Third": 0.2 },
    "Major Third": { "Minor Third": 0.3, "Perfect Fifth": 0.5, "Major Third": 0.2 },
    "Perfect Fifth": { "Unison": 0.3, "Major Third": 0.4, "Perfect Fifth": 0.3 },
    "Minor Third": { "Unison": 0.2, "Major Third": 0.3, "Perfect Fifth": 0.5 },
};

var current_Interval = "Unison";

function init() {
    times = 0;
    post("Harmony Generator initialized\n");
}

function getNextInterval() {
    var transitions = interval_Transition_Table[current_Interval];
    if (!transitions) {
        // Reset to Unison if the current interval has no defined transitions
        current_Interval = "Unison";
        transitions = interval_Transition_Table[current_Interval];
    }

    var rand = Math.random();
    var cumulative = 0;

    for (var interval in transitions) {
        cumulative += transitions[interval];
        if (rand < cumulative) {
            current_Interval = interval;
            return interval;
        }
    }
    current_Interval = "Unison";
    return "Unison";
}

function generateHarmony(melodyNote) {
    // up or down
    var direction = Math.random() < 0.5 ? -1 : 1;
    var nextInterval = getNextInterval();
    var intervalMap = {
        "Unison": 0,
        "Minor Second": 1,
        "Major Second": 2,
        "Minor Third": 3,
        "Major Third": 4,
        "Perfect Fourth": 5,
        "Augmented Fourth": 6,
        "Perfect Fifth": 7,
        "Minor Sixth": 8,
        "Major Sixth": 9,
        "Minor Seventh": 10,
        "Major Seventh": 11,
        "Perfect Octave": 12
    };

    var harmonyInterval = intervalMap[nextInterval] || 0;

    var harmonyNote = melodyNote + (harmonyInterval * direction);
    post("melodyNote: " + melodyNote + " harmonyInterval: " + harmonyInterval + " direction: " + direction + "\n");

    // Ensure the harmony note is within the piano range
    if (harmonyNote < 34) harmonyNote = 34;
    if (harmonyNote > 108) harmonyNote = 108;

    return harmonyNote;
}

function note_recieve(note) {
    var harmonyNote = generateHarmony(note);
    if(times === 0){
        previousNote = harmonyNote;
    }
    if(times%2 === 0){
        post("Harmony Note: " + harmonyNote + "\n");
        outlet(0, harmonyNote);
        previousNote = harmonyNote;
    }
    else{
        post("Harmony Note: " + previousNote + "\n");
        outlet(0, previousNote);
    }
}

function midi_note_recieve() {
    var incoming = arrayfromargs(arguments);
    if (incoming.length > 0 && typeof incoming[0] === "number") {
        post("Note received: " + incoming[0] + "\n");
        note_recieve(incoming[0]);
        times++;
    }
}