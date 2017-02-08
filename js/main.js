
var dom_data = {};

function GotTicket(ticket) {
    RequestConnect(ticket, 'int');
}

function GotTicketFailed() {
    SetupConnectErrorView("Error contacting Steam");
}

function RequestTicket() {
    if(window.hasOwnProperty('ubfrontend')) {
        SetupConnectingView();
        window.GetTicket(GotTicket, GotTicketFailed);
    }
    else if(window.location.hash) {
        SetupConnectingView();
        var ticket = window.location.hash.substr(1);
        RequestConnect(ticket, 'ext');
        window.location.hash = '';
    }
    else {
        SetupSteamLoginView();
    }
}

function SetupInitialView() {
    if(window.hasOwnProperty('ubfrontend')) {
        window.oncontextmenu = function () {
            return false;
        }
        
        //SetupChatView();
        SetupMainMenuView();
    }
    else {
        RequestTicket();
    }
}

function LoadingComplete() {
    AttachPopupHTML();
    AttachPopupMenuHTML();

    SetupSquadUI();
    SetupInitialView();
}
