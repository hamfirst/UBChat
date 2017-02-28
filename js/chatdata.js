
var chat_data = {
    current_channel: 0,
    all_channels: [],
    all_chat_messages: {},
    preview_request_id: -1,
    preview_server_id: 0,
    preview_game_id: 0
};

function ResetChatData() {
    chat_data.current_channel = 0;
    chat_data.all_channels = [];
    chat_data.all_chat_messages = {};
}

function NotifyMessage(msg) {
    notific8(msg, { theme: 'materialish', color: 'twilight', horizontalEdge: 'bottom', life:5000 });
}

function AddChat(chat_msg, update_new_text) {

    var channel_id = chat_msg['channel_id'];
    if(channel_id in chat_data.all_chat_messages == false) {
        chat_data.all_chat_messages[channel_id] = [];
    }

    var html_data = GenerateChatHTML(chat_msg);
    chat_data.all_chat_messages[channel_id].push(html_data);

    if(channel_id == chat_data.current_channel) {
        AddChatToHTML(html_data);
    } else if(update_new_text) {
        UpdateChannelNewText(channel_id);
    }
}

function AddServerText(msg) {
    if(chat_data.all_channels.length == 0) {
        NotifyMessage(msg);
        return;
    }
    var chat_msg = {
        'c': 'stxt',
        'msg': msg,
    };

    if(chat_data.current_channel in chat_data.all_chat_messages == false) {
        chat_data.all_chat_messages[chat_data.current_channel] = [];
    } 

    var html_data = GenerateChatHTML(chat_msg);
    chat_data.all_chat_messages[chat_data.current_channel].push(html_data);
    AddChatToHTML(html_data);
}

function AddChatChannel(channel_data) {
    var channel_info = {
        channel_name: channel_data.m_Name,
        channel_id: channel_data.m_ChannelKey,
        channel_motd: channel_data.m_Motd,
        channel_locked: channel_data.m_Locked,
        channel_new_text: false,
        users: []
    };

    for(var index = 0; index < channel_data.m_Users.length; index++) {
        var user_data = channel_data.m_Users[index];
        var user_info = {
            user_name: user_data.m_Name,
            user_id: user_data.m_UserKey,
            icon: user_data.m_Icon
        };

        channel_info.users.push(user_info);
    }

    chat_data.all_channels.push(channel_info);
    AddChatChannelHTML(channel_info.channel_name, channel_info.channel_id, channel_info.channel_locked);

    if(chat_data.all_channels.length == 1) {
        SetCurrentChannel(channel_info.channel_id);
    }
}

function UpdateChannel(channel_id, channel_name, channel_locked) {
    for(var index = 0; index < chat_data.all_channels.length; index++) {
        if(chat_data.all_channels[index].channel_id == channel_id) {
            chat_data.all_channels[index].channel_locked = channel_locked;
            chat_data.all_channels[index].channel_name = channel_name;

            UpdateChatChannelHTML(channel_id, channel_name, channel_locked, chat_data.all_channels[index].channel_new_text);
        }
    }
}

function UpdateChannelNewText(channel_id) {
    if(channel_id == chat_data.current_channel) {
        return;
    }

    for(var index = 0; index < chat_data.all_channels.length; index++) {
        if(chat_data.all_channels[index].channel_id == channel_id) {
            chat_data.all_channels[index].channel_new_text = true;

            UpdateChatChannelHTML(channel_id, chat_data.all_channels[index].channel_name, chat_data.all_channels[index].channel_locked, true);
        }
    }
}

function RemoveChatChannel(channel_id) {

    for(var index = 0; index < chat_data.all_channels.length; index++) {
        if(chat_data.all_channels[index].channel_id == channel_id) {
            RemoveChatChannelHTML(channel_id);

            if(channel_id == chat_data.current_channel && chat_data.all_channels.length > 1) {
                if(index == chat_data.all_channels.length - 1)  {
                    SetCurrentChannel(chat_data.all_channels[index - 1].channel_id);
                } else{
                    SetCurrentChannel(chat_data.all_channels[index + 1].channel_id);
                }
            } else if(chat_data.all_channels.length <= 1) {
                ClearChatHTML();
                ClearChatPlayerHTML();
            }

            chat_data.all_channels.splice(index, 1);

            if(channel_id in chat_data.all_chat_messages) {
                delete chat_data.all_chat_messages[channel_id];
            }
            return;
        }
    }
}

