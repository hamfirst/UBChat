
var squad_popup_html = `
<div id="squad_popup_bkg" class="popup_bkg">
    <div id="squad_popup" class="blue_box">
        <div id="squad_header" class="strong_header">Squad</div>
        <div class="popup_close"><a onclick="ShowPopup(-1);">x</a></div>
        <hr class="header_separator" />
        <div id="squad_selector" class="popup_selector">
            <ul class="popup_list">
                <li id="squad_create_option" class="popup_list_elem" onclick="ShowSquadCategory(0);">Create</li>
                <li id="squad_join_option" class="popup_list_elem" onclick="ShowSquadCategory(1);">Join</li>
                <li id="squad_manage_option" class="popup_list_elem" onclick="ShowSquadCategory(2);">Manage</li>
            </ul>
        </div>

        <div id="squad_controls_container">
            <div id="squad_create">
                <div class="weak_header" style="text-align:center; margin-top:5vh;">
                    Create A Squad<br />&nbsp;
                </div>
                <div class="base_text" style="text-align:center;font-size:8pt;padding-bottom:10px;float:none;margin:auto;">
                    Squads are organizations of players that regularly play together.<br />
                    Players can be in more than one squad, but can only be the owner of one squad.<br />    
                    Players can only have one primary squad which can be set in the <a onclick="OpenProfile();">Profile</a> page<br />                 
                </div>       
                <br />         
                <div style="display:flex; justify-content:space-around;">
                    <div style="flex-grow: 1; text-align:center;">
                        <div>
                            Squad Name<br />
                            <input id="squad_name" style="width:30vh;margin: auto;" type="text" />
                            <div class="base_text" style="text-align:center;font-size:8pt;padding-bottom:10px;float:none;margin:auto;">
                                Must be a minimum of 3 characters<br />
                                and a maximum 32 characters.<br />
                                Letters, numbers, space, '-', '.', and '_' may be used.
                            </div>
                        </div>
                    </div>
                    <div style="flex-grow: 1; text-align:center;">
                        <div>
                            Squad Tag<br />
                            <input id="squad_tag" style="width:30vh;margin: auto;" type="text" />
                            <div class="base_text" style="text-align:center;font-size:8pt;padding-bottom:10px;float:none;margin:auto;">
                                This tag is what other players see in game<br />
                                And will be the name of your squad channel<br />
                                Must be 1 to 8 characters<br />
                                Only letters, numbers, '-', '.', and '_' may be used.
                            </div>
                        </div>
                    </div>
                </div>
                <div style="height:20vh;"></div>
                <div style="display:flex; justify-content:space-around;">
                    <button class="style3" style="width:30vh;margin:auto;" onclick="CreateSquad();">Create</button>
                </div>
            </div>    
            <div id="squad_disband">
                <div class="weak_header" style="text-align:center; margin-top:5vh;">
                    Disband Your Squad<br />&nbsp;<br />&nbsp;

                    <div class="base_text" style="text-align:center;font-size:8pt;padding-bottom:10px;float:none;margin:auto;">
                        Disbanding your squad destroys it for everyone.<br />
                        It cannot be undone.
                    </div>   

                    <div style="height:10vh;"></div>
                    Squad You Currently Own: <div id="squad_disband_name"></div><br />
                    <div style="display:flex; justify-content:space-around;">
                        <button class="style3" style="width:30vh;margin:auto;" onclick="DisbandSquad();">Disband</button>
                    </div>                    
                </div>
            </div>

            <div id="squad_join">
                <div class="weak_header" style="text-align:center;">
                    Join A Squad<br />&nbsp;

                    <div class="base_text" style="text-align:center;font-size:8pt;padding-bottom:10px;float:none;margin:auto;">
                        To join a squad, you can either apply to a squad and have a squad manager<br/>
                        accept your application, or a squad can send you an invite that you can later<br />
                        accept on your own terms.<br />
                        &nbsp;<br />
                        You can be in multiple squads simultaneously, but you can only have one primary squad<br />
                        To set which squad is your primary squad, use the <a onclick="OpenProfile();">Profile</a> menu
                    </div>  
                    <br />    
                    <button class="style3" style="margin:auto;margin-top:3px;width:30vh;height:30px;" 
                        onclick="OpenApplyToSquadPopup();">Apply To Squad</button>                               
                </div>

                <div style="display:flex; justify-content:space-around;bottom:20px;position:absolute;width:100%;">
                    <div>
                        <div class="weak_header" style="text-align:center">Applications</div>
                        <div id="squad_me_applications" class="blue_interior" style="width:45vh;height:30vh;">
                        </div>
                        <div style="display:flex; justify-content:space-around">
                            <button class="style3" style="width:30vh;margin:auto;margin-top:3px;width:80%;height:30px;" onclick="RescindApplication();">Rescind</button>
                        </div>
                    </div>
                    <div>
                        <div class="weak_header" style="text-align:center">Invites</div>
                        <div id="squad_me_invites" class="blue_interior" style="width:45vh;height:30vh;">
                        </div>
                        <div style="display:flex; justify-content:space-around">
                            <button class="style3" style="margin:auto;margin-top:3px;width:40%;height:30px;" onclick="AcceptSquadInvite();">Accept</button>
                            <button class="style3" style="margin:auto;margin-top:3px;width:40%;height:30px;" onclick="DeclineSquadInvite();">Decline</button>
                        </div>
                    </div>
                </div>
            </div>

            <div id="squad_manage_empty">
                <div class="weak_header" style="text-align:center; margin-top:20vh;">
                    You aren't in any squads
                </div>
            </div>

            <div id="squad_manage">
                <select id="squad_manage_squad" class="settings_dropdown" onchange="SelectSquadToManage();">
                </select>
                <ul id="options_list" class="options_list">
                    <li id="squad_manage_0" class="options_list_elem" onclick="ShowSquadManageCategory(0);"><a>Members</a></li>
                    <li id="squad_manage_1" class="options_list_elem" onclick="ShowSquadManageCategory(1);"><a>Invites</a></li>
                    <li id="squad_manage_2" class="options_list_elem" onclick="ShowSquadManageCategory(2);"><a>Applications</a></li>
                    <li id="squad_manage_3" class="options_list_elem" onclick="ShowSquadManageCategory(3);"><a>Channel</a></li>
                    <li id="squad_manage_4" class="options_list_elem" onclick="ShowSquadManageCategory(4);"><a>Leave</a></li>
                </ul>

                <div id="squad_manage_container" >
                    <div id="squad_manage_members">
                        <div style="display:flex; justify-content:flex-start;width:100%;">
                            <div style="margin-left:10px;">
                                <div class="weak_header">Member List:</div>
                                <div id="squad_manage_member_list" class="blue_interior">
                                </div>
                            </div>
                            <div style="margin-left:80px;margin-top:18px;">
                                <div id="squad_member_name" class="weak_header"></div>
                                <div id="squad_member_joined" class="weak_header"></div>
                                <br />
                                <div class="weak_header">Current Rank:</div>
                                <div id="squad_member_current_rank" class="weak_header" style="margin-left:20px">Captain</div>
                                <br />
                                <div id="squad_rank_container">
                                    <div class="weak_header">Set Rank:</div>
                                    <select id="squad_member_set_rank" class="settings_dropdown" onchange="ChangeRank();">
                                        <option>Honorary Member</option>
                                        <option>Member</option>
                                        <option>Captain</option>
                                        <option>Manager</option>
                                        <option>Owner</option>
                                    </select>
                                    <br />
                                    <button class="style3" style="margin-top:100px;" onclick="RemoveCurrentMember();">Remove Member</button>
                                </div>                 
                            </div>
                        </div>

                        <div class="base_text" style="font-size:8pt;position:absolute;bottom:50px;">
                            Squad ranks determine a player's permissions to act on the squad's behalf<br />
                            Each rank imparts the abilities of the ranks below<br />&nbsp;<br />
                            &nbsp;&nbsp;&nbsp;Owner - Can Disband The Squad<br />
                            &nbsp;&nbsp;&nbsp;Manager - Can Invite/Accept New Members and Remove Existing Members<br />
                            &nbsp;&nbsp;&nbsp;Captain - Can Change The Squad's Channel Properties<br />
                            &nbsp;&nbsp;&nbsp;Member - Can Set The Squad As Their Primary Squad<br />
                            &nbsp;&nbsp;&nbsp;Honorary Member - Can Join The Squad Channel While It Is Locked<br />
                        </div>
                    </div>

                    <div id="squad_manage_invites">
                        <div style="height:10vh;"></div>

                        <div style="display:flex; justify-content:space-around;width:100%;">
                            <button class="style3" style="width:30%;margin-top:100px;" onclick="InviteNewPlayer();">Invite A Player</button>
                        
                            <div>
                                <div class="weak_header">Pending Invites</div>
                                <div id="squad_manage_invite_list" class="blue_interior">
                                </div>

                                <button class="style3" onclick="RescindInvite();" style="width:100%">Rescind Invite</button>
                            </div>                            
                        </div>
                    </div>

                    <div id="squad_manage_applications">
                        <div style="height:10vh;"></div>

                        <div style="display:flex; justify-content:center;width:100%;">
                            <div>
                                <div class="weak_header">Pending Applications</div>
                                <div id="squad_manage_application_list" class="blue_interior">
                                </div>
                            </div>    
                            <div style="margin-left:30px;">                        
                                <button class="style3" style="width:100%;margin-top:25px;padding-left:30px;padding-right:30px;" onclick="AcceptApplication();">Accept Application</button>
                                <br />
                                <button class="style3" style="width:100%;margin-top:100px;padding-left:30px;padding-right:30px;" onclick="DeclineApplication();">Decline Application</button>
                            </div>
                        </div>
                    </div>

                    <div id="squad_manage_channel" style="padding-left:30px;padding-right:30px">
                        <div class="weak_header" style="display:inline">Channel Info:</div>
                        <div style="position:absolute;right:30px;display:inline;">
                            Channel Locked:
                            <input id="squad_manage_channel_lock" type="checkbox" style="display:inline;" class="settings_checkbox" onchange="ChangeLock();"></input>
                        </div>
                        <textarea id="squad_motd" style="height:49vh;"></textarea>

                        <div>
                            <button class="style3" style="width:35%" onclick="FetchCurrentMotd();">Fetch Current Text</button>                            
                            <button class="style3" style="width:50%;float:right;" onclick="SubmitMotd();">Set Channel Text</button>                            
                        </div>
                    </div>                                        

                    <div id="squad_manage_leave">
                        <div class="weak_header" style="text-align:center; margin-top:5vh;">
                            Leave This Squad<br />&nbsp;<br />&nbsp;

                            <div class="base_text" style="text-align:center;font-size:8pt;padding-bottom:10px;float:none;margin:auto;">
                                If you are the owner of this squad, you must disband it if you want to leave.
                            </div>   

                            <div style="height:10vh;"></div>
                            <div style="display:flex; justify-content:space-around;">
                                <button class="style3" style="width:30vh;margin:auto;" onclick="LeaveSquad();">Leave</button>
                            </div>                    
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
</div>
<div id="squad_disband_popup_bkg" class="popup_bkg">
    <div id="squad_disband_popup" class="red_box">
        <div id="squad_disband_popup_msg" class="weak_header">Are you sure you want to disband your squad?</div>
        <br />
        <button class="control_override" type="button" onclick="SquadDisbandFinalize();">Yes</button>
        <button class="control_override" type="button" onclick="CloseSquadDisbandPopup();">Cancel</button>
    </div>
</div>`;

