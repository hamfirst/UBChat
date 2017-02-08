var popup_menu_html = `
<div id="popup_menu_bkg" class="popup_menu_bkg" onclick="HidePopupMenu();" style="display:none;">
    <div id="popup_menu" class="general_box">
    </div>
</div>  
`;

function AttachPopupMenuHTML() {
    var popup_container = document.getElementById('popup_menu_container');
    while (popup_container.firstChild) {
        popup_container.removeChild(popup_container.firstChild);
    }
    
    popup_container.innerHTML = popup_menu_html;
}

function CreatePopup(actions) {
    var bkg = document.getElementById('popup_menu_bkg');
    bkg.style.display = "block";

    var container = document.getElementById('popup_menu');

    var html = '';
    for(var index = 0; index < actions.length; index++) {
        if(actions[index] == null) {
            html += '<hr class="popup_menu_separator"/>';
        } else {
            html += '<div class="popup_menu_element" onclick="'+actions[index][1]+'">'+actions[index][0]+'</div>';
        }
    }

    popup_menu_bkg
    container.style.position = 'absolute';
    container.style.left = '0px';
    container.style.top = '0px';
    container.style.width = 'auto';
    container.style.height = 'auto';
    container.innerHTML = html;

    container.style.left = Math.min(window.innerWidth - container.offsetWidth, mouse_x) + 'px';
    container.style.top = Math.min(window.innerHeight - container.offsetHeight, mouse_y) + 'px';
}

function HidePopupMenu()
{
    var bkg = document.getElementById('popup_menu_bkg');
    bkg.style.display = "none";
}