function AddChatPlayer(channel_id, user_data) {
    for(var index = 0; index < chat_data.all_channels.length; index++) {
        if(chat_data.all_channels[index].channel_id == channel_id) {
            var user_info = {
                user_name: user_data.m_Name,
                user_id: user_data.m_UserKey,
                plat_id: user_data.m_PlatformId,
                squad: user_data.m_SquadTag,
                icon: user_data.m_Icon,
                in_game: user_data.m_Game.m_GameServerId != 0
            };
            chat_data.all_channels[index].users.push(user_info);

            if(chat_data.all_channels[index].channel_id == chat_data.current_channel) {
                AddChatPlayerHTML(channel_id, user_info);
            }
            break;
        }
    }
}

function UpdateChatPlayer(channel_id, user_id, user_data) {
    for(var index = 0; index < chat_data.all_channels.length; index++) {
        if(chat_data.all_channels[index].channel_id == channel_id) {
            var user_info = {
                user_name: user_data.m_Name,
                user_id: user_data.m_UserKey,
                plat_id: user_data.m_PlatformId,
                squad: user_data.m_SquadTag,
                icon: user_data.m_Icon,
                in_game: user_data.m_Game.m_GameServerId != 0,
            };

            for(var user_index = 0; user_index < chat_data.all_channels[index].users.length; user_index++) {
                if(chat_data.all_channels[index].users[user_index].user_id == user_data.m_UserKey) {
                    chat_data.all_channels[index].users[user_index] = user_info;
                }
            }

            if(chat_data.all_channels[index].channel_id == chat_data.current_channel) {
                UpdateChatPlayerHTML(channel_id, user_id, user_info);
            }
            break;
        }
    }
}

function RemoveChatPlayer(channel_id, user_id) {
    for(var index = 0; index < chat_data.all_channels.length; index++) {
        if(chat_data.all_channels[index].channel_id == channel_id) {

            for(var user_index = 0; user_index < chat_data.all_channels[index].users.length; user_index++) {
                if(chat_data.all_channels[index].users[user_index].user_id == user_id) {
                    chat_data.all_channels[index].users.splice(user_index, 1);
                    break;
                }
            }

            if(chat_data.all_channels[index].channel_id == chat_data.current_channel) {
                RemoveChatPlayerHTML(user_id);
            }
            break;
        }
    }
}

function AddChatBot(channel_id, bot_data) {
    for(var index = 0; index < chat_data.all_channels.length; index++) {
        if(chat_data.all_channels[index].channel_id == channel_id) {
            var user_info = {
                user_name: bot_data.m_Name,
                user_id: bot_data.m_BotKey,
                plat_id: 0,
                squad: "",
                icon: "img/icons/bot.png",
                in_game: false
            };

            chat_data.all_channels[index].users.push(user_info);

            if(chat_data.all_channels[index].channel_id == chat_data.current_channel) {
                AddChatPlayerHTML(channel_id, user_info);
            }
            break;
        }
    }
}

function ClearChatPlayers(channel_id) {
    for(var index = 0; index < chat_data.all_channels.length; index++) {
        if(chat_data.all_channels[index].channel_id == channel_id) {

            chat_data.all_channels[index].users = [];

            if(chat_data.all_channels[index].channel_id == chat_data.current_channel) {
                ClearChatPlayerHTML();
            }
            break;
        }
    }
}

function SetCurrentChannel(channel_id) {
    if(chat_data.current_channel == channel_id) {
        return;
    }

    if(chat_data.current_channel != 0) {
        UnselectChatChannelHTML(chat_data.current_channel);
    }

    chat_data.current_channel = channel_id;
    SelectChatChannelHTML(channel_id);

    if(channel_id in chat_data.all_chat_messages) {
        var chat_messages = chat_data.all_chat_messages[channel_id];
        AddChatListToHTML(chat_messages);
    }
    else {
        ClearChatHTML();
    }

    for(var index = 0; index < chat_data.all_channels.length; index++) {
        if(chat_data.all_channels[index].channel_id == channel_id) {
            chat_data.all_channels[index].channel_new_text = false;
            AddChatPlayerListHTML(channel_id, chat_data.all_channels[index].users);
            break;
        }
    }
}