var self_application_list = null;
var self_invite_list = null;

var squad_member_list = null;
var squad_application_list = null;
var squad_invite_list = null;

var active_squad_category = 0;
var active_synced_squad = 0;
var active_synced_squad_rank = 0;
var active_synced_member = -1;

var squad_pages = [];
var squad_options = [];
var squad_manage_options = [];
var squad_manage_pages = [];

function SetupSquadUI() {
    self_application_list = CreateList("squad_me_applications", "squad_me_application_", 
        GetSelfSquadApplicationHtml, "generic_list_element", "generic_list_element_selected");
    self_invite_list = CreateList("squad_me_invites", "squad_me_invite_", 
        GetSelfSquadApplicationHtml, "generic_list_element", "generic_list_element_selected");    

    squad_member_list = CreateList("squad_manage_member_list", "squad_member_", 
        GetSquadMemberHtml, "generic_list_element", "generic_list_element_selected"); 
    squad_member_list.onselect = SyncSquadManageMember;
    squad_member_list.onupdate = SyncSquadManageMember;

    squad_application_list = CreateList("squad_manage_application_list", "squad_application_", 
        GetSquadApplicationHtml, "generic_list_element", "generic_list_element_selected"); 
    squad_invite_list = CreateList("squad_manage_invite_list", "squad_invite_", 
        GetSquadApplicationHtml, "generic_list_element", "generic_list_element_selected");    

    squad_pages = [
        document.getElementById("squad_create"),
        document.getElementById("squad_disband"),
        document.getElementById("squad_join"),
        document.getElementById("squad_manage_empty"),
        document.getElementById("squad_manage")
    ];

    squad_options = [
        document.getElementById("squad_create_option"),
        document.getElementById("squad_join_option"),
        document.getElementById("squad_manage_option")
    ];

    squad_manage_options = [
        document.getElementById("squad_manage_0"),
        document.getElementById("squad_manage_1"),
        document.getElementById("squad_manage_2"),
        document.getElementById("squad_manage_3"),
        document.getElementById("squad_manage_4")
    ];

    squad_manage_pages = [
        document.getElementById("squad_manage_members"),
        document.getElementById("squad_manage_invites"),
        document.getElementById("squad_manage_applications"),
        document.getElementById("squad_manage_channel"),
        document.getElementById("squad_manage_leave")
    ];

    ShowSquadManageCategory(0);
}

