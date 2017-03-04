
function ProcessText(text, allow_newline) {
    emojione.ascii = true;
    var in_color = "";
    var in_underline = false;
    var in_ital = false;
    var in_bold = false;

    var result_text = "";
    var has_content = false;

    var text_len = text.length;
    for(var index = 0; index < text_len; index++) {
        if(text.substr(index, 4) == "www." ||
           text.substr(index, 7) == "http://" ||
           text.substr(index, 8) == "https://") {

            var space_end = text.indexOf(" ", index);
            var newline_end = text.indexOf("\n", index);
            var quote_end = text.indexOf("\"", index);

            if(space_end == -1) space_end = 10000000;
            if(newline_end == -1) newline_end = 10000000;
            if(quote_end == -1) quote_end = 10000000;

            var link_end = Math.min(space_end, newline_end, quote_end);
            var link = (link_end == 10000000 ? text.substr(index) : text.substr(index, link_end - index));

            if(text.substr(index, 4) == "www.") {
                result_text += '<a href="http://'+link+'" target="_blank">' + htmlify(link) + '</a>';
            } else {
                result_text += '<a href="'+link+'" target="_blank">' + htmlify(link) + '</a>';
            }

            index += link.length - 1;
            has_content = true;

        } else if(text[index] == '&') {
            var next = (index + 1 < text_len ? text[index + 1] : '');

            var color = "";
            var underline = false;
            var ital = false;
            var bold = false;
            var plain = false;

            if(next == 'l') {
                color = "#8989ff";
            } else if(next == 'o') {
                color = "orange";
            } else if(next == 'g') {
                color = "green";
            } else if(next == 'r') {
                color = "#ff3d3d";
            } else if(next == 'b') {
                bold = true;
            } else if(next == 'u') {
                underline = true;
            } else if(next == 'i') {
                ital = true;
            } else if(next == 'p') {
                plain = true;
            } else {
                result_text += "&amp;"
                continue;
            }

            index++;
            
            if(in_color != "") {
                result_text += "</span>";
            }

            if(in_underline) {
                result_text += "</span>";
            }
              
            if(in_ital) {
                result_text += "</span>";
            }

            if(in_bold) {
                result_text += "</span>";
            }

            if(plain) {
                in_color = false;
                in_underline = false;
                in_ital = false;
                in_bold = false;
            } else if(color != "") {
                in_color = color;
            } else if(bold) {
                in_bold = true;
            } else if(underline) {
                in_underline = true;
            } else if(ital) {
                in_ital = true;
            }

            if(in_color != "") {
                result_text += '<span style="color: '+in_color+';">';
            }

            if(in_underline) {
                result_text += '<span style="text-decoration: underline;">';
            }

            if(in_bold) {
                result_text += '<span style="font-weight: 900;">';
            }

            if(in_ital) {
                result_text += '<span style="font-style: italic;">';
            }
        } else if(text[index] == '<') {
            result_text += '&lt;';
            has_content = true;
        } else if(text[index] == '>') {
            result_text += '&gt;';
            has_content = true;
        } else if(text[index] == '"') {
            result_text += '&quot;';    
            has_content = true;        
        } else if(text[index] == '\'') {
            result_text += '&#039;';
            has_content = true;
        } else if(text[index] == '\n' && allow_newline) {
            result_text += '&nbsp;<br />';
            has_content = true;
        } else {
            result_text += text[index];
            has_content = true;
        }
    }

    if(in_color != "") {
        result_text += "</span>";
    }

    if(in_underline) {
        result_text += "</span>";
    }
        
    if(in_ital) {
        result_text += "</span>";
    }

    if(in_bold) {
        result_text += "</span>";
    }

    result_text = ParseTTV(result_text);
    result_text = emojione.toImage(result_text);
    result_text = ParseBTTV(result_text);

    if(has_content == false) {
        result_text += "&nbsp;";
    }

    return result_text;
}

