
var ConnectionState = {
    Disconnected: 0,
    Connecting : 1,
    Identifying: 2,
    Connected: 3,
    Relocating: 4
};

var load_balancers = [
    ['uniballhq.com', 9050]
];

var servers = [
    ['uniballhq.com', 7999]
];

var connection_data = {
    socket: null,
    state: ConnectionState.Disconnected,
    sent_identify: false,
    got_initial_data: false,
    ticket: '',
    mode: '',
    remote_host : null,
    remote_port : null,
    version: 1036,
    is_relocating: false,
    relocation_token: null,
    relocation_messages: [],
    requested_create_server: null,
    server_info: null,
    welcome_info: null,
    bypass_load_balancer: true,
    got_load_balancer_result: false
};

var proof_of_work = new Worker("js/proofofwork.js");
proof_of_work.onmessage = function(e) {
    response = { 'ver': connection_data.version, 'sha': e.data };
    SendRawSocketMessage(response);
}

function SendRawSocketMessage(msg_obj) {
    var string_data = JSON.stringify(msg_obj);
    console.log("Sending - " + string_data);
    connection_data.socket.send(string_data);
}

function SendSocketMessage(msg_obj) {
    if(connection_data.is_relocating) {
        connection_data.relocation_messages.push(msg_obj);
    } else {
        SendRawSocketMessage(msg_obj);
    }
}

function HandleLoadBalancerData(msg) {
    var msg_data = JSON.parse(msg.data);

    connection_data.remote_host = msg_data['host'];
    connection_data.remote_port = msg_data['port'];
    connection_data.got_load_balancer_result = true;

    console.log("Got load balancer result - " + connection_data.remote_host + ":" + connection_data.remote_port);
}

function HandleLoadBalancerClosed(err) {
    if(connection_data.got_load_balancer_result) {
        FinalizeConnect();
    } else {
        SetupConnectErrorView("No servers available");
    }
}

function HandleSocketConnected() {
    console.log("Got server connection");
    connection_data.state = ConnectionState.Identifying;
}

function HandleSocketClosed(err) {
    if(connection_data.state == ConnectionState.Relocating) {
        connection_data.is_relocating = true;
        RequestConnect(connection_data.relocation_token, "relocate");
    }
    else {
        HandleSocketError("Disconnected from server");
    }
}

function HandleSocketError(err) {

    if(connection_data.state == ConnectionState.Connecting ||
       connection_data.state == ConnectionState.Identifying) {
        SetupConnectErrorView("Could not connect to server.");
    }

    if(connection_data.state == ConnectionState.Connected ||
       connection_data.state == ConnectionState.Relocating) {
        // Show an error popup
        SetupConnectErrorView("Network error");
    }

    connection_data.state = ConnectionState.Disconnected;
}

