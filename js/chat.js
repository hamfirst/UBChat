

var mode_chat_html =` 

<img id="background" src="img/background.jpg" />
<img id="chat_logo" src="img/ublogo_normal.png" />
<div id="player_list_toggle" onclick="TogglePlayerList();"></div>

<div id="chat_container" class="general_box">
    <div id="channel_header" class="strong_header">
        Channels:
    </div>
    <hr class="header_separator" />
    <div id="chat_content_container">
        <div id="channel_list">
        </div>
        <div id="chat_area_bkg">
        </div>
        <input id="chat_input" type="text" name="text_input" placeholder="Enter Chat Here" />
    </div>
</div>
<div id="player_list_container" class="general_box">
    <div id="player_list_header" class="weak_header" onclick="TogglePlayerSort();">Players In Channel (<span id="player_list_count">0</span>)</div>
    <div id="player_list" class="blue_interior">
    </div>
</div>
<div id="options_container" >
    <ul id="options_list" class="options_list">
        <li class="options_list_elem" onclick="OpenSquadUI();"><a>Squad</a></li>
        <li class="options_list_elem" onclick="OpenProfile();"><a>Profile</a></li>
        <li class="options_list_elem" onclick="OpenControlPopup();"><a><img src="img/icons/settings.png" style="height:17px;margin-right:20px;"></a></li>
    </ul>
</div>
<div id="server_list_container" class="blue_box">
    <div id="channel_header" class="strong_header">
        Game List:
    </div>
    <button id="server_list_create_game" class="style3" onclick="ShowServerList();">Create Game</button>
    <div id="server_list" class="blue_interior">
    </div>
</div>
<div id="lobby_info_container">
    
</div>
<div id="game_lobby_bkg" class="popup_bkg" style="z-index:3;display:none;"></div>
<div id="game_lobby_container" class="blue_box game_lobby_container game_lobby_container_full" style="display:none">
    <div class="weak_header">
        Pre-Game Lobby
    </div>
    <div id="game_lobby_player_list" class="blue_interior">
    </div>
    <div id="game_lobby_map_info" class="blue_box">
    </div>
    <button id="game_lobby_start_button" class="style3" onclick="RequestStartGame();">Start</button>
    <button id="game_lobby_leave_button" class="style3" onclick="RequestLeaveGame();">Leave</button>
    <button id="game_lobby_switch_button" class="style3" onclick="RequestSwitchTeams();">Switch</button>
    <div id="game_lobby_chat_area_bkg">
    </div>
    <input id="game_lobby_chat_input" type="text" name="text_input" placeholder="Enter Chat Here" />
    <div id="game_lobby_expand" class="popup_close"><a style="padding-top:2px" onclick="ExpandGameLobby();">[]</a></div>
</div>
<div id="game_preview_bkg" class="popup_bkg" style="z-index:3;display:none;"></div>
<div id="game_preview_container" class="cyan_bkg">
    <div id="game_preview_close" class="popup_close"><a style="padding-top:2px" onclick="CloseGamePreview();">x</a></div>
    <div class="weak_header">
        Players In Game
    </div>
    <div id="game_preview_loading">
        <div class="weak_header" style="margin-left: 120px; margin-top:50px;">Loading...</div>
    </div>
    <div id="game_preview" style="display:none">
        <div id="game_preview_player_list" class="blue_interior">
        </div>
        <div id="game_preview_score_label", class="weak_header">Score:</div>
        <div id="game_preview_score"></div>
        <button id="game_preview_join_button" class="style3" onclick="GamePreviewJoin();">Join</button>
        <button id="game_preview_observe_button" class="style3" onclick="GamePreviewObserve();">Observe</button>
    </div>
</div>
`;


var local_data = {};
var server_data = {};
var game_data = {};
var game_preview_data = {};
var chat_callback_list = [];
var server_callback_list = [];
var game_callback_list = [];
var game_preview_callback_list = [];
var post_change_callbacks = [];

function ResetChatCallbacks() {
    local_data = {};
    server_data = {};
    game_data = {};
    chat_callback_list = [];
    server_callback_list = [];
    game_callback_list = [];
}