function AddServer(server_id, server_name, server_location, server_host, ping_port) {
    console.log("Adding server - " + server_name);
    var server_list = document.getElementById("server_list");
    
    var server_ping = GetServerPing(server_id);
    if(server_ping == null) {
        server_ping = " - ???";
    } else {
        server_ping = " - " + server_ping + "ms";
    }

    var html = '<div class="server_list_element" id="server_'+server_id+'" onclick="PingServer(\''+server_id+'\',\''+server_host+'\','+ping_port+');" ondblclick="PickServer(\''+server_id+'\');">';
    html += '<img class="server_list_icon" src="img/flags/'+server_location+'.png" />&nbsp; ';
    html += htmlify(server_name);
    html += '&nbsp;<div id="server_ping_'+server_id+'" style="display:inline;">'+server_ping+'</div>';
    html += '</div>';

    server_list.innerHTML += html;
}

function AddServerGame(server_id, game_id, game_name, map_name, cur_players, cur_observers, started, max_players, password_protected) {
    var server_elem = document.getElementById('server_'+server_id);
    if(server_elem == null) {
        return;
    }

    var game_elem_id = 'server_game_' + server_id + '_' + game_id;

    var player_text = '(' + cur_players + ')';
    var game_html = '<div id="'+game_elem_id+'" class="server_list_game"';
    game_html += ' onclick="ClickGame(\''+server_id+'\',\''+game_id+'\');"';
    game_html += ' oncontextmenu="ClickGame(\''+server_id+'\',\''+game_id+'\');">';

    if(password_protected) {
        game_html += '<img src="img/icons/lock.png" />'
    }

    var observer_text = "";
    if(cur_observers > 0) {
        observer_text = '('+cur_observers+' obs)';
    } else {
        observer_text = '';
    }

    game_html += '<img id="'+game_elem_id+'_started" src="img/icons/ingame.png" style="display:'+(started ? 'inline' : 'none')+'" />';
    game_html += '(<div id="'+game_elem_id+'_players" style="display:inline;">'+cur_players+'</div>/'+max_players+') ';
    game_html += '<div id="'+game_elem_id+'_obs" style="display:inline;">'+observer_text+'</div>';
    game_html += ' '+map_name+' - '+htmlify(game_name)+'</div>';
    server_elem.innerHTML += game_html;
}

function UpdateServerGame(server_id, game_id, cur_players, cur_observers, started) {
    var game_elem_id = 'server_game_' + server_id + '_' + game_id;
    var cur_players_elem = document.getElementById(game_elem_id + '_players');
    var cur_obs_elem = document.getElementById(game_elem_id + '_obs');
    var started_img = document.getElementById(game_elem_id + '_started');

    cur_players_elem.innerHTML = cur_players;

    if(cur_observers > 0) {
        cur_obs_elem.innerHTML = '('+cur_observers+' obs)';
    } else {
        cur_obs_elem.innerHTML = '';
    }

    if(started) {
        started_img.style.display = "inline";
    } else {
        started_img.style.display = "hidden";
    }
}

function RemoveServerGame(server_id, game_id) {
    var game_elem = document.getElementById('server_game_' + server_id + '_' + game_id);
    if(game_elem == null) {
        return;
    }

    game_elem.remove();
}

function UpdateGameLobbyMapInfo() {
    var html = "Game Name: " + htmlify(game_data.m_InstanceData.m_Name) + "<br />"
    html += "Map: " + game_data.m_InstanceData.m_Map + "<br />";
    html += "Server: " + game_data.m_Server + "<br />";
    html += "Host: " + htmlify(game_data.m_Creator) + "<br />";

    if(game_data.m_InstanceData.m_ScoreLimit != 0) {
        html += "Score Limit: " + game_data.m_InstanceData.m_ScoreLimit + "<br />";
    }

    if(game_data.m_InstanceData.m_TimeLimit != 0) {
        html += "Time Limit: " + game_data.m_InstanceData.m_TimeLimit + " Minutes<br />";
    }

    document.getElementById("game_lobby_map_info").innerHTML = html;
}

