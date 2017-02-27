
var popup_html = `
<div id="demo_list_popup_bkg" class="popup_bkg">
    <div id="demo_list_popup" class="blue_box">
        <div id="demo_list_header" class="strong_header">Replay List</div>
        <div class="popup_close"><a onclick="ShowPopup(-1);">x</a></div>
        <hr class="header_separator" />
        <div class="weak_header" style="display: inline; margin-left:10px;">File Name</div>
        <div class="weak_header" style="display: inline; margin-right:30px; float:right;">Date</div>
        <div class="popup_list_bkg">
            <ul id="demo_list" class="file_name_list">
            </ul>
        </div> 
    </div>
</div>      
<div id="map_list_popup_bkg" class="popup_bkg">
    <div id="map_list_popup" class="blue_box">
        <div id="map_list_header" class="strong_header">Map List</div>
        <div class="popup_close"><a onclick="ShowPopup(-1);">x</a></div>
        <hr class="header_separator" />
        <div class="weak_header" style="display: inline; margin-left:10px;">File Name</div>
        <div class="popup_list_bkg">
            <ul id="map_list" class="file_name_list">
            </ul>
        </div>                     
    </div>
</div>   
<div id="server_pick_popup_bkg" class="popup_bkg">
    <div id="server_pick_popup" class="blue_box">
        <div id="server_pick_header" class="strong_header">Create Game</div>
        <div class="popup_close"><a onclick="ShowPopup(-1);">x</a></div>
        <hr class="header_separator" />
        <div class="weak_header" style="display: inline; margin-left:10px;">Pick A Server</div>   
        <div id="server_pick_button_container">
        </div>        
        <button id="server_pick_cancel_button" class="style3" onclick="ShowPopup(-1);">Cancel</button>
    </div>
</div>
<div id="create_game_popup_bkg" class="popup_bkg">
    <div id="create_game_popup" class="blue_box">
        <div id="create_game_header" class="strong_header">Create Game</div>
        <div class="popup_close"><a onclick="ShowPopup(-1);">x</a></div>
        <hr class="header_separator" />
        <div class="weak_header" style="display: inline; margin-left:10px;">Select Map</div>   
        <div id="create_game_map_list" class="blue_interior">
        </div>
        <div id="create_game_options_container">
            <div class="weak_header" style="display:inline;width:220px;">Game Name:</div>
            <input id="game_create_name" type="text" style="width:calc(100% - 10px);max-width:200px"></input>
            <div style="height:20px;"></div>
            <div class="weak_header" style="display: inline;">Score Limit:</div>
            <input id="game_create_score_limit_enabled" type="checkbox" style="display: inline;" class="settings_checkbox"></input>
            <input id="game_create_score_limit" type="number" style="display: inline; width:calc(50px)" min="0"></input>
            <br />
            <div class="weak_header" style="display: inline;">Time Limit:</div>
            <input id="game_create_time_limit_enabled" type="checkbox" style="display: inline;" class="settings_checkbox"></input>
            <input id="game_create_time_limit" type="number" style="display: inline; width:calc(50px);" min="0"></input>
            <br />            
            <div id="game_create_player_limit_label" class="weak_header" style="display: inline;">Player Limit:</div>
            <input id="game_create_player_limit" type="number" style="display: inline; width:calc(50px);" min="0"></input>
            <div style="height:20px;"></div>
            <div id="game_create_password_label" class="weak_header" style="display: inline;">Password (Optional): </div>
            <input id="game_create_password" type="text" style="width:calc(100% - 10px);max-width:200px"></input>
            <div id="game_create_map_info" class="blue_box">
            </div>
            <button id="create_game_cancel_button" class="style3" onclick="ShowPopup(-1);">Cancel</button>
            <button id="create_game_create_button" class="style3" onclick="CreateGame();">Create</button>
        </div>
    </div>
</div>
<div id="settings_popup_bkg" class="popup_bkg">
    <div id="settings_popup" class="blue_box">
        <div id="settings_header" class="strong_header">Settings</div>
        <div class="popup_close"><a onclick="ShowPopup(-1);">x</a></div>
        <hr class="header_separator" />
        <div id="settings_selector" class="popup_selector">
            <ul class="popup_list">
                <li class="popup_list_elem" onclick="ShowOptionsCategory(0);">Graphics</li>
                <li class="popup_list_elem" onclick="ShowOptionsCategory(1);">Audio</li>
                <li class="popup_list_elem" onclick="ShowOptionsCategory(2);">Controls</li>
            </ul>
        </div>
        <div id="option_controls_container">
            <div id="graphics_options">
                <div class="weak_header">Resolution</div>
                <select id="resolution" onchange="ResolutionChanged();" class="settings_dropdown">
                </select>
                <input id="fullscreen" onchange="FullScreenChanged();" type="checkbox" class="settings_checkbox">Fullscreen</input><br />
                <input id="vsync" onchange="VsyncChanged();" type="checkbox" class="settings_checkbox">V-Sync</input><br />
                <input id="glmode" onchange="GLModeChanged();" type="checkbox" class="settings_checkbox">Open GL Mode</input><br />
                <input id="reticle" onchange="BallReticleChanged();" type="checkbox" class="settings_checkbox">Ball Reticle</input><br />
                <input id="directional_indicator" onchange="DirectionalIndicatorChanged();" type="checkbox" class="settings_checkbox">Ship Direction Indicator</input><br />
                <input id="draw_bkg" onchange="DrawBackgroundChanged();" type="checkbox" class="settings_checkbox">Draw Background</input><br />

                <hr class="header_separator" />
                <div class="weak_header">Patch</div>
                <select id="patch"" onchange="PatchChanged();" class="settings_dropdown">
                    <option value="0">Original Graphics</option>
                </select>
            </div>
            <div id="audio_options">
                <div class="weak_header">Audio</div>
                <hr class="header_separator" />
                <input id="enable_audio" onchange="EnableAudioChanged();" type="checkbox" class="settings_checkbox">Enable Audio<br />
                <input id="reverse_audio" onchange="ReverseAudioChanged();" type="checkbox" class="settings_checkbox">Reverse Audio<br />
                <hr class="header_separator" />
                <div class="weak_header">Volume</div>
                <input id="volume" onchange="VolumeChanged();" type="range" class="settings_slider" /><br />
            </div>
            <div id="controls_options">
                <div class="weak_header">Controls</div>
                <div class="settings_control_border"><div class="control_override_label">Up: </div><button id="ctrl_up" class="control_override" type="button" onclick="CaptureKeypress(0);">W</button></div>
                <div class="settings_control_border"><div class="control_override_label">Left: </div><button id="ctrl_left" class="control_override" type="button" onclick="CaptureKeypress(1);">A</button></div>
                <div class="settings_control_border"><div class="control_override_label">Right: </div><button id="ctrl_right" class="control_override" type="button" onclick="CaptureKeypress(2);">D</button></div>
                <div class="settings_control_border"><div class="control_override_label">Down: </div><button id="ctrl_down" class="control_override" type="button" onclick="CaptureKeypress(3);">S</button></div>
                <div class="settings_control_border"><div class="control_override_label">Brake: </div><button id="ctrl_break" class="control_override" type="button" onclick="CaptureKeypress(4);">Shift</button></div>
                <div class="settings_control_border"><div class="control_override_label">Ping: </div><button id="ctrl_ping" class="control_override" type="button" onclick="CaptureKeypress(12);">Q</button></div>
                <div class="settings_control_border"><div class="control_override_label">Talk: </div><button id="ctrl_talk" class="control_override" type="button" onclick="CaptureKeypress(5);">T</button></div>
                <div class="settings_control_border"><div class="control_override_label">Team Talk: </div><button id="ctrl_talk_team" class="control_override" type="button" onclick="CaptureKeypress(6);">'</button></div>
                <div class="settings_control_border"><div class="control_override_label">Rotate CCW: </div><button id="ctrl_rotccw" class="control_override" type="button" onclick="CaptureKeypress(7);">F5</button></div>
                <div class="settings_control_border"><div class="control_override_label">Rotate CW: </div><button id="ctrl_rotcw" class="control_override" type="button" onclick="CaptureKeypress(8);">F6</button></div>
                <div class="settings_control_border"><div class="control_override_label">Volume Up: </div><button id="ctrl_volup"class="control_override" type="button" onclick="CaptureKeypress(9);">Num 9</button></div>
                <div class="settings_control_border"><div class="control_override_label">Volume Down: </div><button id="ctrl_voldown" class="control_override" type="button" onclick="CaptureKeypress(10);">Num 3</button></div>
                <div class="settings_control_border"><div class="control_override_label">View Scores: </div><button id="ctrl_score" class="control_override" type="button" onclick="CaptureKeypress(11);">Tab</button></div>


                <hr class="header_separator" />
                <input id="lock_mouse" onchange="LockMouseChanged();" type="checkbox" class="settings_checkbox">Lock Mouse To Window</input><br />
                <input id="hold_score" onchange="HoldScoreChanged();" type="checkbox" class="settings_checkbox">Hold Score Button<br />
                <input id="save_replay" onchange="SaveReplayChanged();" type="checkbox" class="settings_checkbox">Save Replays<br />
                <input id="use_only_talk" onchange="UseOnlyTalkKeyChanged();" type="checkbox" class="settings_checkbox">Press Any Key To Talk<br />


                <hr class="header_separator" />
                <div class="weak_header">Spin Rate</div>
                <input id="spin_rate" onchange="SpinRateChanged();" type="range" class="settings_slider" /><br />
            </div>
        </div>
    </div>
</div>
<div id="control_override_popup_bkg" class="popup_bkg">
    <div id="control_override_popup" class="red_box">
        <div id="control_override_label" class="weak_header">Press Any Button</div>
        <button id="control_override_cancel_button" class="control_override" type="button" onclick="CancelCaptureKeypress();">Cancel</button>
    </div>
</div>
<div id="text_prompt_popup_bkg" class="popup_bkg">
    <div id="text_prompt_popup" class="blue_box">
        <div id="text_prompt" class="weak_header">Prompt</div>
        <input id="text_prompt_input" type="text" />
        <button id="text_prompt_submit" class="control_override" type="button" onclick="SubmitTextPrompt();">Submit</button>
        <button id="text_prompt_cancel" class="control_override" type="button" onclick="CancelTextPrompt();">Cancel</button>
    </div>
</div>
<div id="profile_popup_bkg" class="popup_bkg">
    <div id="profile_popup" class="blue_box">
        <div id="settings_header" class="strong_header">Profile</div>
        <div class="popup_close"><a onclick="ShowPopup(-1);">x</a></div>
        <hr class="header_separator" />

        <div id="settings_selector" class="popup_selector">
            <ul class="popup_list">
                <li class="popup_list_elem" onclick="ShowProfileCategory(0);">Chat</li>
                <li class="popup_list_elem" onclick="ShowProfileCategory(1);">Stats</li>
                <li class="popup_list_elem" onclick="ShowProfileCategory(2);">Auto Joins</li>
            </ul>
        </div>

        <div id="option_controls_container">
            <div id="chat_options">
                <div class="weak_header">Title</div>
                <select id="profile_title" onchange="TitleChanged();" class="settings_dropdown">
                </select>
                <div class="base_text">Current Title: <span id="profile_current_title">None</span></div>
                <br />&nbsp;
            
                <div class="weak_header">Icon</div>
                <select id="profile_icon" onchange="IconChanged();" class="settings_dropdown">
                </select>
                <div class="base_text">Current Icon: <span id="profile_no_icon"></span><img id="profile_current_icon" src="img/icons/1.png"></div>
                <br />&nbsp;
            
                <div class="weak_header">Primary Squad</div>
                <select id="profile_primary_squad" onchange="PrimarySquadChanged();" class="settings_dropdown">
                </select>
                <div class="base_text">Current Primary Squad: <span id="profile_current_primary_squad">None</span></div>
                <br />&nbsp;
                <br />&nbsp;
                <input id="profile_enter_exit_messages" type="checkbox" class="settings_checkbox" onchange="EnterExitMessagesChanged();">Enter/Exit Messages</input><br />&nbsp;
                <input id="profile_twelve_hour_clock" type="checkbox" class="settings_checkbox" onchange="TwelveHourClockChanged();">Twelve Hour Clock</input>
            </div>

            <div id="profile_stats_options">
                <div id="profile_stats_fetching">
                    <div id="base_text">Fetching Stats...</div>
                </div>
                <div id="profile_stats_display">
                    <div id="base_text">
                        Games Played: <span id="profile_stats_games_played">0</span><br />
                        Games Won: <span id="profile_stats_won">0</span><br />&nbsp;<br />
                        UB Goals: <span id="profile_stats_ub_goals">0</span><br />
                        UB Assists: <span id="profile_stats_ub_assists">0</span><br />&nbsp;<br />
                        DB Goals: <span id="profile_stats_db_goals">0</span><br />
                        DB Assists: <span id="profile_stats_db_assists">0</span><br />&nbsp;<br />
                        Time Played: <span id="profile_stats_time_played">0</span><br />&nbsp;<br />
                        Last Game Played: <span id="profile_stats_last_game">0</span><br />&nbsp;<br />
                    </div>
                </div>
            </div>
            
            <div id="auto_joins_container">
                <div class="weak_header" style="text-align:center;">Manage Auto Joins<br />
                    <div class="base_text" style="text-align:center;font-size:8pt;padding-bottom:10px;float:none;margin:auto;">
                        Auto joins are channels that you will automatically join as soon as you login to the chat lobby.
                    </div>    
                </div>
                
                <div style="display:flex; justify-content:center;width:100%;margin-top:30px;">
                    <div>
                        <div class="weak_header">Channels</div>
                        <div id="auto_joins_list" class="blue_interior">
                        </div>
                    </div>    
                    <div style="margin-left:15px;">                        
                        <button class="style3" style="width:75%;margin-top:25px;padding-left:30px;padding-right:30px;" onclick="RemoveAutoJoin();">Remove Channel</button>
                        <button class="style3" style="width:75%;margin-top:70px;padding-left:30px;padding-right:30px;" onclick="AddAutoJoin();">Add Channel</button>
                        <input type="text" id="auto_join_input" style="margin-top:10px; width:73%;" />
                    </div>
                </div>
            </div>
            
        </div>
    </div>
</div>
<div id="status_popup_bkg" class="popup_bkg">
    <div id="stats_popup" class="blue_box">
        <div id="settings_header" class="strong_header">Stats For Player <span id="stats_name"></span></div>
        <div class="popup_close"><a onclick="ShowPopup(-1);">x</a></div>
        <hr class="header_separator" />    
        <div id="stats_fetching">
            <div id="base_text">Fetching Stats...</div>
        </div>
        <div id="stats_display">
            <div id="base_text">
                Games Played: <span id="stats_games_played">0</span><br />
                Games Won: <span id="stats_won">0</span><br />&nbsp;<br />
                UB Goals: <span id="stats_ub_goals">0</span><br />
                UB Assists: <span id="stats_ub_assists">0</span><br />&nbsp;<br />
                DB Goals: <span id="stats_db_goals">0</span><br />
                DB Assists: <span id="stats_db_assists">0</span><br />&nbsp;<br />
                Time Played: <span id="stats_time_played">0</span><br />&nbsp;<br />
                Last Game Played: <span id="stats_last_game">0</span><br />&nbsp;<br />
            </div>
        </div>
    </div>    
</div>
<div id="text_edit_popup_bkg" class="popup_bkg">
    <div id="text_edit_popup" class="blue_box">
        <div id="settings_header" class="strong_header">Edit</div>
        <div class="popup_close"><a onclick="ShowPopup(-1);">x</a></div>
        <hr class="header_separator" />
        <textarea id="text_edit_input" style="height:calc(80vh - 100px);"></textarea>
        <button id="text_prompt_submit" class="control_override" style="float:right;margin-top:10px;"type="button" onclick="SubmitEditText();">Submit</button>
    </div>
</div>
<div id="runtime_error_popup_bkg" class="popup_bkg">
    <div id="runtime_error_popup" class="red_box">
        <div id="runtime_error_popup_msg" class="weak_header"></div>
        <button id="runtime_error_dismiss" class="control_override" type="button" onclick="CloseRuntimeError();">Okay</button>
    </div>
</div>
`;