function InitializeSquadCallbacks() {
    CreateChangeCallback(chat_callback_list, local_data, ".m_OwnerSquad", SyncSquadOwner);
    CreateListChangeCallback(chat_callback_list, local_data, ".m_Squads", 
        function(idx, val) { 
            console.log("New squad " + val.m_Name);
            AddSquadManageCategory(idx, val.m_Name);
            SyncSquadOwner();
        },
        function(idx, val) {
            console.log("Modified squad " + val.m_Name);
            SyncSquadOwner();
        },
        function(idx) {
            console.log("Squad removed " + idx);
            RemoveSquadManageCategory(idx);
        },
        function() {
            console.log("Squads cleared");
            ClearSquadManageCategories();
        });

    CreateListBinding(self_application_list, ".m_Applications", chat_callback_list, local_data);
    CreateListBinding(self_invite_list, ".m_Requests", chat_callback_list, local_data);

    active_synced_squad = 0;
}

function OpenSquadUI() {
    if(local_data.m_PrimarySquad == 0) {
        ShowSquadCategory(0);
    } else {
        ShowSquadCategory(2);
    }

    ShowPopup(1);
}

function ShowSquadCategory(category) {
    if(category == 0) {
        if(local_data.m_OwnerSquad == 0) {
            ShowSquadPage(0);
        } else {
            ShowSquadPage(1);
        }
    } else if(category == 1) {
        ShowSquadPage(2);
    } else if(category == 2) {
        if(Object.keys(local_data.m_Squads).length == 0) {
            ShowSquadPage(3);
        } else {
            ShowSquadPage(4);
        }
    }

    for(var index = 0; index < squad_options.length; index++) {
        if(index == category) {
            squad_options[index].classList.add("popup_list_elem_selected");
        } else {
            squad_options[index].classList.remove("popup_list_elem_selected");
        }
    }

    active_squad_category = category;
}

