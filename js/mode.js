
var UIMode = {
    MainMenu : 0,
    Login : 1,
    Connecting : 2,
    Chat: 3,
};


var mode_container = document.getElementById('main_container');
var current_mode = UIMode.Login;

function AttachModeHTML(html_data, uimode) {
    while (mode_container.firstChild) {
        mode_container.removeChild(mode_container.firstChild);
    }

    mode_container.innerHTML = html_data;
    current_mode = uimode;
}
