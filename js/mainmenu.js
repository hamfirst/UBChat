
var mainmenu_html = `
<img id="watermark" src="img/ublogo_huge.png" />
<div id="main_menu">
    <button class="style2" onclick="GoOnline();">Play Online</button>
    <button class="style2" onclick="PlayOffline();" style="width:calc(50% - 3px); float:left;">Offline Map Test</button>
    <button class="style2" onclick="PlayReplay();" style="width:calc(50% - 3px); margin-left:6px;">Play Replay</button>
    <hr>
    <button class="style2" onclick="OpenSettings();">Settings</button>
    <button class="style2" onclick="QuitLobby();">Quit</button>
</div>
`;

function SetupMainMenuView() {
    
    console.log("Setting up main menu view");
    AttachModeHTML(mainmenu_html, UIMode.MainMenu);
}

function GoOnline() {
    RequestTicket();
}

function GotOfflineMaps(maps) {
    ShowPopup(3);

    var list_container = document.getElementById('map_list');
    var html = "";
    for(var index = 0; index < maps.length; index++) {
        html += "<li onclick=\"PlayOfflineMap('" + maps[index] + "')\">" + maps[index] + "</li>"
    }

    list_container.innerHTML = html;
}

function GotOfflineMapsFailed() {

}

function PlayOffline() {
    window.GetOfflineMaps(GotOfflineMaps, GotOfflineMapsFailed);
}

function PlayOfflineMap(map_name) {
    console.log("Playing offline " + map_name);
    window.PlayOfflineExecute(map_name);
    ShowPopup(-1);
}

function GotReplays(replays) {
    ShowPopup(2);

    var list_container = document.getElementById('demo_list');
    var html = "";
    for(var index = 0; index < replays.length; index++) {
        html += "<li onclick=\"PlayOfflineReplay('" + replays[index] + "')\">" + replays[index] + "</li>"
    }

    list_container.innerHTML = html;
}

function GotReplaysFailed() {

}

function PlayReplay() {
    window.GetReplays(GotReplays, GotReplaysFailed);
}

function PlayOfflineReplay(replay_name) {
    console.log("Playing replay " + replay_name);
    window.PlayReplayExecute(replay_name);
    ShowPopup(-1);
}


function QuitLobby() {
    console.log("Quitting");
    window.Quit();
}