function HandleSocketMessage(msg) {
    console.log("Server Message - " + msg.data);
  
    var msg_data = JSON.parse(msg.data);

    if('c' in msg_data == false) {
        console.log('Bad message ' + msg);
        return;
    }

    if(msg_data['c'] == 'relocate') {
        connection_data.state = ConnectionState.Relocating;
        connection_data.remote_host = msg_data['new_host'];
        connection_data.remote_port = msg_data['new_port'];
        connection_data.relocation_token = msg_data['relocation_token'];
        connection_data.socket.close();
        return;
    }

    var response;
    if(msg_data['c'] == 'error') {
        connection_data.state = ConnectionState.Disconnected;
        connection_data.socket.onopen = null;
        connection_data.socket.onerror = null;
        connection_data.socket.onmessage = null;
        connection_data.socket.onclose = null;
        connection_data.socket.close();
        SetupConnectErrorView(msg_data['msg']);
        return;
    }

    if(connection_data.state == ConnectionState.Identifying) {
        if(msg_data['c'] == 'version') {
            proof_of_work.postMessage([msg_data['sha'], msg_data['prefix']]);
        }

        if(msg_data['c'] == 'identify') {
            /*
            if(connection_data.sent_identify == true) {
                connection_data.state = ConnectionState.Disconnected;
                connection_data.socket.close();
                SetupLoginView("Invalid user name/password");
                return;
            }
            */

            var connect_mode;
            switch(connection_data.mode) {
                case 'int':
                    connect_mode = 'lt';
                    break;
                case 'ext':
                    connect_mode = 'lext';
                    break;
                case 'debug':
                    connect_mode = 'ld';
                    break;
                case 'relocate':
                    connect_mode = 'lr';
                    break;
                case 'debug':
                    connect_mode = 'ld';
                    break;
            }
            response = {
                'c': connect_mode,
                'token': connection_data.ticket
            };
            SendRawSocketMessage(response);
            connection_data.sent_identify = true;

            return;
        }

        if(msg_data['c'] == 'new_user') {
            //SendUserName("asdf");
            SetupPickUserNameView(false);
            return;
        }
        
        if(msg_data['c'] == 'repick_new_user') {
            SetupPickUserNameView(true);
            return;
        }

        if(msg_data['c'] == 'server') {
            connection_data.server_info = msg_data["data"]; 
            return;
        }

        if(msg_data['c'] == 'winfo') {
            connection_data.welcome_info = msg_data["data"]; 
            return;
        }

        if(msg_data['c'] == 'local') {
            connection_data.state = ConnectionState.Connected;
            SetupChatView();
            InitializeChatCallbacks();
            InitializeSquadCallbacks();
            HandleLocalDataUpdate(msg_data["data"]);
            FinalizeProfile();

            if(connection_data.welcome_info != null) {
                UpdateLobbyInfo(connection_data.welcome_info);
                connection_data.welcome_info = null;
            }

            if(connection_data.server_info != null) {
                HandleServerDataUpdate(connection_data.server_info);
                connection_data.server_info = null;
            }
            return;
        }

        if(msg_data['c'] == 'relocated') {
            connection_data.is_relocating = false;
            connection_data.relocation_messages.forEach(SendRawSocketMessage);
            connection_data.relocation_messages = [];
            connection_data.relocation_token = null;
            connection_data.state = ConnectionState.Connected;
        }
    }

    if(connection_data.state == ConnectionState.Connected) {
        if(msg_data['c'] == 'local') {
            HandleLocalDataUpdate(msg_data["data"]);
            return;
        }     

        if(msg_data['c'] == 'server') {
            HandleServerDataUpdate(msg_data["data"]);
            return;
        }

        if(msg_data['c'] == 'winfo') {
            UpdateLobbyInfo(msg_data["data"]);
            return;
        }
        
        if(msg_data['c'] == 'c') {
            AddChat(msg_data, true);
            return;
        } 

        if(msg_data['c'] == 'rterr') {
            ShowRuntimeError(msg_data.msg);
            return;
        }

        if(msg_data['c'] == 'smsg') {
            NotifyMessage(msg_data.msg);
            return;
        }

        if(msg_data['c'] == 'stxt') {
            AddServerText(msg_data.msg);
            return;
        }

        if(msg_data['c'] == 'map_list') {
            if(msg_data['server_id'] != connection_data.requested_create_server) {
                console.log("Invalid map list for requested server");
            }

            ShowGameCreate(msg_data['maps'], msg_data.server_id);
        }

        if(msg_data['c'] == 'join_game') {
            HandleGameDataUpdate(msg_data["data"]);

            UpdateGameLobbyMapInfo();

            if(game_data.m_Started == false) {
                ShowGameLobby();
            }
        }

        if(msg_data['c'] == 'game') {
            HandleGameDataUpdate(msg_data["data"]);
        }

        if(msg_data['c'] == 'game_preview') {
            if(msg_data.request_id == chat_data.preview_request_id) {
                HandleGamePreviewDataUpdate(msg_data["data"]);
            }
        } 

        if(msg_data['c'] == 'game_preview_cancel') {
            CloseGamePreview();
        }

        if(msg_data['c'] == 'start_game') {
            HideGameLobby();

            console.log("Playing online ");
            window.PlayOnlineExecute(msg_data['ip_addr'], msg_data['port'], msg_data['token']);
        }

        if(msg_data['c'] == 'reset_game') {
            HideGameLobby();
        }

        if(msg_data['c'] == 'game_chat') {
            AddGameChat(msg_data);
        }

        if(msg_data['c'] == 'game_msg') {
            AddGameMessage(msg_data);
        }

        if(msg_data['c'] == 'user_stats') {
            GotStats(msg_data);
        }

        if(msg_data['c'] == 'edit_lobby_info') {
            GotLobbyInfoForEdit(msg_data['data']);
        }

        if(msg_data['c'] == 'edit_channel_info') {
            GotChannelInfoForEdit(msg_data['data'], msg_data['channel_id']);
        }
    }
}

function SendUserName(username) {
    var msg_data = {
        'uname': username
    };

    SendSocketMessage(msg_data);
}

function SendChat(message) {
    SendChatToChannel(message, chat_data.current_channel);
}

function SendChatToChannel(message, channel_id) {
    if(connection_data.state != ConnectionState.Connected) {
        return;
    }

    connection_data.got_initial_data = true;

    var msg_data = {
        'c': 'chat',
        'msg': message,
        'channel_id': channel_id
    };

    SendSocketMessage(msg_data);
}