function ShowSquadPage(page) {
    for(var index = 0; index < squad_pages.length; index++) {
        if(index == page) {
            squad_pages[index].style.display = "block";
        } else {
            squad_pages[index].style.display = "none";
        }
    }
}

function SyncSquadOwner() {
    var elem = document.getElementById("squad_create_option");
    if(local_data.m_OwnerSquad == 0) {
        elem.innerHTML = "Create";
    } else {
        elem.innerHTML = "Disband";

        if(local_data.m_OwnerSquad in local_data.m_Squads) {
            document.getElementById("squad_disband_name").innerHTML = 
                "&lt;"+local_data.m_Squads[local_data.m_OwnerSquad].m_Tag+"&gt;" +
                local_data.m_Squads[local_data.m_OwnerSquad].m_Name;
        }
    }

    ShowSquadCategory(active_squad_category);
}

function SyncSquadManage(squad_id) {
    if(active_synced_squad == squad_id) {
        return;
    }

    if(active_synced_squad != 0) {
        RemoveChangeCallback(chat_callback_list, ".m_Squads["+active_synced_squad+"].m_Users");
        RemoveChangeCallback(chat_callback_list, ".m_Squads["+active_synced_squad+"].m_Applicants");
        RemoveChangeCallback(chat_callback_list, ".m_Squads["+active_synced_squad+"].m_Requests");
    }
    
    active_synced_squad = squad_id;
    if(squad_id != 0) {
        CreateListBinding(squad_member_list, ".m_Squads["+squad_id+"].m_Users", chat_callback_list, local_data);
        CreateListBinding(squad_application_list, ".m_Squads["+squad_id+"].m_Applicants", chat_callback_list, local_data);
        CreateListBinding(squad_invite_list, ".m_Squads["+squad_id+"].m_Requests", chat_callback_list, local_data);

        document.getElementById("squad_motd").value = local_data.m_Squads[squad_id].m_Motd;
        document.getElementById("squad_manage_channel_lock").checked = local_data.m_Squads[squad_id].m_Locked;
        
        RenderUserManagement();
    }
}