var file_elem_html = `
<ul class="file_name_list">
    <li class="file_name_list_elem" onclick="alert();">
        <div style="float:left">Crap</div>
        <div style="float:right; margin-right:5px">0000000000</div>
    </li>
</ul>
`;

var game_create_settings = {
    'name': '',
    'password': '',
    'selected_map': '',
    'selected_map_index': -1,
    'maps': [],
    'score_limit': -1,
    'time_limit': -1,
    'player_limit': -1,
    'password': ''
}

if(localStorage !== undefined) {
    var settings = localStorage.getItem("game_create_settings");
    if(settings !== null) {
        game_create_settings = JSON.parse(settings);
    }
}

var top_maps = ['hockey', 'miniball', 'shades'];
var beginner_maps = ['freshcourt'];
var default_map = 'freshcourt';


var text_prompt_callback = null;
var popup_elements = [];

var edit_text_msg = {};
var disable_profile_sync = false;

var auto_join_list = null;

function AttachPopupHTML() {
    var popup_container = document.getElementById('popup_container');
    while (popup_container.firstChild) {
        popup_container.removeChild(popup_container.firstChild);
    }
    
    popup_container.innerHTML = squad_popup_html + popup_html;

    document.getElementById("text_prompt_input").addEventListener("keydown", HandleShowTextPromptKeyDown); 

    popup_elements = [
      document.getElementById("settings_popup_bkg"),  
      document.getElementById("squad_popup_bkg"),
      document.getElementById("demo_list_popup_bkg"),
      document.getElementById("map_list_popup_bkg"),
      document.getElementById("create_game_popup_bkg"),
      document.getElementById("server_pick_popup_bkg"),
      document.getElementById("profile_popup_bkg"),
      document.getElementById("status_popup_bkg"),
      document.getElementById("text_edit_popup_bkg")
    ];

    auto_join_list = CreateList("auto_joins_list", "auto_joins_list_", 
        GetAutoJoinHtml, "generic_list_element", "generic_list_element_selected");
}

