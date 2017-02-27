
var current_settings = {};
var current_resolutions = [];
var current_paches = [];
var settings_initialized = false;

function GotSettings(settings_data, resolution_data, patch_data) {
    settings_initialized = false;

    current_settings = JSON.parse(settings_data);
    current_resolutions = JSON.parse(resolution_data);
    current_paches = JSON.parse(patch_data);

    ShowPopup(0);

    current_resolutions.sort(function(a, b) { 
            var a_dims = a.split('x');
            var b_dims = b.split('x');

            return (b_dims[0] * b_dims[1]) - (a_dims[0] * a_dims[1]);
        });

    var sel_resolution = 0;
    var test_resolution = null;
    if(current_settings.ResolutionX != 0 && current_settings.ResolutionY != 0) {
        test_resolution = current_settings.ResolutionX + "x" + current_settings.ResolutionY;

        for(var index = 0; index < current_resolutions.length; index++) {
            if(test_resolution == current_resolutions[index]) {
                sel_resolution = index + 1;
            }
        }
    }

    var res_elem_options = "";

    if(test_resolution != null && sel_resolution == 0) {
        res_elem_options += '<option value="'+test_resolution+'">'+test_resolution+'</option>';
    }

    res_elem_options += '<option value="default">Default</option>';

    for(var index = 0; index < current_resolutions.length; index++) {
        res_elem_options += '<option value="'+current_resolutions[index]+'">'+current_resolutions[index]+'</option>';
    }

    var res_elem = document.getElementById("resolution");
    res_elem.innerHTML = res_elem_options;
    res_elem.selectedIndex = sel_resolution;
    
    var patch_elem_options = "";
    var patch_sel_index = -1;

    for(var index = 0; index < current_paches.length; index++) {
        patch_elem_options += '<option value="'+current_paches[index]+'">'+current_paches[index]+'</option>';

        if(current_paches[index] == current_settings.Patch) {
            patch_sel_index = index;
        }
    }

    if(patch_sel_index == -1) {
        patch_elem_options += '<option value="'+current_settings.Patch+'">'+current_settings.Patch+'</option>';
        patch_sel_index = current_paches.length;
    }

    var patch_elem = document.getElementById('patch');
    patch_elem.innerHTML = patch_elem_options;
    patch_elem.selectedIndex = patch_sel_index;

    document.getElementById("fullscreen").checked = current_settings.FullScreen;
    document.getElementById("vsync").checked = current_settings.Vsync;
    document.getElementById("glmode").checked = current_settings.GLMode;
    document.getElementById("reticle").checked = current_settings.BallReticle;
    document.getElementById("directional_indicator").checked = !current_settings.HideDirectionalIndicator;
    document.getElementById("use_only_talk").checked = !current_settings.UseOnlyTalkKey;
    document.getElementById("draw_bkg").checked = current_settings.DrawBackground;

    document.getElementById("enable_audio").checked = current_settings.EnableAudio;
    document.getElementById("reverse_audio").checked = current_settings.ReverseAudio;

    var volume = document.getElementById("volume");
    volume.min = 0;
    volume.max = 1;
    volume.step = 0.01;
    volume.value = current_settings.Volume;

    for(var index = 0; index < 13; index++) {
        SyncSettingsButton(index);
    }

    document.getElementById("hold_score").checked = current_settings.HoldScoreButton;
    document.getElementById("save_replay").checked = !(current_settings.DisableReplaySave || false);

    var spin_rate = document.getElementById("spin_rate");
    spin_rate.min = 0;
    spin_rate.max = 2;
    spin_rate.step = 1;
    spin_rate.value = current_settings.SpinRate;
    
    settings_initialized = true;
}

function GotSettingsFailed() {

}

function OpenSettings() {
    window.GetSettings(GotSettings, GotSettingsFailed);
}