function InitializeChatCallbacks() {
    
    CreateChangeCallback(chat_callback_list, local_data, ".m_Name", function(uname) { console.log("New username is: " + uname); });
    
    CreateListChangeCallback(chat_callback_list, local_data, ".m_Channels", 
        function(idx, val) { 
            console.log("New channel " + val.m_Name);
            
            AddChatChannel(val);
            var channel_id = val.m_ChannelKey;
            var channel_index = Number(idx);

            CreateChangeCallback(chat_callback_list, local_data, ".m_Channels[" + idx + "].m_Motd", function(motd) {
                if(motd != "") {
                    AddChat({'c': 'motd', 'msg': motd, 'channel_id': val.m_ChannelKey}, false);
                }
            });
            
            CreateListChangeCallback(chat_callback_list, local_data, ".m_Channels[" + idx + "].m_Users", 
                function(idx, val, adding_list) {
                    console.log("New user " + val.m_Name);
                    
                    if(!adding_list && local_data.m_Persistent.m_EnterExitMessages) {
                        AddChat({'c': 'stxt', 'msg': val.m_Name + ' has joined the channel.', 'channel_id': channel_id});
                    }
                    
                    AddChatPlayer(channel_id, val);
                },
                function(idx, val) {
                    console.log("User changed " + idx);
                    UpdateChatPlayer(channel_id, idx, val);
                },
                function(idx) {
                    console.log("User removed " + idx + " channel " + channel_index);
                    
                    var user = local_data.m_Channels[channel_index].m_Users[idx];

                    if(local_data.m_Persistent.m_EnterExitMessages) {
                        AddChat({'c': 'stxt', 'msg': user.m_Name + ' has left the channel.', 'channel_id': channel_id});
                    }
                    RemoveChatPlayer(channel_id, local_data.m_Channels[channel_index].m_Users[idx].m_UserKey);
                },
                function() {
                    console.log("Users cleared " + idx);
                    ClearChatPlayers(channel_id);
                });

            CreateListChangeCallback(chat_callback_list, local_data, ".m_Channels[" + idx + "].m_Bots", 
                function(idx, val) {
                    console.log("New bot " + val.m_Name);
                    AddChatBot(channel_id, val);
                },
                function(idx, val) {
                    console.log("Bot changed " + idx);
                },
                function(idx) {
                    console.log("Bot removed " + idx + " channel " + channel_index);
                    RemoveChatPlayer(channel_id, local_data.m_Channels[channel_index].m_Bots[idx].m_BotKey);
                },
                function() {
                    console.log("Bots cleared " + idx);
                });                

            if(connection_data.got_initial_data) {
                SetCurrentChannel(channel_id);
            }
        },
        function(idx, val) {
            console.log("Updated channel" + idx);
            UpdateChannel(val.m_ChannelKey, val.m_Name, val.m_Locked);
        },
        function(idx) {
            console.log("Channel removed " + idx);
            RemoveChangeCallback(chat_callback_list, ".m_Channels[" + idx + "].m_Motd");     
            RemoveChangeCallback(chat_callback_list, ".m_Channels[" + idx + "].m_Users");    
            RemoveChangeCallback(chat_callback_list, ".m_Channels[" + idx + "].m_Bots");   
            
            if(idx in local_data.m_Channels) {
                RemoveChatChannel(local_data.m_Channels[idx].m_ChannelKey);
            }
        },
        function() {
            console.log("Channels cleared");
        });

    CreateListChangeCallback(server_callback_list, server_data, ".m_ServerList",
        function(idx, val) {
            AddServer(idx, val.m_Name, val.m_Location, val.m_Host, val.m_PingPort);
            PingServer(idx, val.m_Host, val.m_PingPort);

            var server_id = idx;

            CreateListChangeCallback(server_callback_list, server_data, ".m_ServerList[" + idx + "].m_Games",
                function(idx, val) {
                    console.log("Game " + val.m_Name);
                    AddServerGame(server_id, idx, val.m_Name, val.m_Map, val.m_CurPlayers, val.m_CurObservers, val.m_Started, val.m_MaxPlayers, val.m_PasswordProtected);
                },
                function(idx, val) {
                    console.log("Game changed " + idx);
                    UpdateServerGame(server_id, idx, val.m_CurPlayers, val.m_CurObservers, val.m_Started);
                },
                function(idx) {
                    console.log("Game removed " + idx + " server " + server_id);
                    RemoveServerGame(server_id, idx);
                },
                function() {
                    console.log("Games cleared " + idx);
                });
        },
        function (idx, val) {},
        function (idx) {
            RemoveServer(idx);
        },
        function() {
            ClearServerList();
        });

    CreateListChangeCallback(game_callback_list, game_data, ".m_Players", 
        function(idx, val) {
            console.log("New game player " + val.m_Name);
            AddGamePlayer(idx, val.m_Name, val.m_Team);
        },
        function(idx, val) {
            console.log("Game player changed " + idx);
            RemoveGamePlayer(idx);
            AddGamePlayer(idx, val.m_Name, val.m_Team);
        },
        function(idx) {
            console.log("Game player removed " + idx);
            RemoveGamePlayer(idx);
        },
        function() {
            console.log("Game players cleared ");
            ClearGamePlayerList();
        });   
        

    CreateListChangeCallback(game_preview_callback_list, game_preview_data, ".m_Players", 
        function(idx, val) {
            AddGamePreviewPlayer(idx, val.m_Name, val.m_Team);
        },
        function(idx, val) {
            RemoveGamePreviewPlayer(idx);
            AddGamePreviewPlayer(idx, val.m_Name, val.m_Team);
        },
        function(idx) {
            RemoveGamePreviewPlayer(idx);
        },
        function() {
            ClearGamePreviewPlayerList();
        });   


    CreateChangeCallback(game_callback_list, game_data, ".m_Creator", function(creator) { UpdateGameCreator(); });

    CreateChangeCallback(chat_callback_list, local_data, ".m_Title", function(icon) { SyncTitle(); });
    CreateChangeCallback(chat_callback_list, local_data, ".m_IconURL", function(icon) { SyncIcon(); });
    CreateChangeCallback(chat_callback_list, local_data, ".m_PrimarySquad", function(icon) { SyncPrimarySquad(); });

    CreateChangeCallback(game_preview_callback_list, game_preview_data, ".m_Started", function(score) { UpdatePreviewScore(); });
    CreateChangeCallback(game_preview_callback_list, game_preview_data, ".m_Score", function(score) { UpdatePreviewScore(); });

    CreateListBinding(auto_join_list, ".m_AutoJoinChannels", chat_callback_list, local_data);

    disable_profile_sync = true;

    CreateListChangeCallback(chat_callback_list, local_data, ".m_TitleList",   
        function(idx, val) { AddPostChangeCallback(SyncProfileOptions); },
        function(idx, val) { AddPostChangeCallback(SyncProfileOptions); },
        function(idx) { AddPostChangeCallback(SyncProfileOptions); },
        function() { AddPostChangeCallback(SyncProfileOptions); });          

    CreateListChangeCallback(chat_callback_list, local_data, ".m_IconNames",   
        function(idx, val) { AddPostChangeCallback(SyncProfileOptions); },
        function(idx, val) { AddPostChangeCallback(SyncProfileOptions); },
        function(idx) { AddPostChangeCallback(SyncProfileOptions); },
        function() { AddPostChangeCallback(SyncProfileOptions); });

    CreateListChangeCallback(chat_callback_list, local_data, ".m_Squads",   
        function(idx, val) { AddPostChangeCallback(SyncProfileSquads); },
        function(idx, val) { AddPostChangeCallback(SyncProfileSquads); },
        function(idx) { AddPostChangeCallback(SyncProfileSquads); },
        function() { AddPostChangeCallback(SyncProfileSquads); });       
}