function ShowPopup(popup_id) {
    for(var index = 0; index < popup_elements.length; index++) {
        popup_elements[index].style.display = (popup_id == index) ? "block" : "none";
    }
}

function ShowOptionsCategory(option_id) {
    if(option_id == 0) {
        document.getElementById("graphics_options").style.display = "block";
        document.getElementById("audio_options").style.display = "none";
        document.getElementById("controls_options").style.display = "none";
    }
    else if(option_id == 1) {
        document.getElementById("graphics_options").style.display = "none";
        document.getElementById("audio_options").style.display = "block";
        document.getElementById("controls_options").style.display = "none";
    }
    else if(option_id == 2) {
        document.getElementById("graphics_options").style.display = "none";
        document.getElementById("audio_options").style.display = "none";
        document.getElementById("controls_options").style.display = "block";
    }
}

function ShowProfileCategory(option_id) {
    if(option_id === 0) {
        document.getElementById("chat_options").style.display = "block";
        document.getElementById("profile_stats_options").style.display = "none";
        document.getElementById("auto_joins_container").style.display = "none";
    }
    else if(option_id === 1) {
        document.getElementById("chat_options").style.display = "none";
        document.getElementById("profile_stats_options").style.display = "block";
        document.getElementById("auto_joins_container").style.display = "none";
    }
    else if(option_id === 2) {
        document.getElementById("chat_options").style.display = "none";
        document.getElementById("profile_stats_options").style.display = "none";
        document.getElementById("auto_joins_container").style.display = "block";
    }
}