function AddGamePlayer(player_id, player_name, team) {
    var player_list = document.getElementById("game_team_"+team);
    player_list.innerHTML += '<div id="game_player_'+player_id+'" class="player_list_element game_player_list_element">' + player_name + '</div>';
}

function RemoveGamePlayer(player_id) {
    var player_elem = document.getElementById('game_player_'+player_id);
    if(player_elem != null) {
        player_elem.remove();
    }
}

function AddGameChat(chat_msg) {
    var scroll_to_bot = false;
    if(dom_data.gamechatarea.clientHeight >= dom_data.gamechatarea.scrollHeight ||
       dom_data.gamechatarea.scrollHeight - (dom_data.gamechatarea.scrollTop + dom_data.gamechatarea.clientHeight) < 5) {
        scroll_to_bot = true;
    }

    var html = '<div class="chat_element_text" style="margin-left:0;"><div class="chat_element_name" style="display:inline;float:none;margin-right:0;">' + htmlify(chat_msg.user) + ':</div>&nbsp';
    html += ProcessText(chat_msg.msg) + '</div>';
    dom_data.gamechatarea.innerHTML += html;

    if(scroll_to_bot && dom_data.gamechatarea.scrollHeight >= dom_data.gamechatarea.clientHeight) {
        dom_data.gamechatarea.scrollTop = dom_data.gamechatarea.scrollHeight - dom_data.gamechatarea.clientHeight;
    }
}

function AddGameMessage(chat_msg) {
    var scroll_to_bot = false;
    if(dom_data.gamechatarea.clientHeight >= dom_data.gamechatarea.scrollHeight ||
       dom_data.gamechatarea.scrollHeight - (dom_data.gamechatarea.scrollTop + dom_data.gamechatarea.clientHeight) < 5) {
        scroll_to_bot = true;
    }

    var html = '<div class="chat_element_text" style="margin-left:0;">';
    html += "*** " + chat_msg.msg + ' *</div>';
    dom_data.gamechatarea.innerHTML += html;

    if(scroll_to_bot && dom_data.gamechatarea.scrollHeight >= dom_data.gamechatarea.clientHeight) {
        dom_data.gamechatarea.scrollTop = dom_data.gamechatarea.scrollHeight - dom_data.gamechatarea.clientHeight;
    }
}

function ClearGamePlayerList() {
    var html = "";

    for(var index = 0; index < game_data.m_MaxTeams; index++) {
        var team_name = GetTeamName(index);
        var team_color = GetTeamColor(index);

        html += '<div id="game_team_'+index+'" class="player_list_element" style="background-color:'+team_color+';">&nbsp;'+team_name+'</div>';
    }

    var team_name = GetTeamName(4);
    var team_color = GetTeamColor(4);

    html += '<div id="game_team_4" class="player_list_element" style="background-color:'+team_color+';">&nbsp;'+team_name+'</div>';

    var player_list = document.getElementById("game_lobby_player_list");
    player_list.innerHTML = html;
}

function UpdateServerPing(server_id, ms) {
    var ping_elem = document.getElementById("server_ping_" + server_id);
    if(ping_elem == null) {
        console.log("Could not find element");
        return;
    }

    ping_elem.innerHTML = " - " + ms + "ms";
}

function RemoveServer(server_id) {
    var server_elem = document.getElementById("server_" + server_id);
    server_elem.remove();
}

function ClearServerList() {
    var server_list = document.getElementById("server_list");
    server_list.innerHTML = "";
}