function GenerateChatHTML(chat_msg) {
    if(chat_msg['c'] == 'c') {
        var epoch_secs = 1388534400;
        epoch_secs += chat_msg['t'];

        var msg_time = new Date();
        msg_time.setTime(epoch_secs * 1000);

        var hours_val = msg_time.getHours();
        var hours_suffix = '';
        
        if(local_data.m_Persistent.m_TwelveHourClock) {
            hours_suffix = hours_val >= 12 ? " PM" : " AM";
            hours_val = ((hours_val + 11) % 12 + 1);
        }

        var hours = hours_val.toString();
        var minutes = msg_time.getMinutes().toString();

        if(hours.length < 2) {
            hours = "0" + hours;
        }

        if(minutes.length < 2) {
            minutes = "0" + minutes;
        }

        var msg = ProcessText(chat_msg.msg, false);

        var html_data =
            '<div class="chat_element"><div class="chat_element_name"><div class="chat_element_time">[' + hours  + ':' + minutes + hours_suffix +'] </div>{{user}}' +
            ':</div><div class="chat_element_text">' + msg;

        if('b' in chat_msg && chat_msg['b'] != null && chat_msg['b'].length > 0) {
            html_data += '<hr class="chat_element_title_separator" /><div class="chat_element_title">{{b}}</div>';
        }
        html_data += '</div></div>';
        return Mustache.render(html_data, chat_msg);
    }
    else if(chat_msg['c'] == 'motd') {
        var msg = ProcessText(chat_msg.msg, true);

        var html_data = '<div class="chat_element"><div class="chat_element_motd">' + msg + '</div></div>';
        return html_data;
    }
    else if(chat_msg['c'] == 'stxt') {
        var msg = linkify(htmlify_newline(chat_msg.msg));

        var html_data = '<div class="chat_element"><div class="chat_element_server_message">' + msg + '</div></div>';
        return html_data;
    }
}

function GetJson(url) {
    var request = new XMLHttpRequest();
    request.open('GET', url, false);
    request.onreadystatechange = function() {
        if(request.readyState === 4) { //if complete
            if(request.status === 200){
                //success
                return request.responseText;
            }
            else {
                //fail
                return '';
            }
        }
    }
    request.send();
    return request.responseText;
}