function OpenProfile() {
    var msg = {
        'c': 'fetch_stats'
    };

    SendSocketMessage(msg);

    document.getElementById("profile_stats_display").style.display = "none";
    document.getElementById("profile_stats_fetching").style.display = "block";
    
    ShowPopup(6);
}

function SyncProfileOptions() {
    if(disable_profile_sync) {
        return;
    }

    var title_list = document.getElementById("profile_title");
    var title_list_selection = title_list.value;

    var title_options = '<option value="-1">None</option>';
    for(var index in local_data.m_TitleList) {
        title_options += '<option value="'+index+'">'+local_data.m_TitleList[index]+'</option>';
    }

    title_list.innerHTML = title_options;
    title_list.value = title_list_selection;

    var icon_list = document.getElementById("profile_icon");
    var icon_list_selection = icon_list.value;

    var icon_options = '<option value="-1">None</option>';
    for(var index in local_data.m_IconNames) {
        icon_options += '<option value="'+index+'">'+local_data.m_IconNames[index]+'</option>';
    }

    icon_list.innerHTML = icon_options;
    icon_list.value = icon_list_selection;
}

function SyncProfileSquads() {
    if(disable_profile_sync) {
        return;
    }

    var squad_list = document.getElementById("profile_primary_squad");
    var squad_list_selection = squad_list.value;

    var squad_options = '<option value="0">None</option>';
    
    for(var index in local_data.m_Squads) {
        if(GetUserSquadRank(index) !== "Honorary Member") {
            squad_options += '<option value="'+index+'">'+local_data.m_Squads[index].m_Name+'</option>';
        }
    }    
    
    squad_list.innerHTML = squad_options;
    squad_list.value = squad_list_selection;
}