function OpenGamePreview(server_id, game_id) {
    chat_data.preview_request_id += 1;
    chat_data.preview_server_id = server_id;
    chat_data.preview_game_id = game_id;

    var msg = {
        'c': 'preview_game',
        'server_id': server_id,
        'game_id': game_id,
        'request_id': chat_data.preview_request_id
    };

    SendSocketMessage(msg);

    var bkg = document.getElementById("game_preview_bkg");
    var container = document.getElementById("game_preview_container");
    var loading = document.getElementById("game_preview_loading");
    var info = document.getElementById("game_preview");
    
    bkg.style.display = "block";
    container.style.display = "block";
    loading.style.display = "block";
    info.style.display = "none";
}

function CloseGamePreview() {
    chat_data.preview_request_id += 1;

    var bkg = document.getElementById("game_preview_bkg");
    var container = document.getElementById("game_preview_container");

    bkg.style.display = "none";
    container.style.display = "none";

    var msg = {
        'c': 'cancel_preview'
    };

    SendSocketMessage(msg);
 
}

function AddGamePreviewPlayer(player_id, player_name, team) {

    var loading = document.getElementById("game_preview_loading");
    var info = document.getElementById("game_preview");

    loading.style.display = "none";
    info.style.display = "block";

    var player_list = document.getElementById("game_preview_team_"+team);
    player_list.innerHTML += '<div id="game_preview_player_'+player_id+'" class="player_list_element game_player_list_element">' + player_name + '</div>';
}

function RemoveGamePreviewPlayer(player_id) {
    var player_elem = document.getElementById('game_preview_player_'+player_id);
    if(player_elem != null) {
        player_elem.remove();
    }
}

function ClearGamePreviewPlayerList() {
    var html = "";

    for(var index = 0; index < game_preview_data.m_MaxTeams; index++) {
        var team_name = GetTeamName(index);
        var team_color = GetTeamColor(index);

        html += '<div id="game_preview_team_'+index+'" class="player_list_element" style="background-color:'+team_color+';">&nbsp;'+team_name+'</div>';
    }

    var team_name = GetTeamName(4);
    var team_color = GetTeamColor(4);

    html += '<div id="game_preview_team_4" class="player_list_element" style="background-color:'+team_color+';">&nbsp;'+team_name+'</div>';

    var player_list = document.getElementById("game_preview_player_list");
    player_list.innerHTML = html;
}

function UpdatePreviewScore() {
    var label = document.getElementById("game_preview_score_label");
    var elem = document.getElementById("game_preview_score");

    label.style.display = game_preview_data.m_Started ? "block" : "none";
    elem.innerHTML = game_preview_data.m_Score;
}

function GamePreviewJoin() {
    JoinGame(chat_data.preview_server_id, chat_data.preview_game_id, null, false);
    CloseGamePreview();
}

function GamePreviewObserve() {
    JoinGame(chat_data.preview_server_id, chat_data.preview_game_id, null, true);
    CloseGamePreview();
}

function JoinQuickPlayGame() {   
    var server_list = GetCurrentServerListWithPings(server_data.m_ServerList);

    for(var index in server_list) {
        
        var current_server = server_list[index];
        if(current_server.ping > 200) {
            continue;
        }
        
        for(var current_game_id in current_server.m_Games) {
            if(IsValidQuickPlayGame(current_server.m_Games[current_game_id])) {
                RequestJoinGame(current_server.id, current_game_id, "", false);
                return;
            }
        }
    }    

    RequestCreateGame("FreshCourt", "Quick Play Match", "", 10, false, 6, server_list[0].id);
}

function IsValidQuickPlayGame(game) {
    var valid_game = true;
    
    if(game.m_Map === "Hockey") {
        valid_game = false;
    }

    if(game.m_MaxPlayers === game.m_CurPlayers) {
        valid_game = false;
    }

    if(game.m_PasswordProtected) {
        valid_game = false;
    }
    
    return valid_game;
}

function GetCurrentServerListWithPings(server_list) {

    var pinged_server_list = [];
    
    Object.keys(server_list).forEach(function(key) {
        pinged_server_list.push(server_data.m_ServerList[key]);
        pinged_server_list[pinged_server_list.length - 1].ping = GetServerPing(key);
        pinged_server_list[pinged_server_list.length - 1].id = key
    });
    
    pinged_server_list.sort(function(a,b) {
        return a.ping - b.ping;
    });

    return pinged_server_list;
}