function AddPostChangeCallback(func) {
    post_change_callbacks.push(func);
}

function CallPostChangeCallbacks() {
    var num_callbacks = post_change_callbacks.length;
    for(var index = 0; index < num_callbacks; index++) {
        post_change_callbacks[index]();
    }

    post_change_callbacks = [];
}

function HandleLocalDataUpdate(change_data) {
    var change = ParseChangeNotification(change_data);
    
    if(change["op"] == "kRemove" || change["op"] == "kClear") {
        CallChangeCallbacks(change, chat_callback_list, local_data);
        local_data = ApplyChangeNotification(change, local_data);
    }
    else {
        local_data = ApplyChangeNotification(change, local_data);
        CallChangeCallbacks(change, chat_callback_list, local_data);
    }

    CallPostChangeCallbacks();
}

function HandleServerDataUpdate(change_data) {
    var change = ParseChangeNotification(change_data);

    if(change["op"] == "kRemove" || change["op"] == "kClear") {
        CallChangeCallbacks(change, server_callback_list, server_data);
        server_data = ApplyChangeNotification(change, server_data);
    }
    else {
        server_data = ApplyChangeNotification(change, server_data);
        CallChangeCallbacks(change, server_callback_list, server_data);
    }

    CallPostChangeCallbacks();
}