function RenderUserManagement() {
    active_synced_squad_rank = GetActiveSyncedSquadRank();

    var canManageUsers = (active_synced_squad_rank === "Manager" || active_synced_squad_rank === "Owner")
    
    if(canManageUsers) {
        document.getElementById("squad_rank_container").style.display = "block";
    }
    else {
        document.getElementById("squad_rank_container").style.display = "none";
    }
}

function GetActiveSyncedSquadRank() {  
    var currentSyncedSquad = local_data.m_Squads[active_synced_squad];

    var squad_keys = Object.keys(currentSyncedSquad.m_Users);
    
    for(var x = 0; x < squad_keys.length; x++) {
        var user_index = squad_keys[x];
        if(currentSyncedSquad.m_Users[user_index].m_UserKey === local_data.m_UserKey) {
            return GetRankName(currentSyncedSquad.m_Users[user_index].m_MembershipFlags);
        }
    }
}

function SyncSquadManageMember(member_index) {
    if(active_synced_squad in local_data.m_Squads) {
        if(member_index in local_data.m_Squads[active_synced_squad].m_Users) {
            
            var user = local_data.m_Squads[active_synced_squad].m_Users[member_index];
            
            var date = new Date();
            date.setTime(user.m_Joined * 1000);

            document.getElementById("squad_member_name").innerHTML = "Name: " + user.m_Name;
            document.getElementById("squad_member_joined").innerHTML = "Joined: " + date.toDateString();

            document.getElementById("squad_member_current_rank").innerHTML = GetRankName(user.m_MembershipFlags);

            active_synced_member = member_index;
            
            var rank_selection = document.getElementById("squad_member_set_rank");
            rank_selection.selectedIndex = user.m_MembershipFlags - 1;
            
            return;
        }
    }

    active_synced_member = -1;
}