function SendGameChat(message) {
    if(connection_data.state != ConnectionState.Connected) {
        return;
    }

    var msg_data = {
        'c': 'game_chat',
        'msg': message
    };

    SendSocketMessage(msg_data);
}

function SignOut() {
    if(connection_data.socket != null) {
        connection_data.socket.onopen = null;
        connection_data.socket.onerror = null;
        connection_data.socket.onmessage = null;
        connection_data.socket.onclose = null;
        connection_data.socket.close();
    }

    connection_data.state = ConnectionState.Disconnected;
    connection_data.is_relocating = false;
    connection_data.relocation_token = null,
    connection_data.relocation_messages = [];
    SetupInitialView();
}

function RequestConnect(ticket, mode) {
    connection_data.ticket = ticket;
    connection_data.mode = mode;

    if(mode != 'relocate') {
        connection_data.is_relocating = false,
        connection_data.relocation_token = null,
        connection_data.relocation_messages = []
        connection_data.got_load_balancer_result = false;

        if(connection_data.bypass_load_balancer) {
            var server = servers[Math.floor(Math.random() * servers.length)];

            connection_data.remote_host = server[0];
            connection_data.remote_port = server[1];
            connection_data.got_load_balancer_result = true;
            FinalizeConnect();
        } else {

            var lb = load_balancers[Math.floor(Math.random() * load_balancers.length)];

            connection_data.socket = new WebSocket('ws://' + lb[0] + ':' + lb[1]);
            connection_data.socket.onmessage = HandleLoadBalancerData;
            connection_data.socket.onclose = HandleLoadBalancerClosed;
        }
    } else {
        FinalizeConnect();
    }
}

function FinalizeConnect() {

    if(connection_data.state == ConnectionState.Disconnected || connection_data.state == ConnectionState.Relocating) {
        console.log("Requesting connect to server");
        connection_data.state = ConnectionState.Connecting;

        connection_data.got_initial_data = false;

        connection_data.socket = new WebSocket('ws://' + connection_data.remote_host + ':' + connection_data.remote_port);
        connection_data.socket.onopen = HandleSocketConnected;
        connection_data.socket.onerror = HandleSocketError;
        connection_data.socket.onmessage = HandleSocketMessage;
        connection_data.socket.onclose = HandleSocketClosed;
    }
}

function RequestDisconnect() {
    if(connection_data.state != ConnectionState.Disconnected) {
        connection_data.state = ConnectionState.Disconnected;
        connection_data.socket.close();
    }
}

function RequestMapList(server_id) {
    var msg_data = {
        'c': 'req_maps',
        'server_id': server_id
    };
    SendSocketMessage(msg_data);
    connection_data.requested_create_server = server_id;
}

function RequestCreateGame(map, game_name, password, score_limit, time_limit, player_limit, server_id) {
    var msg_data = {
        'c': 'create_game',
        'server_id': server_id || connection_data.requested_create_server,
        'password': password,
        'create_data': {
            'm_Name': game_name,
            'm_Map': map,
            'm_ScoreLimit': score_limit,
            'm_TimeLimit': time_limit,
            'm_PlayerLimit': player_limit
        }
    };

    SendSocketMessage(msg_data);
}

function RequestCancelPreviewGame(server_id, game_id) {
    var msg_data = {
        'c': 'cancel_preview'
    };
    SendSocketMessage(msg_data);    
}

function RequestJoinGame(server_id, game_id, password, observer) {
    var msg_data = {
        'c': 'join_game',
        'server_id': server_id,
        'game_id': game_id,
        'password': password,
        'observer': observer
    };
    SendSocketMessage(msg_data);
}

function RequestDestroyGame(server_id, game_id) {
    var msg_data = {
        'c': 'destroy_game',
        'server_id': server_id,
        'game_id': game_id
    };
    SendSocketMessage(msg_data);
}

function RequestSwitchTeams() {
    var msg_data = {
        'c': 'switch_teams'
    };
    SendSocketMessage(msg_data);
}

function RequestStartGame() {
    var msg_data = {
        'c': 'start_game'
    };
    SendSocketMessage(msg_data);
}

function RequestLeaveGame() {
    var msg_data = {
        'c': 'leave_game'
    };
    SendSocketMessage(msg_data);
}

function RequestPersistenChange(name, value) {

    var change = "kSet ." + name + " " + value;

    var msg_data = {
        'c': 'change_persistent',
        'change': change
    }
    SendSocketMessage(msg_data);
}