function SyncProfileSelectedOptions() {
    var title_list = document.getElementById("profile_title");
    title_list.value = local_data.m_Title;

    var icon_list = document.getElementById("profile_icon");
    icon_list.value = local_data.m_Icon;

    var squad_list = document.getElementById("profile_primary_squad");
    squad_list.value = local_data.m_PrimarySquad;
}

function SyncTitle() {
    var current_title = document.getElementById("profile_current_title");
    if(local_data.m_Title in local_data.m_TitleList == false) {
        current_title.innerHTML = "None";
        return;
    }

    current_title.innerHTML = local_data.m_TitleList[local_data.m_Title];
}

function SyncIcon() {
    var current_icon = document.getElementById("profile_current_icon");
    var no_icon = document.getElementById("profile_no_icon");

    if(local_data.m_IconURL == "img/icons/default.png") {
        no_icon.innerHTML = "None";
    } else {
        no_icon.innerHTML = "";
    }

    current_icon.attributes.src.value = local_data.m_IconURL;
}

function SyncPrimarySquad() {
    var current_squad = document.getElementById("profile_current_primary_squad");
    if(local_data.m_PrimarySquad in local_data.m_Squads == false) {
        current_squad.innerHTML = "None";
        return;
    }

    current_squad.innerHTML = "&lt;" + local_data.m_Squads[local_data.m_PrimarySquad].m_Tag + "&gt;" + 
        local_data.m_Squads[local_data.m_PrimarySquad].m_Name; 
}

