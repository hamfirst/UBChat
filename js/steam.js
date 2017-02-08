
var steam_login_html = `
<form id="steam_openid" accept-charset="UTF-8" action="https://steamcommunity.com/openid/login" enctype="application/x-www-form-urlencoded" method="post">
<input name="openid.return_to" type="hidden" value="http://{{host}}:8080/?src_url={{src_url}}" />
<input name="openid.realm" type="hidden" value="http://{{host}}:8080/" />
<input name="openid.ns" type="hidden" value="http://specs.openid.net/auth/2.0" />
<input name="openid.claimed_id" type="hidden" value="http://specs.openid.net/auth/2.0/identifier_select" />
<input name="openid.mode" type="hidden" value="checkid_setup" />
<input name="openid.identity" type="hidden" value="http://specs.openid.net/auth/2.0/identifier_select" />
</form>
<div style="height:30vh;"></div>
<img src="https://steamcommunity-a.akamaihd.net/public/images/signinthroughsteam/sits_02.png" onclick="dom_data.form.submit();" />`;

function SetupSteamLoginView() {
    var l = document.createElement("a");
    l.href = window.location.href;

    var local_url = window.location.href.split("#")[0];

    url_data = {
        src_url: encodeURIComponent(local_url),
        host: l.hostname
    }

    AttachModeHTML(Mustache.render(steam_login_html, url_data), UIMode.SteamLogin);

    dom_data = {
        form:        document.getElementById("steam_openid")
    };
}