function SyncSettingsButton(button_id) {
    if(button_id == 0) {
        document.getElementById("ctrl_up").innerHTML = GetKeyName(current_settings.ControlUp);
    }
    else if(button_id == 1) {
        document.getElementById("ctrl_left").innerHTML = GetKeyName(current_settings.ControlLeft);
    }
    else if(button_id == 2) {
        document.getElementById("ctrl_right").innerHTML = GetKeyName(current_settings.ControlRight);
    }
    else if(button_id == 3) {
        document.getElementById("ctrl_down").innerHTML = GetKeyName(current_settings.ControlDown);
    }
    else if(button_id == 4) {
        document.getElementById("ctrl_break").innerHTML = GetKeyName(current_settings.ControlBreak);
    }
    else if(button_id == 5) {
        document.getElementById("ctrl_talk").innerHTML = GetKeyName(current_settings.ControlTalk);
    }
    else if(button_id == 6) {
        document.getElementById("ctrl_talk_team").innerHTML = GetKeyName(current_settings.ControlTeamTalk);
    }
    else if(button_id == 7) {
        document.getElementById("ctrl_rotccw").innerHTML = GetKeyName(current_settings.ControlRotateCCW);
    }
    else if(button_id == 8) {
        document.getElementById("ctrl_rotcw").innerHTML = GetKeyName(current_settings.ControlRotateCW);
    }
    else if(button_id == 9) {
        document.getElementById("ctrl_volup").innerHTML = GetKeyName(current_settings.ControlVolUp);
    }
    else if(button_id == 10) {
        document.getElementById("ctrl_voldown").innerHTML = GetKeyName(current_settings.ControlVolDown);
    }
    else if(button_id == 11) {
        document.getElementById("ctrl_score").innerHTML = GetKeyName(current_settings.ControlViewScores);
    }
    else if(button_id == 12) {
        document.getElementById("ctrl_ping").innerHTML = GetKeyName(current_settings.ControlPing);
    }    
}

var capture_keypress_id = -1;
function CaptureKeypress(control_id) {
    capture_keypress_id = control_id;
    console.log("press");

    var popup = document.getElementById("control_override_popup_bkg");
    popup.style.display = "table";
    popup.style.position = "absolute";
}

function CancelCaptureKeypress() {
    capture_keypress_id = -1;
    CloseCaptureKeypressPopup();
}

function CloseCaptureKeypressPopup() {
    var popup = document.getElementById("control_override_popup_bkg");
    popup.style.display = "none";
    popup.style.position = "fixed";
}

document.onkeydown = function(e) {
    if(capture_keypress_id != -1) {
        console.log("Got key press");
        console.log(e.keyCode);

        var keycode = e.keyCode;
        if(e.location == 2 || e.keyLocation == 2) {
            keycode += 10000;
        }

        if(capture_keypress_id == 0) {
            current_settings.ControlUp = keycode;
        } else if(capture_keypress_id == 1) {
            current_settings.ControlLeft = keycode;
        } else if(capture_keypress_id == 2) {
            current_settings.ControlRight = keycode;
        } else if(capture_keypress_id == 3) {
            current_settings.ControlDown = keycode;
        } else if(capture_keypress_id == 4) {
            current_settings.ControlBreak = keycode;
        } else if(capture_keypress_id == 5) {
            current_settings.ControlTalk = keycode;
        } else if(capture_keypress_id == 6) {
            current_settings.ControlTeamTalk = keycode;
        } else if(capture_keypress_id == 7) {
            current_settings.ControlRotateCCW = keycode;
        } else if(capture_keypress_id == 8) {
            current_settings.ControlRotateCW = keycode;
        } else if(capture_keypress_id == 9) {
            current_settings.ControlVolUp = keycode;
        } else if(capture_keypress_id == 10) {
            current_settings.ControlVolDown = keycode;
        } else if(capture_keypress_id == 11) {
            current_settings.ControlViewScores = keycode;
        }  else if(capture_keypress_id == 12) {
            current_settings.ControlPing = keycode;
        } 

        SyncSettingsButton(capture_keypress_id);
        SaveSettings();

        capture_keypress_id = -1;
        CloseCaptureKeypressPopup();
        
        e.preventDefault();
    }
}