function FinalizeProfile() {
    disable_profile_sync = false;

    document.getElementById("profile_enter_exit_messages").checked = local_data.m_Persistent.m_EnterExitMessages;
    document.getElementById("profile_twelve_hour_clock").checked = local_data.m_Persistent.m_TwelveHourClock;

    SyncProfileOptions();
    SyncProfileSquads();
    SyncProfileSelectedOptions();
    
}

function TitleChanged() {
    var title_list = document.getElementById("profile_title");
    var msg = {
        'c': 'set_title',
        'val': Number(title_list.value)
    };
    
    SendSocketMessage(msg);
}

function IconChanged() {
    var icon_list = document.getElementById("profile_icon");
    var msg = {
        'c': 'set_icon',
        'val': Number(icon_list.value)
    };
    
    SendSocketMessage(msg);
}

function AddAutoJoin() {
    var channel = document.getElementById('auto_join_input').value;
    if(channel == "") {
        return;
    }

    var msg = {
        'c': 'add_auto_join',
        'channel': channel
    };
    
    SendSocketMessage(msg);
    document.getElementById('auto_join_input').value = "";
}

function RemoveAutoJoin() {
    var channel = auto_join_list.GetSelection();
    if(channel == null) {
        return;
    }

    var msg = {
        'c': 'rem_auto_join',
        'channel': channel[1]
    };
    
    SendSocketMessage(msg);
}

function PrimarySquadChanged() {
    var squad_list = document.getElementById("profile_primary_squad");
    var msg = {
        'c': 'set_primary_squad',
        'val': squad_list.value
    };
    
    SendSocketMessage(msg);
}

function EnterExitMessagesChanged() {
    RequestPersistenChange('m_EnterExitMessages', document.getElementById("profile_enter_exit_messages").checked);
}

function TwelveHourClockChanged() {
    RequestPersistenChange('m_TwelveHourClock', document.getElementById("profile_twelve_hour_clock").checked);
}

function OpenStats(user_id) {
    var msg = {
        'c': 'fetch_user_stats',
        'user': user_id,
    };

    SendSocketMessage(msg);

    document.getElementById("stats_display").style.display = "none";
    document.getElementById("stats_fetching").style.display = "block";
    
    ShowPopup(7);
}

function GotStats(stats_msg) {
    document.getElementById("stats_display").style.display = "block";
    document.getElementById("stats_fetching").style.display = "none";
    document.getElementById("profile_stats_display").style.display = "block";
    document.getElementById("profile_stats_fetching").style.display = "none";

    document.getElementById("stats_name").innerHTML = stats_msg.name;

    var time_str = "0";
    if(stats_msg.stats.m_TimePlayed < 3600) {
        time_str = "0 minutes";
    } else if(stats_msg.stats.m_TimePlayed < 216000) {
        var minutes = Math.floor(stats_msg.stats.m_TimePlayed / 3600);

        if(minutes == 1) {
            time_str = "1 minute";
        } else {
            time_str = minutes + " minutes";
        }
    } else {
        var hours = Math.floor(stats_msg.stats.m_TimePlayed / 216000);

        if(hours == 1) {
            time_str = "1 hour";
        } else {
            time_str = hours + " hours";
        }
    }

    var last_game_str = "Never";

    if(stats_msg.last_game_played > 0) {
        var date = new Date();
        date.setTime(stats_msg.last_game_played * 1000);

        last_game_str = date.toDateString();
    }

    document.getElementById("stats_games_played").innerHTML = stats_msg.stats.m_GamesPlayed;
    document.getElementById("stats_won").innerHTML = stats_msg.stats.m_GamesWon;
    document.getElementById("stats_ub_goals").innerHTML = stats_msg.stats.m_UBGoals;
    document.getElementById("stats_ub_assists").innerHTML = stats_msg.stats.m_UBAssists;
    document.getElementById("stats_db_goals").innerHTML = stats_msg.stats.m_DBGoals;
    document.getElementById("stats_db_assists").innerHTML = stats_msg.stats.m_DBAssists;
    document.getElementById("stats_time_played").innerHTML = time_str;
    document.getElementById("stats_last_game").innerHTML = last_game_str;

    document.getElementById("profile_stats_games_played").innerHTML = stats_msg.stats.m_GamesPlayed;
    document.getElementById("profile_stats_won").innerHTML = stats_msg.stats.m_GamesWon;
    document.getElementById("profile_stats_ub_goals").innerHTML = stats_msg.stats.m_UBGoals;
    document.getElementById("profile_stats_ub_assists").innerHTML = stats_msg.stats.m_UBAssists;
    document.getElementById("profile_stats_db_goals").innerHTML = stats_msg.stats.m_DBGoals;
    document.getElementById("profile_stats_db_assists").innerHTML = stats_msg.stats.m_DBAssists;
    document.getElementById("profile_stats_time_played").innerHTML = time_str;
    document.getElementById("profile_stats_last_game").innerHTML = last_game_str;    
}

