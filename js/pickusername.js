
var mode_create_username_html = `
<div class="cyan_bkg" style="width: 550px; height: 230px; margin-top: 240px; padding: 10px 0;">
    <div class="mega_header" style="text-align:center;margin-top:5px">Select a User Name</div>
    <div id="login_error">Your user name must be unique</div>
    <div class="base_text" style="text-align:center;font-size:8pt;width:100%;padding-bottom:10px;">
        Must be a minimum of 2 characters and a maximum 20 characters.
        <br />
        Only letters, numbers, '-', '.', and '_' may be used.</div>
    <div>
      <input id="user_name" name="user_name" type="text" style="width:260px"/>
      <button id="login" class="style1" style="width:200px;margin-top:20px;">Create Account</button>
    </div>
</div>
`;

function HandleCreateAccount() {
    SendUserName(dom_data.username.value);
    SetupConnectingView();
}

function SetupPickUserNameView(repick) {
    AttachModeHTML(mode_create_username_html, UIMode.Connecting);

    dom_data = {
        login:    document.getElementById("login"),
        username: document.getElementById("user_name"),
        loginerr: document.getElementById("login_error")
    };

    if(repick) {
      dom_data.loginerr.innerHTML = "That user name is taken or invalid";
    }
    
    dom_data.login.addEventListener("click", HandleCreateAccount);
}