function HandleGameDataUpdate(change_data) {
    var change = ParseChangeNotification(change_data);

    if(change["op"] == "kRemove" || change["op"] == "kClear") {
        CallChangeCallbacks(change, game_callback_list, game_data);
        game_data = ApplyChangeNotification(change, game_data);
    }
    else {
        game_data = ApplyChangeNotification(change, game_data);
        CallChangeCallbacks(change, game_callback_list, game_data);
    }

    CallPostChangeCallbacks();
}

function HandleGamePreviewDataUpdate(change_data) {
    var change = ParseChangeNotification(change_data);

    if(change["op"] == "kRemove" || change["op"] == "kClear") {
        CallChangeCallbacks(change, game_preview_callback_list, game_preview_data);
        game_preview_data = ApplyChangeNotification(change, game_preview_data);
    }
    else {
        game_preview_data = ApplyChangeNotification(change, game_preview_data);
        CallChangeCallbacks(change, game_preview_callback_list, game_preview_data);
    }

    CallPostChangeCallbacks();
}

function ShowGameLobby() {
    dom_data.gamechatarea.innerHTML = "";

    if(dom_data.lobbycontainer.classList.contains("game_lobby_container_full") == false) {
        dom_data.lobbycontainer.classList.add("game_lobby_container_full");
    }

    dom_data.lobbycontainer.style.display = "block";
    dom_data.lobbybkg.style.display = "block";     

    UpdateGameCreator();
}

function UpdateGameCreator() {
    if(game_data.m_Creator == local_data.m_Name) {
        document.getElementById("game_lobby_start_button").style.display = "block";
    } else {
        document.getElementById("game_lobby_start_button").style.display = "none";
    }
}

function HideGameLobby() {
    if(dom_data.lobbycontainer.classList.contains("game_lobby_container_full") == false) {
        dom_data.lobbycontainer.classList.add("game_lobby_container_full");
    }

    dom_data.lobbycontainer.style.display = "none";
    dom_data.lobbybkg.style.display = "none";     
}

function ExpandGameLobby() {
    if(dom_data.lobbycontainer.classList.contains("game_lobby_container_full")) {
        dom_data.lobbycontainer.classList.remove("game_lobby_container_full");
        dom_data.lobbybkg.style.display = "none";     
    }
    else {
        dom_data.lobbycontainer.classList.add("game_lobby_container_full");
        dom_data.lobbybkg.style.display = "block";     
    }
}

function JoinGame(server_id, game_id, password, observer) {
    if(window.hasOwnProperty('ubfrontend') == false) {
        return;
    }

    if(server_id in server_data.m_ServerList == false) {
        return;
    }

    if(game_id in server_data.m_ServerList[server_id].m_Games == false) {
        return;
    }

    if(server_data.m_ServerList[server_id].m_Games[game_id].m_PasswordProtected && local_data.m_AdminLevel == 0 && (password == '' || password == null)) {
        ShowTextPrompt("Enter the password for this game", function (input_password) 
            { 
                JoinGame(server_id, game_id, input_password, observer); 
            });
    } else {
        RequestJoinGame(server_id, game_id, password, observer);
    }
}

function ClickGame(server_id, game_id) {

    var is_right_click = false;
    var e = window.event;

    if ("which" in e) {
        is_right_click = e.which == 3; 
    } else if ("button" in e) {
        is_right_click = e.button == 2; 
    }

    if(is_right_click == false) {
        OpenGamePreview(server_id, game_id);
    } else {
        var options = [
            ["Join Game", "JoinGame('"+server_id+"', '"+game_id+"', '', false)"],
            ["Observe Game", "JoinGame('"+server_id+"', '"+game_id+"', '', true)"]
        ];

        if(local_data.m_AdminLevel != 0 && window.hasOwnProperty('ubfrontend')) {
            options.push(null);
            options.push(["Destroy Game", "RequestDestroyGame('"+server_id+"', '"+game_id+"', '', true)"]);
        }

        if(options.length > 0) {
            CreatePopup(options);
        }
    }
}