function ShowServerList() {

    var list_elem = document.getElementById("server_pick_button_container");
    list_elem.innerHTML = "";            

    console.log("Adding servers - " + server_data.m_ServerList);
    for(var idx in server_data.m_ServerList) {
        var val = server_data.m_ServerList[idx];
        var p = GetServerPing(idx);

        if(p == null) {
            p = '???';
        }
        
        var server_list_html = 
            '<button class="style3 game_server_button" onclick="PickServer(\''+idx+'\');">'+val.m_Name+'<br />Location: '+val.m_Location+'<br />Ping: '+p+'</button>';
        list_elem.innerHTML += server_list_html;
    }

    ShowPopup(5);
}

function PickServer(server_id) {
    RequestMapList(server_id);
    ShowPopup(-1);
}

function ShowGameCreate(map_list, server_id) {
    if(map_list.length == 0) {
        ShowRuntimeError("Server Has No Maps");
        return;
    }

    game_create_settings.maps = map_list;

    var map_html = '<div id="create_game_map_title_1" class="map_list_element_title">Community Maps</div>';
    var top_maps_html = '<div id="create_game_map_title_2" class="map_list_element_title">Standard Maps</div>';
    var beginner_maps_html = '<div id="create_game_map_title_2" class="map_list_element_title">Beginner Maps</div>';
    var default_map_index = 0;

    for(var index = 0; index < map_list.length; index++) {
        var map_div = '<div id="create_game_map_'+index+'" class="map_list_element" onclick="SelectMap('+index+');">' + game_create_settings.maps[index].map_name + '</div>';
        if(top_maps.indexOf(game_create_settings.maps[index].map_name.toLowerCase()) !== -1) {
            top_maps_html += map_div;
        } else if(beginner_maps.indexOf(game_create_settings.maps[index].map_name.toLowerCase()) !== -1) {
            beginner_maps_html += map_div;
        } else {
            map_html += map_div;
        }
        if(game_create_settings.maps[index].map_name.toLowerCase() === default_map){
            default_map_index = index;
        }
    }


    document.getElementById("create_game_map_list").innerHTML = beginner_maps_html + top_maps_html + map_html;
    document.getElementById("game_create_name").value = game_create_settings.name;
    document.getElementById("game_create_password").value = game_create_settings.password;

    if(game_create_settings.selected_map_index === -1)
        SelectMap(default_map_index);
    else
        SelectMap(game_create_settings.selected_map_index)

    ShowPopup(4);
}

