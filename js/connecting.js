
var mode_connecting_html = `
<div class="cyan_bkg" style="width: 450px; height: 130px; margin-top: 240px; padding: 5px 0;"> \
    <div class="mega_header" style="text-align: center;">Connecting...</div> \
</div> \
`;

function HandleConnectingCancel() {
    RequestDisconnect();
    SetupLoginView("");
}

function SetupConnectingView() {
    console.log("Setting up connecting view");
    AttachModeHTML(mode_connecting_html, UIMode.Connecting);

    //dom_data = {
    //    cancel:   document.getElementById("cancel")
    //};

    //dom_data.cancel.addEventListener("click", HandleConnectingCancel);
}
