
var server_ping_data = {}
var server_ping_callbacks = {};
var server_ping_callback_id = 0;

function PingServer(server_id, server_host, server_port) {


    var ping_socket = new WebSocket('ws://' + server_host + ':' + server_port);
    var ping_timer = Date.now();

    ping_socket.onopen = function () {
        ping_socket.send("SBSB");
        ping_timer = Date.now();
    }

    ping_socket.onmessage = function() {
    }

    ping_socket.onclose = function() {
        var ms = Date.now() - ping_timer;

        server_ping_data[server_id] = ms;
        UpdateServerPingCallbacks(server_id, ms);
        ping_socket.close();  
    }
}

function GetServerPing(server_id) {
    return server_ping_data[server_id];
}

function UpdateServerPingCallbacks(server_id, ms) {
    UpdateServerPing(server_id, ms);

    for(var id in server_ping_callbacks) {
        server_ping_callbacks[id](server_id, ms);
    }
}

function RegisterServerPingCallback(func) {
    server_ping_callbacks[server_ping_callback_id] = func;
    return server_ping_callback_id++;
}

function UnregisterServerPingCallback(callback_id) {
    delete server_ping_callbacks[callback_id];
}