function HandleExtMouseButtonPress(button_id) {
    if(capture_keypress_id != -1) {
        console.log("Got mouse button press");
        console.log(button_id);

        button_id += 20000;

        if(capture_keypress_id == 0) {
            current_settings.ControlUp = button_id;
        } else if(capture_keypress_id == 1) {
            current_settings.ControlLeft = button_id;
        } else if(capture_keypress_id == 2) {
            current_settings.ControlRight = button_id;
        } else if(capture_keypress_id == 3) {
            current_settings.ControlDown = button_id;
        } else if(capture_keypress_id == 4) {
            current_settings.ControlBreak = button_id;
        } else if(capture_keypress_id == 5) {
            current_settings.ControlTalk = button_id;
        } else if(capture_keypress_id == 6) {
            current_settings.ControlTeamTalk = button_id;
        } else if(capture_keypress_id == 7) {
            current_settings.ControlRotateCCW = button_id;
        } else if(capture_keypress_id == 8) {
            current_settings.ControlRotateCW = button_id;
        } else if(capture_keypress_id == 9) {
            current_settings.ControlVolUp = button_id;
        } else if(capture_keypress_id == 10) {
            current_settings.ControlVolDown = button_id;
        } else if(capture_keypress_id == 11) {
            current_settings.ControlViewScores = button_id;
        }  else if(capture_keypress_id == 12) {
            current_settings.ControlPing = button_id;
        } 

        SyncSettingsButton(capture_keypress_id);
        SaveSettings();

        capture_keypress_id = -1;
        CloseCaptureKeypressPopup();

        e.preventDefault();
    }
}

function SaveSettings() {
    window.WriteSettings(JSON.stringify(current_settings, null, 2));
}

function ResolutionChanged() {
    if(settings_initialized == false) return;

    var res_elem = document.getElementById("resolution");
    var res = res_elem.value;
    if(res == "default") {
        current_settings.ResolutionX = 0;
        current_settings.ResolutionY = 0;
    } else {
        var dim = res.split('x');
        current_settings.ResolutionX = Number(dim[0]);
        current_settings.ResolutionY = Number(dim[1]);
    }

    SaveSettings();
}

function FullScreenChanged() {
    if(settings_initialized == false) return;
    current_settings.FullScreen = document.getElementById("fullscreen").checked;
    SaveSettings();
}

function VsyncChanged() {
    if(settings_initialized == false) return;
    current_settings.Vsync = document.getElementById("vsync").checked;
    SaveSettings();
}

function GLModeChanged() {
    if(settings_initialized == false) return;
    current_settings.GLMode = document.getElementById("glmode").checked;
    SaveSettings();
}

function LockMouseChanged() {
    if(settings_initialized == false) return;
    current_settings.LockMouse = document.getElementById("lock_mouse").checked;
    SaveSettings();
}

function BallReticleChanged() {
    if(settings_initialized == false) return;
    current_settings.BallReticle = document.getElementById("reticle").checked;
    SaveSettings();
}

function DirectionalIndicatorChanged() {
    if(settings_initialized == false) return;
    current_settings.HideDirectionalIndicator = !document.getElementById("directional_indicator").checked;
    SaveSettings();
}

function DrawBackgroundChanged() {
    if(settings_initialized == false) return;
    current_settings.DrawBackground = document.getElementById("draw_bkg").checked;
    SaveSettings();
}

function PatchChanged() {
    if(settings_initialized == false) return;
    current_settings.Patch = document.getElementById("patch").value;
    SaveSettings();
}

function EnableAudioChanged() {
    if(settings_initialized == false) return;
    current_settings.EnableAudio = document.getElementById("enable_audio").checked;
    SaveSettings();
}

function ReverseAudioChanged() {
    if(settings_initialized == false) return;
    current_settings.ReverseAudio = document.getElementById("reverse_audio").checked;
    SaveSettings();
}

function VolumeChanged() {
    if(settings_initialized == false) return;
    current_settings.Volume = Number(document.getElementById("volume").value);
    SaveSettings();
}

function UseOnlyTalkKeyChanged() {
    if(settings_initialized == false) return;
    current_settings.UseOnlyTalkKey = !document.getElementById("use_only_talk").checked;
    SaveSettings();
}

function HoldScoreChanged() {
    if(settings_initialized == false) return;
    current_settings.HoldScoreButton = document.getElementById("hold_score").checked;
    SaveSettings();
}

function SpinRateChanged() {
    if(settings_initialized == false) return;
    current_settings.SpinRate = Number(document.getElementById("spin_rate").value);
    SaveSettings();
}

function SaveReplayChanged() {
    if(settings_initialized == false) return;
    current_settings.DisableReplaySave = !document.getElementById("save_replay").checked;
    SaveSettings();
}
