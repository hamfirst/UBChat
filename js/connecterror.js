
var mode_connecterr_html = `
<div id="connection_error" class="cyan_bkg" style="width: 450px; min-height: 160px; margin-top: 240px; padding: 5px 0;"> 
    <div id="msg" class="mega_header" style="text-align: center;"></div> 
    <button id="reconnect" class="style1" style="width:200px">Reconnect</button> 
    <button id="exit" class="style1" style="width:200px">Exit To Main Menu</button> 
</div> 
`;

function HandleReconnect() {
    RequestTicket();
}

function HandleReconnectExit() {
    SetupMainMenuView();
}

function SetupConnectErrorView(errormsg) {
    ShowPopup(-1);

    AttachModeHTML(mode_connecterr_html, UIMode.Login);

    dom_data = {
        connection_error:  document.getElementById("connection_error"),
        msg:         document.getElementById("msg"),
        reconnect:   document.getElementById("reconnect"),
        exit:        document.getElementById("exit")
    };

    dom_data.msg.innerHTML = errormsg;
    dom_data.reconnect.addEventListener("click", HandleReconnect);
    
    if(window.hasOwnProperty('ubfrontend')) {
        dom_data.exit.addEventListener("click", HandleReconnectExit);
    }
    else {
        dom_data.connection_error.removeChild(dom_data.exit);
    }
}