function AddSquadManageCategory(squad_id, squad_name) {
    var squad_list = document.getElementById("squad_manage_squad");
    squad_list.innerHTML += '<option id="squad_id_'+squad_id+'" squad_id="'+squad_id+'">'+squad_name+'</option>';

    if(active_synced_squad == 0) {
        SyncSquadManage(squad_id);

        if(local_data.m_OwnerSquad == squad_id || active_squad_category == 1) {
            ShowSquadManageCategory(0);
            ShowSquadCategory(2);
        }
    }
}

function RemoveSquadManageCategory(squad_id) {
    var elem = document.getElementById("squad_id_"+squad_id);

    if(elem != null) {
        elem.remove();

        var squad_list = document.getElementById("squad_manage_squad");
        if(squad_list.length == 0) {
            ShowSquadCategory(2);
            ShowSquadPage(3);
            active_synced_squad = 0;

        } else if(squad_id == active_synced_squad) {
            SelectSquadToManage();
            ShowSquadManageCategory(0);
        }
    }
}

function ClearSquadManageCategories() {
    var squad_list = document.getElementById("squad_manage_squad");
    squad_list.innerHTML = "";
}

function SelectSquadToManage() {
    var squad_list = document.getElementById("squad_manage_squad");
    var squad_options = squad_list.options;

    var selected_option = squad_options[squad_list.selectedIndex];
    if(selected_option == null) {
        active_synced_squad = 0;
        return;
    }

    var squad_id = selected_option.attributes.squad_id.value;
    SyncSquadManage(squad_id);
}

function CreateSquad() {
    var squad_name = document.getElementById("squad_name").value;
    var squad_tag = document.getElementById("squad_tag").value;

    var msg = {
        'c': 'create_squad',
        'name': squad_name,
        'tag': squad_tag
    };

    SendSocketMessage(msg);
}

function DisbandSquad() {
    document.getElementById("squad_disband_popup_bkg").style.display = "block";
}

function SquadDisbandFinalize() {
    var msg = {
        'c': 'disband_squad' 
    };

    SendSocketMessage(msg);
    CloseSquadDisbandPopup();
}

function SquadApplyFinalize(squad) {
    var msg = {
        'c': 'squad_apply',
        'squad': squad
    };

    SendSocketMessage(msg);
}

function OpenApplyToSquadPopup() {
    ShowTextPrompt('Enter the Name Of the Squad', SquadApplyFinalize);
}

function GetSelfSquadApplicationHtml(elem, elem_id, idx, item_data) {
    var html = '&lt;' + item_data.m_SquadTag + '&gt; ' + item_data.m_SquadName;
    return html;
}

function GetSquadMemberHtml(elem, elem_id, idx, item_data) {
    var html = item_data.m_Name;
    return html;
}

function GetSquadApplicationHtml(elem, elem_id, idx, item_data) {
    var html = item_data.m_UserName;
    return html;
}

function RescindApplication() {
    var elem = self_application_list.GetSelection();
    if(elem == null) {
        return;
    }

    var msg = {
        'c': 'squad_apply_rescind',
        'squad': elem[1].m_SquadId
    };

    SendSocketMessage(msg);
}

function InviteNewPlayer() {
    ShowTextPrompt('Enter the Name Of the User', SquadInviteFinalize);
}

function SquadInviteFinalize(user) {
    var msg = {
        'c': 'squad_invite',        
        'squad': active_synced_squad,
        'user': user
    };

    SendSocketMessage(msg);
}

function RescindInvite() {
    var elem = squad_invite_list.GetSelection();
    if(elem == null) {
        return;
    }

    var msg = {
        'c': 'squad_invite_rescind',
        'squad': active_synced_squad,
        'user': elem[1].m_UserKey
    };

    SendSocketMessage(msg);
}

function AcceptSquadInvite() {
    var elem = self_invite_list.GetSelection();
    if(elem == null) {
        return;
    }

    var msg = {
        'c': 'squad_invite_accept',
        'squad': elem[1].m_SquadId
    };

    SendSocketMessage(msg);
}

function DeclineSquadInvite() {
    var elem = self_invite_list.GetSelection();
    if(elem == null) {
        return;
    }

    var msg = {
        'c': 'squad_invite_decline',
        'squad': elem[1].m_SquadId
    };

    SendSocketMessage(msg);
}