function OpenControlPopup() {
    var options = [];

    if(window.hasOwnProperty("ubfrontend")) {
        options.push(["Settings", "OpenSettings(0);"]);
        options.push(null);
        options.push(["Play Offline", "PlayOffline();"]);
        options.push(["Play Replay", "PlayReplay();"]);
        options.push(null);
        options.push(["Online Support", "JoinSupport();"]);
        options.push(null);
    }

    options.push(["Sign Out", "SignOut();"]);
    if(options.length > 0) {
        CreatePopup(options);
    }
}

function ClickPlayer(user_id, plat_id, channel_id) {
    var options = [];
    
    if(plat_id != 0) {
        options.push(["View Stats", "OpenStats('"+user_id+"');"]);
    }

    if(local_data.m_UserKey != user_id && plat_id != 0 && window.hasOwnProperty('ubfrontend')) {
        options.push(["Message Player", "window.OpenChat('"+plat_id+"');"]);
        options.push(["Add as Friend", "window.AddFriend('"+plat_id+"');"]);
    }

    if(options.length > 0) {
        CreatePopup(options);
    }
}

function ClickChannel(channel_id) {
    var options = [["Leave Channel", "SendChatToChannel('/leave', '" + channel_id + "');"]];

    if(options.length > 0) {
        CreatePopup(options);
    }
}

function UpdateLobbyInfo(msg) {
    document.getElementById("lobby_info_container").innerHTML = msg;

}

function TogglePlayerList() {
    var player_list = document.getElementById("player_list_container");
    if(player_list.classList.contains("player_list_open")) {
        player_list.classList.remove("player_list_open");
    } else {
        player_list.classList.add("player_list_open");
    }
}

function JoinSupport() {
    SendChat("/join Support");
}

function SetupChatView() {
    ResetChatData();
    ResetChatCallbacks();

    AttachModeHTML(mode_chat_html, UIMode.Chat);

    dom_data = {
        chatarea: document.getElementById("chat_area_bkg"),
        chatinput: document.getElementById("chat_input"),
        channellist: document.getElementById('channel_list'),
        playerlist: document.getElementById('player_list'),
        lobbycontainer: document.getElementById('game_lobby_container'),
        lobbybkg: document.getElementById('game_lobby_bkg'),
        gamechatarea: document.getElementById('game_lobby_chat_area_bkg'),
        gamelobbychatinput: document.getElementById("game_lobby_chat_input")
    };

    dom_data.chatinput.addEventListener("keydown", HandleChatKeyDown);
    dom_data.gamelobbychatinput.addEventListener("keydown", HandleGameLobbyChatKeyDown);
    document.addEventListener("keydown", HandleShortcutKeyDown);
    
    var playerListDOM = dom_data.playerlist;
    var playerListObserver = new MutationObserver(function(events) {
        document.getElementById("player_list_count").innerHTML = dom_data.playerlist.childNodes.length;
    });
    
    var observeConfig = { childList: true };
    playerListObserver.observe(playerListDOM, observeConfig);

    if(window.hasOwnProperty('ubfrontend') == false) {
        document.getElementById("server_list_create_game").style.display = "none";
    }

    /*
    var users = [];
    for(var index = 0; index < 150; index++) {

        var user_info = {
            user_name: 'NickW',
            user_id: index,
            icon: index % 3
        };

        users.push(user_info);
    }

    AddChatPlayerListHTML(users);
    */
}

function TogglePlayerSort() {
    return;
    var new_sort_method = local_data.m_Persistent.m_PlayerListSort === 0 ? 1 : 0;
    RequestPersistenChange('m_PlayerListSort', new_sort_method);

    local_data.m_Persistent.m_PlayerListSort = new_sort_method;
    
    for(var x = 0; x < chat_data.all_channels.length; x++) {
        if(chat_data.all_channels[x].channel_id === chat_data.current_channel) {
            AddChatPlayerListHTML(chat_data.current_channel, chat_data.all_channels[x].users);
            break;
        }
    }
}