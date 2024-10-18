// test.js
autowatch = 1;

function bang() {
    post("Test.js loaded and bang received!\n");
    outlet(0, "Hello from test.js");
}

function msg_int(val) {
    post("Received int: " + val + "\n");
    outlet(0, "Received int: " + val);
}

function anything() {
    post("Received message: " + arrayfromargs(arguments) + "\n");
    outlet(0, "Received message: " + arrayfromargs(arguments));
}