function AcceptApplication() {
    var elem = squad_application_list.GetSelection();
    if(elem == null) {
        return;
    }

    var msg = {
        'c': 'squad_apply_accept',
        'squad': active_synced_squad,
        'user': elem[1].m_UserKey
    };

    SendSocketMessage(msg);
}

function DeclineApplication() {
    var elem = squad_application_list.GetSelection();
    if(elem == null) {
        return;
    }

    var msg = {
        'c': 'squad_apply_decline',
        'squad': active_synced_squad,
        'user': elem[1].m_UserKey
    };

    SendSocketMessage(msg);
}

function ChangeRank() {
    if(active_synced_member == -1 || active_synced_squad == 0) {
        return;
    }

    var rank_selection = document.getElementById("squad_member_set_rank");

    if(active_synced_squad in local_data.m_Squads) {
        if(active_synced_member in local_data.m_Squads[active_synced_squad].m_Users) {
            var msg = {
                'c': 'squad_permissions',
                'squad': active_synced_squad,
                'member': local_data.m_Squads[active_synced_squad].m_Users[active_synced_member].m_UserKey,
                'rank': rank_selection.selectedIndex + 1
            };

            SendSocketMessage(msg);
        }
    }
}

function RemoveCurrentMember() {
    if(active_synced_member == -1 || active_synced_squad == 0) {
        return;
    }

    if(active_synced_squad in local_data.m_Squads) {
        if(active_synced_member in local_data.m_Squads[active_synced_squad].m_Users) {
            var msg = {
                'c': 'squad_remove',
                'squad': active_synced_squad,
                'user': local_data.m_Squads[active_synced_squad].m_Users[active_synced_member].m_UserKey
            };

            SendSocketMessage(msg);
        }
    }
}

function FetchCurrentMotd() {
    if(active_synced_squad == 0) {
        return;
    }

    if(active_synced_squad in local_data.m_Squads) {
        document.getElementById("squad_motd").value = local_data.m_Squads[active_synced_squad].m_Motd;
    }
}

function SubmitMotd() {
    if(active_synced_squad == 0) {
        return;
    }

    if(active_synced_squad in local_data.m_Squads) {
        var motd = document.getElementById("squad_motd").value;

        var msg = {
            'c': 'squad_motd',
            'squad': active_synced_squad,
            'motd': motd
        };

        SendSocketMessage(msg);
    }
}

function ChangeLock() {
    if(active_synced_squad == 0) {
        return;
    }

    if(active_synced_squad in local_data.m_Squads) {
        var locked = document.getElementById("squad_manage_channel_lock").checked;

        var msg = {
            'c': 'squad_lock',
            'squad': active_synced_squad,
            'lock': locked
        };

        SendSocketMessage(msg);
    }
}

function LeaveSquad() {
    if(active_synced_squad == 0) {
        return;
    }

    if(active_synced_squad in local_data.m_Squads) {
        var msg = {
            'c': 'squad_leave',
            'squad': active_synced_squad
        };

        SendSocketMessage(msg);
    }
}

function CloseSquadDisbandPopup() {
    document.getElementById("squad_disband_popup_bkg").style.display = "none";
}

function ShowSquadManageCategory(category) {
    for(var index = 0; index < squad_manage_options.length; index++) {
        if(index == category) {
            squad_manage_options[index].classList.add("options_list_elem_selected");
            squad_manage_pages[index].style.display = "block";
        } else {
            squad_manage_options[index].classList.remove("options_list_elem_selected");
            squad_manage_pages[index].style.display = "none";
        }
    }
}

function GetRankName(rank) {
    if(rank == 1) {
        return "Honorary Member";
    } else if(rank == 2) {
        return "Member";
    } else if(rank == 3) {
        return "Captain";
    } else if(rank == 4) {
        return "Manager";
    } else if(rank == 5) {
        return "Owner";
    }

    return "Non Member";
}