function SelectMap(index) {
    if(index >= game_create_settings.maps.length) {
        return;
    }

    if(game_create_settings.selected_map_index != -1) {
        var elem = document.getElementById("create_game_map_" + game_create_settings.selected_map_index);

        if(elem != null) {
            elem.className = "map_list_element";
        }
    }

    game_create_settings.selected_map = game_create_settings.maps[index].map_name;
    game_create_settings.selected_map_index = index;

    document.getElementById("create_game_map_" + index).className = "map_list_element_selected";

    if(game_create_settings.time_limit !== -1){
        document.getElementById("game_create_time_limit").value = game_create_settings.time_limit;
        document.getElementById("game_create_time_limit_enabled").checked = game_create_settings.time_limit > 0;
    } else {
        document.getElementById("game_create_time_limit").value = game_create_settings.maps[index].time_limit;
        document.getElementById("game_create_time_limit_enabled").checked = game_create_settings.maps[index].time_limit > 0;
    }
    
    if(game_create_settings.score_limit !== -1){
        document.getElementById("game_create_score_limit").value = game_create_settings.score_limit;
        document.getElementById("game_create_score_limit_enabled").checked = game_create_settings.score_limit > 0;
    } else{
        document.getElementById("game_create_score_limit").value = game_create_settings.maps[index].score_limit;
        document.getElementById("game_create_score_limit_enabled").checked = game_create_settings.maps[index].score_limit > 0;
    }
    
    var player_limit = document.getElementById("game_create_player_limit");
    player_limit.value = game_create_settings.player_limit > 0 ? game_create_settings.player_limit : game_create_settings.maps[index].player_limit;
    player_limit.max = game_create_settings.maps[index].player_limit;
    player_limit.min = game_create_settings.maps[index].max_teams;

    document.getElementById("game_create_player_limit_label").innerHTML = 'Player Limit (Max ' + game_create_settings.maps[index].player_limit + '): ';

    var map_info = 
        'Map Name: ' + game_create_settings.maps[index].map_name +
        '<br />Author: ' + game_create_settings.maps[index].creator + '<br />\n';

    map_info += '<br />Game Type: ';
    if(game_create_settings.maps[index].game_type == 0) {
        map_info += 'Hockey';
    } else if(game_create_settings.maps[index].game_type == 1) {
        map_info += 'Dodgeball';
    } else {
        map_info += 'Pong';
    }

    map_info += '<br />Number of Teams: ' + game_create_settings.maps[index].max_teams + '<br />';

    document.getElementById('game_create_map_info').innerHTML = map_info;
}

function CreateGame() {
    var game_name = document.getElementById("game_create_name").value;
    if(game_name.length == 0) {
        ShowRuntimeError("You must provide a game name");
        return;
    }
    
    game_create_settings.name = game_name;

    var map = game_create_settings.selected_map;
    var password = document.getElementById("game_create_password").value;
    var time_limit = document.getElementById("game_create_time_limit_enabled").checked ? 
        Number(document.getElementById("game_create_time_limit").value) : 0;
    var score_limit = document.getElementById("game_create_score_limit_enabled").checked ? 
        Number(document.getElementById("game_create_score_limit").value) : 0;
    var player_limit = Number(document.getElementById("game_create_player_limit").value);

    game_create_settings.password = password;
    game_create_settings.time_limit = time_limit;
    game_create_settings.score_limit = score_limit;
    game_create_settings.player_limit = player_limit;

    if(localStorage !== undefined) {
        localStorage.setItem("game_create_settings", JSON.stringify(game_create_settings));
    }

    RequestCreateGame(map, game_name, password, score_limit, time_limit, player_limit);

    ShowPopup(-1);
}

function ShowTextPrompt(prompt_text, callback) {
    document.getElementById("text_prompt").innerHTML = htmlify(prompt_text);
    document.getElementById("text_prompt_popup_bkg").style.display = "block";

    var input = document.getElementById("text_prompt_input");

    input.value = "";
    input.focus();

    text_prompt_callback = callback;
}

function HandleShowTextPromptKeyDown(event) {
    if(event.keyCode == 13) {
        SubmitTextPrompt();
    }
}

function SubmitTextPrompt() {
    if(text_prompt_callback != null) {
        text_prompt_callback(document.getElementById("text_prompt_input").value);
    }
    HideTextPrompt();
}

function GotLobbyInfoForEdit(info) {
    edit_text_msg = {
        'c': 'edit_lobby_info',
        'data': ""
    };

    document.getElementById("text_edit_input").value = info;
    ShowPopup(8);
}

function GotChannelInfoForEdit(info, channel_id) {
    edit_text_msg = {
        'c': 'edit_channel_info',
        'channel_id': channel_id,
        'data': ""
    };

    document.getElementById("text_edit_input").value = info;
    ShowPopup(8);
}

function SubmitEditText() {
    edit_text_msg['data'] = document.getElementById("text_edit_input").value;
    SendSocketMessage(edit_text_msg);
    ShowPopup(-1);
}

function CancelTextPrompt() {
    text_prompt_callback = null;
    HideTextPrompt();
}

function HideTextPrompt() {

    document.getElementById("text_prompt_popup_bkg").style.display = "none";
}

function ShowRuntimeError(error_msg) {
    var popup = document.getElementById("runtime_error_popup_bkg").style.display = "block";
    var elem = document.getElementById("runtime_error_popup_msg");
    elem.innerHTML = htmlify(error_msg);
}

function CloseRuntimeError() {
    var popup = document.getElementById("runtime_error_popup_bkg").style.display = "none";
}

function GetAutoJoinHtml(elem, elem_id, idx, item_data) {
    return htmlify(item_data);
}