function escapeRegExp(str) {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function ParseBTTV(str) {
    var url = 'https://api.betterttv.net/2/emotes';
    var jsonString = '';
    var link = 'https://cdn.betterttv.net/emote/';
    var temp = str;
    
    if(typeof localStorage !== undefined){
        if(localStorage.betterttv !== undefined){
            jsonString = localStorage.betterttv;
        } 
        else {
            jsonString = GetJson(url);
            localStorage.setItem("betterttv", GetJson(url));
        }
    }
    else {
        jsonString = GetJson(url);
    }
    if (jsonString !== ''){
        var myJSONObj = JSON.parse(jsonString);
        //sort myJSONObj to have the longer names first
        myJSONObjKeys = Object.keys(myJSONObj.emotes);
        myJSONObjKeys.sort(function (a, b) {
            return b.length - a.length || a.localeCompare(b);
        });

        for(i = 0; i < myJSONObjKeys.length; i++) {
            var matchesArr = [];
            var escStr = escapeRegExp(myJSONObj.emotes[i].code);
            var re = new RegExp('"' + escStr + '|' + escStr + '"|"' + escStr + '"|(' + escStr + ')', 'g');
            
            var match = re.exec(temp);
            while(match !== null) {
                if(match[1] !== null) 
                    matchesArr.push(match[1]);
                match = re.exec(temp);
            }

            // Replace the matches
            temp = temp.replace(re, function(m, group1) {
                if (group1 === undefined ) 
                    return m;
                else 
                    return '<img class="twitch-emoji twitch-emoji-small" style="vertical-align:top" alt="' + myJSONObj.emotes[i].code + '" src="' + link + myJSONObj.emotes[i].id + '/1x"></img>';
            });
        }
    }

    return temp;
}

function ParseTTV(str) {
    var url = 'https://twitchemotes.com/api_cache/v2/global.json';
    var jsonString = '';
    var temp = str;
    var link = "https://static-cdn.jtvnw.net/emoticons/v1/";

    if(typeof localStorage !== undefined){
        if(localStorage.twitchtv !== undefined){
            jsonString = localStorage.twitchtv;
        } 
        else {
            jsonString = GetJson(url);
            localStorage.setItem("twitchtv", GetJson(url));
        }
    }
    else {
        jsonString = GetJson(url);
    }
    if (jsonString !== ''){
        var myJSONObj = JSON.parse(jsonString);
        //sort myJSONObj to have the longer names first
        myJSONObjKeys = Object.keys(myJSONObj.emotes);
        myJSONObjKeys.sort(function (a, b) {
            return b.length - a.length || a.localeCompare(b);
        });

        for(i = 0; i < myJSONObjKeys.length; i++) {
            var matchesArr = [];
            var escStr = escapeRegExp(myJSONObjKeys[i]);
            var re = new RegExp('"' + escStr + '|' + escStr + '"|"' + escStr + '"|(' + escStr + ')', 'g');
            
            var match = re.exec(temp);
            while(match !== null) {
                if(match[1] !== null) 
                    matchesArr.push(match[1]);
                match = re.exec(temp);
            }

            // Replace the matches
            temp = temp.replace(re, function(m, group1) {
                if (group1 === undefined ) 
                    return m;
                else 
                    return '<img class="twitch-emoji twitch-emoji-small" style="vertical-align:top" alt="' + myJSONObjKeys[i] + '" src="' + link + myJSONObj.emotes[myJSONObjKeys[i]].image_id + '/1.0"></img>';
            });
        }
    }
    return temp;
}

function AddChatToHTML(html_data) {

    if(current_mode != UIMode.Chat) {
        return;
    }

    var scroll_to_bot = false;
    if(dom_data.chatarea.clientHeight >= dom_data.chatarea.scrollHeight ||
       dom_data.chatarea.scrollHeight - (dom_data.chatarea.scrollTop + dom_data.chatarea.clientHeight) < 25) {
        scroll_to_bot = true;
    }

    dom_data.chatarea.innerHTML += html_data;
    if(dom_data.chatarea.childElementCount > 1000) {
        dom_data.chatarea.removeChild(dom_data.chatarea.firstElementChild);
    }

    if(scroll_to_bot && dom_data.chatarea.scrollHeight >= dom_data.chatarea.clientHeight) {
        dom_data.chatarea.scrollTop = dom_data.chatarea.scrollHeight - dom_data.chatarea.clientHeight;
    } 
}

function AddChatListToHTML(chat_msg_list) {
    var chat_html = "";
    var start = Math.max(0, chat_msg_list.length - 1000);

    for(var index = start; index < chat_msg_list.length; index++) {
        chat_html += chat_msg_list[index];
    }

    dom_data.chatarea.innerHTML = chat_html;
    dom_data.chatarea.scrollTop = dom_data.chatarea.scrollHeight - dom_data.chatarea.clientHeight;
}

function ClearChatHTML() {
    if(current_mode != UIMode.Chat) {
        return;
    }

    dom_data.chatarea.innerHTML = "";
}

function AddChatChannelHTML(channel_name, channel_id, channel_locked) {
    if(current_mode != UIMode.Chat) {
        return;
    }

    var id_html = ' id="channel' + channel_id + '"';
    var channel_id_html = ' channel_id="' + channel_id + '"';
    var click_html = ' onclick="HandleChannelButtonClick(\''+ channel_id + '\')"';
    var menu_html = ' oncontextmenu="ClickChannel(\'' + channel_id + '\')"'

    var inner_html = channel_locked ? '<img src="img/icons/lock.png" />' : "";
    inner_html += channel_name;

    var button_html = '<button class="channel_button"' + id_html + channel_id_html + click_html + menu_html + '>' + inner_html + '</button>';
    dom_data.channellist.innerHTML += button_html;
}

function UpdateChatChannelHTML(channel_id, channel_name, channel_locked, channel_new_text) {
    if(current_mode != UIMode.Chat) {
        return;
    }

    var button_id = 'channel' + channel_id;
    var button_list = dom_data.channellist.childNodes;

    var html = channel_locked ? '<img src="img/icons/lock.png" />' : "";
    html += channel_name;

    for(var index = 0; index < button_list.length; index++) {
        if(button_list[index].id == button_id) {
            button_list[index].innerHTML = html;

            if(channel_new_text) {
                if(button_list[index].classList.contains("channel_button_new_text") == false) {
                    button_list[index].classList.add("channel_button_new_text");
                }
            } else {
                if(button_list[index].classList.contains("channel_button_new_text") == true) {
                    button_list[index].classList.remove("channel_button_new_text");
                }
            }
            

            return;
        }
    }
}

function RemoveChatChannelHTML(channel_id) {
    if(current_mode != UIMode.Chat) {
        return;
    }

    var button_id = 'channel' + channel_id;
    var button_list = dom_data.channellist.childNodes;

    for(var index = 0; index < button_list.length; index++) {
        if(button_list[index].id == button_id) {
            dom_data.channellist.removeChild(button_list[index]);
            return;
        }
    }
}

function SelectChatChannelHTML(channel_id) {
    if(current_mode != UIMode.Chat) {
        return;
    }

    var button_id = 'channel' + channel_id;
    var button_list = dom_data.channellist.childNodes;

    for(var index = 0; index < button_list.length; index++) {
        if(button_list[index].id == button_id) {
            button_list[index].className = "channel_button_selected";
            return;
        }
    }
}

function UnselectChatChannelHTML(channel_id) {
    if(current_mode != UIMode.Chat) {
        return;
    }

    var button_id = 'channel' + channel_id;
    var button_list = dom_data.channellist.childNodes;

    for(var index = 0; index < button_list.length; index++) {
        if(button_list[index].id == button_id) {
            button_list[index].className = "channel_button";
            return;
        }
    }
}

function GenerateChatPlayerElementHTML(user_info) {

    var html = "";

    if(user_info.in_game) {
        html += '<img style="height: 16px; width: 16px; float:left;" src="img/icons/ingame.png" />';
    } else {
        html += '<img style="height: 16px; width: 16px; float:left;" src="img/icons/default.png" />';
    }

    html += '<img style="height: 16px; width: 16px; float:left;" src="{{icon}}" />';

    html += '<div style="height:16px;overflow:hidden;margin-left:35px;">'
    if(user_info.squad && user_info.squad != "") {
        html += '{{user_name}} <span style="color:#FFF8C5">&lt;{{squad}}&gt;</span>';
    } else {
        html += '{{user_name}}';
    }
    html += "<div>";

    return Mustache.render(html, user_info);
}

function GenerateChatPlayerElement(channel_id, user_info) {
    var elem = document.createElement("div");
    elem.id = "chat_user_" + channel_id + "_" + user_info.user_id;
    elem.className = "player_list_element";
    elem.attributes.userid = user_info.user_id;
    elem.attributes.username = user_info.user_name;
    elem.attributes.squad = user_info.squad;
    elem.style.fontSize = "9pt";
    elem.onclick = function() { ClickPlayer(user_info.user_id, user_info.plat_id, channel_id); };
    elem.oncontextmenu = function() { ClickPlayer(user_info.user_id, user_info.plat_id, channel_id); };
    elem.innerHTML = GenerateChatPlayerElementHTML(user_info);

    return elem;
}

function AddChatPlayerHTML(channel_id, user_info) {
    var elem = GenerateChatPlayerElement(channel_id, user_info);

    for(var child = dom_data.playerlist.firstElementChild; child != null; child = child.nextElementSibling) {
        if(PlayerSortCompare(child, user_info) > 0) {
            dom_data.playerlist.insertBefore(elem, child);
            return;
        }
    }

    dom_data.playerlist.appendChild(elem);
}

function AddChatPlayerListHTML(channel_id, user_info_list) {
    var users = [];
    for(var index = 0; index < user_info_list.length; index++) {
        users.push(GenerateChatPlayerElement(channel_id, user_info_list[index]));
    }

    users.sort(function(a, b) {
        return PlayerSortCompare(a, b);
    });

    dom_data.playerlist.innerHTML = "";

    for(var index = 0; index < users.length; index++) {
        dom_data.playerlist.appendChild(users[index]);
    }
}

function UpdateChatPlayerHTML(channel_id, user_id, user_info) {
    var elem_id = "chat_user_" + channel_id + "_" + user_info.user_id;
    var elem = document.getElementById(elem_id);

    if(elem != null) {
        elem.innerHTML = GenerateChatPlayerElementHTML(user_info);
    }
}

function RemoveChatPlayerHTML(user_id) {
    var player_list = dom_data.playerlist.childNodes;

    for(var index = 0; index < player_list.length; index++) {
        if(user_id == Number(player_list[index].attributes.userid)) {
            dom_data.playerlist.removeChild(player_list[index]);
            return;
        }
    }
}

function ClearChatPlayerHTML() {
    dom_data.playerlist.innerHTML = "";
}

function HandleChatKeyDown(event) {
    if(event.keyCode == 13 && dom_data.chatinput.value != "") {
        SendChat(dom_data.chatinput.value);
        dom_data.chatinput.value = "";
    }
}

function HandleGameLobbyChatKeyDown(event) {
    if(event.keyCode == 13 && dom_data.gamelobbychatinput.value != "") {
        SendGameChat(dom_data.gamelobbychatinput.value);
        dom_data.gamelobbychatinput.value = "";
    }
}

function HandleShortcutKeyDown(event) {
    var keycode = event.keyCode;
    var mod_ctrl_pressed = false;

    if(event.ctrlKey) mod_ctrl_pressed = true;


    // ctrl + left arrow
    if(mod_ctrl_pressed && keycode == 37) { 
        HandleChannelChange("left");
    }
    
    //ctrl + right arrow
    if(mod_ctrl_pressed && keycode == 39) {
        HandleChannelChange("right"); 
    }   
    
    // ESC
    if(keycode === 27) {
        ShowPopup(-1);
    } 
}

function HandleChannelChange(direction) {
            
        if(chat_data.all_channels.length == 1) {
            return;
        }
        
        for(var index = 0; index < chat_data.all_channels.length; index++) {
            
            if(chat_data.all_channels[index].channel_id !== chat_data.current_channel) {
                continue;
            }
            
            if(direction === "left" && index === 0) {
                SetCurrentChannel(chat_data.all_channels[chat_data.all_channels.length - 1].channel_id);
            } 
            else if(direction === "left") {
                SetCurrentChannel(chat_data.all_channels[index - 1].channel_id)
            }
            
            if(direction === "right" && index == chat_data.all_channels.length - 1)  {
                SetCurrentChannel(chat_data.all_channels[0].channel_id);
            } 
            else if(direction === "right") {
                SetCurrentChannel(chat_data.all_channels[index + 1].channel_id);
            }
            
            break;
        }  
}

function HandleChannelButtonClick(channel_id) {
    SetCurrentChannel(channel_id);
}

function GetTeamName(team) {
    if(team == -1) {
        return "";
    }

    if(team == 0) {
        return "Red";
    }
    if(team == 1) {
        return "Blue";
    }
    if(team == 2) {
        return "Green";
    }
    if(team == 3) {
        return "Gold";
    }    

    return "Observers";
}

function GetLightTeamColor(team) {
    if(team == -1) {
        return null;
    }

    if(team == 0) {
        return "#fd0000";
    }
    if(team == 1) {
        return "#0098ff";
    }
    if(team == 2) {
        return "#03ae03";
    }
    if(team == 3) {
        return "#f2d804";
    }    

    return "#818181";
}

function GetTeamColor(team) {
    if(team == -1) {
        return null;
    }

    if(team == 0) {
        return "#b80202";
    }
    if(team == 1) {
        return "#0255a8";
    }
    if(team == 2) {
        return "#027702";
    }
    if(team == 3) {
        return "#b69306";
    }    

    return "#818181";
}

function PlayerSortCompare(a, b) {
    a.username = a.attributes ? a.attributes.username : a.user_name;
    b.username = b.attributes ? b.attributes.username : b.user_name;
    
    a.squad = a.attributes ? a.attributes.squad : a.squad;
    b.squad = b.attributes ? b.attributes.squad : b.squad;

    if(local_data.m_Persistent.m_PlayerListSort === 0) {
        return a.username.localeCompare(b.username, { sensitivity: 'case' }); 
    }
    
    if(a.squad === b.squad) {
        return a.username.localeCompare(b.username, { sensitivity: 'case' });
    }
    else {
        return a.squad.localeCompare(b.squad, { sensitivity: 'case' }); 
    }
}