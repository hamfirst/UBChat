
var xp_popup_html = `
<div id="xp_popup_bkg" class="popup_bkg">
    <div id="xp_popup" class="blue_box">
        <div id="squad_header" class="strong_header">Rank Up!</div>
        <div class="popup_close"><a onclick="ShowPopup(-1);">x</a></div>
        <hr class="header_separator" />
        <div id="xp_bar_container">
            <div id="xp_bar">
                <div id="xp_bar_int"></div>
            </div>
            <div id="xp_bar_start">0xp</div>
            <div id="xp_bar_end">10000xp</div>
            <div class="weak_header" style="margin-left:30px">Current Rank: <span id="current_rank">10</span></div>
            <div class="tiny_header" style="margin-left:30px">Current XP: <span id="current_xp">1000</span></div>
        </div>
        <div id="xp_info_total">
            <div id="xp_total_label" class="massive_header">Total</div>
            <div id="xp_total" class="huge_header">0</div>
        </div>
        <div id="xp_info">
            <div class="weak_header">Points Earned:</div>
        </div>
        <div id="xp_rewards_label" class="tiny_header">Rewards:</div>
        <div id="xp_rewards">

        </div>
        <button id="xp_progress_button" class="control_override" type="button" onclick="ProgressXPPopup();">Next</button>
    </div>
</div>
`;

function CopyNode(node) {
    return function() { return node };
}

function ShowXPGain(xp_packet) {
    var xp_info = document.getElementById("xp_info");
    xp_info.style.opacity = 0;
    xp_info.innerHTML = '<div class="weak_header">Points Earned:</div>';

    var xp_rewards_label = document.getElementById("xp_rewards_label");
    xp_rewards_label.style.opacity = 0;

    var xp_rewards = document.getElementById("xp_rewards");
    xp_rewards.style.opacity = 0;

    var xp_info_total = document.getElementById("xp_info_total");
    xp_info_total.style.opacity = 0;

    var xp_progress_button = document.getElementById("xp_progress_button");
    xp_progress_button.style.opacity = 0;

    xp_total = document.getElementById("xp_total");
    xp_total.innerHTML = "0";

    var current_level_val = xp_packet.level;
    var current_xp_val = xp_packet.xp;

    if(current_level_val >= rewards.m_Ranks.length) {
        return;
    }

    var cur_level_xp = rewards.m_Ranks[current_level_val].m_XP;
    var start_level = current_level_val;
    var start_xp = current_xp_val;

    var current_rank = document.getElementById("current_rank");
    current_rank.innerHTML = " " + (current_level_val + 1);
    var current_xp = document.getElementById("current_xp");
    current_xp.innerHTML = " "  + current_xp_val;

    var xp_bar_start = document.getElementById("xp_bar_start");
    xp_bar_start.innerHTML = 0;

    var xp_bar_end = document.getElementById("xp_bar_end");
    xp_bar_end.innerHTML = cur_level_xp;

    var xp_bar = document.getElementById("xp_bar_int");
    xp_bar.style.width = (100 * current_xp_val / cur_level_xp) + "%";

    anim = CreateAnimationSequence();
    PushAnimation(anim, 500);
    PushAnimation(anim, 400, 
        function(){  xp_info_total.style.opacity = 1; xp_info.style.opacity = 1; },
        function(val){  xp_info_total.style.opacity = val; xp_info.style.opacity = val; });
    PushAnimation(anim, 500);

    var point_elems = [];
    if(xp_packet.xp_info.m_GamesWon > 0) {
        var point_elem = document.createElement("div");
        point_elem.classList.add("tiny_header");
        point_elem.classList.add("xp_info_element");
        point_elem.innerHTML = 'Games Won x' + xp_packet.xp_info.m_GamesWonCount + ': ' +  xp_packet.xp_info.m_GamesWon;
        point_elems.push([point_elem, xp_packet.xp_info.m_GamesWon]);
    }

    if(xp_packet.xp_info.m_GamesPlayed > 0) {
        var point_elem = document.createElement("div");
        point_elem.classList.add("tiny_header");
        point_elem.classList.add("xp_info_element");
        point_elem.innerHTML = 'Games Played x' + xp_packet.xp_info.m_GamesPlayedCount + ': ' +  xp_packet.xp_info.m_GamesPlayed;
        point_elems.push([point_elem, xp_packet.xp_info.m_GamesPlayed]);
    } 

    if(xp_packet.xp_info.m_Goals > 0) {
        var point_elem = document.createElement("div");
        point_elem.classList.add("tiny_header");
        point_elem.classList.add("xp_info_element");
        point_elem.innerHTML = 'Goals x' + xp_packet.xp_info.m_GoalsCount + ': ' +  xp_packet.xp_info.m_Goals;
        point_elems.push([point_elem, xp_packet.xp_info.m_Goals]);
    }

    if(xp_packet.xp_info.m_Assists > 0) {
        var point_elem = document.createElement("div");
        point_elem.classList.add("tiny_header");
        point_elem.classList.add("xp_info_element");
        point_elem.innerHTML = 'Assists x' + xp_packet.xp_info.m_AssistsCount + ': ' +  xp_packet.xp_info.m_Assists;
        point_elems.push([point_elem, xp_packet.xp_info.m_Assists]);
    }

    if(xp_packet.xp_info.m_Gifted > 0) {
        var point_elem = document.createElement("div");
        point_elem.classList.add("tiny_header");
        point_elem.classList.add("xp_info_element");
        point_elem.innerHTML = 'Gifts: ' + xp_packet.xp_info.m_Gifted;
        point_elems.push([point_elem, xp_packet.xp_info.m_Gifted]);
    } 

    var total_xp = 0;
    for(var index = 0; index < point_elems.length; index++) {
        let child = point_elems[index][0];
        child = xp_info.appendChild(child);

        let start_val = total_xp;
        total_xp += point_elems[index][1];
        let end_val = total_xp;

        PushAnimation(anim, 400, 
            function(){ child.style.opacity = 1; xp_total.innerHTML = end_val; },
            function(val){ child.style.opacity = val; xp_total.innerHTML = Math.floor(start_val * (1 - val) + end_val * val); });
        PushAnimation(anim, 200);
    }

    var rank_ups = [];
    while(total_xp > 0) {
        var anim_seq = CreateAnimationSequence();

        var needed_xp = cur_level_xp - current_xp_val;
        if(needed_xp > total_xp) {
            let start_xp = current_xp_val;
            let end_xp = current_xp_val + total_xp;
            let start_total_xp = total_xp;
            let end_total_xp = 0;
            let start_width = (100 * current_xp_val / cur_level_xp);
            let end_width = (100 * (current_xp_val + total_xp) / cur_level_xp);

            PushAnimation(anim_seq, total_xp,                 
                function() { 
                    current_xp.innerHTML = end_xp; 
                    xp_total.innerHTML = end_total_xp;
                    xp_bar.style.width = end_width + "%";
                },
                function(val) { 
                    current_xp.innerHTML = Math.floor(start_xp * (1 - val) + end_xp * val); 
                    xp_total.innerHTML = Math.floor(start_total_xp * (1 - val) + end_total_xp * val); 
                    xp_bar.style.width = (start_width * (1 - val) + end_width * val) + "%"; 
                });

            total_xp = 0;
        } else {
            let start_xp = current_xp_val;
            let end_xp = cur_level_xp;
            let start_total_xp = total_xp;
            let end_total_xp = total_xp - needed_xp;            
            let start_width = (100 * current_xp_val / cur_level_xp);
            let end_width = 100;

            let rewards_rank = current_level_val;

            PushAnimation(anim_seq, needed_xp,                 
                function() { 
                    current_xp.innerHTML = end_xp; 
                    xp_total.innerHTML = end_total_xp;
                    xp_bar.style.width = end_width + "%";
                },
                function(val) { 
                    current_xp.innerHTML = Math.floor(start_xp * (1 - val) + end_xp * val); 
                    xp_total.innerHTML = Math.floor(start_total_xp * (1 - val) + end_total_xp * val); 
                    xp_bar.style.width = (start_width * (1 - val) + end_width * val) + "%"; 
                });

            PushAnimation(anim_seq, 400,
                function(){ xp_rewards.style.opacity = 1; xp_rewards_label.style.opacity = 1; },
                function(val){ xp_rewards.style.opacity = val; xp_rewards_label.style.opacity = val; },
                function(){ 
                    var r = rewards.m_Ranks[rewards_rank].m_Rewards;
                    var rewards_html = '';
                    if('m_Titles' in r) {
                        for(var index = 0; index < r.m_Titles.length; index++) {
                            rewards_html += '<div class="tiny_header xp_rewards_element">Title: ' + r.m_Titles[index] + '</div>';
                        }
                    }

                    if('m_Icons' in r) {
                        for(var index = 0; index < r.m_Icons.length; index++) {
                            rewards_html += '<div class="tiny_header xp_rewards_element">Icon: ' + '<img src="' + r.m_Icons[index][1] + '" /> &nbsp;' + r.m_Icons[index][0] + '</div>';
                        }
                    }

                    if('m_Celebrations' in r) {
                        for(var index = 0; index < r.m_Celebrations.length; index++) {
                            rewards_html += '<div class="tiny_header xp_rewards_element">Celebration: ' + r.m_Celebrations[index][0] + '</div>';
                        }
                    }

                    if('m_AutoJoins' in r) {
                        for(var index = 0; index < r.m_AutoJoins.length; index++) {
                            rewards_html += '<div class="tiny_header xp_rewards_element">Channel Invites: ' + r.m_AutoJoins[index] + '</div>';
                        }
                    }

                    xp_rewards.innerHTML = rewards_html;
                 });

            current_level_val++;
            current_xp_val = 0;

            total_xp -= needed_xp;
        }

        rank_ups.push(anim_seq);

        if(current_level_val >= rewards.m_Ranks.length) {
            break;
        }
    }

    ShowPopup(9);
    BeginAnimation(anim, function() {
        ShowRankUp(rank_ups, start_level, start_xp);
    });
}

function ShowRankUp(rank_ups, current_level_val, current_xp_val) {
    if(rank_ups.length == 0) {
        ShowPopup(-1);
        return;
    }

    var elem = rank_ups[0];
    rank_ups.splice(0, 1);

    var xp_rewards = document.getElementById("xp_rewards");
    xp_rewards.style.opacity = 0;

    var xp_rewards_label = document.getElementById("xp_rewards_label");
    xp_rewards_label.style.opacity = 0;
    
    var xp_progress_button = document.getElementById("xp_progress_button");
    xp_progress_button.style.opacity = 0;

    var cur_level_xp = rewards.m_Ranks[current_level_val].m_XP;

    var current_rank = document.getElementById("current_rank");
    current_rank.innerHTML = " " + (current_level_val + 1);
    var current_xp = document.getElementById("current_xp");
    current_xp.innerHTML = " "  + current_xp_val;

    var xp_bar_start = document.getElementById("xp_bar_start");
    xp_bar_start.innerHTML = 0;

    var xp_bar_end = document.getElementById("xp_bar_end");
    xp_bar_end.innerHTML = cur_level_xp;

    var xp_bar = document.getElementById("xp_bar_int");
    xp_bar.style.width = (100 * current_xp_val / cur_level_xp) + "%";

    BeginAnimation(elem,
        function(){
            if(rank_ups.length == 0) {
                xp_progress_button.innerHTML = "Okay!";
                xp_progress_button.onclick = function() { ShowPopup(-1); }
                xp_progress_button.style.opacity = 1;
            } else {
                xp_progress_button.innerHTML = "Continue";
                xp_progress_button.onclick = function() { ShowRankUp(rank_ups, current_level_val + 1, 0); }
                xp_progress_button.style.opacity = 1;
            }
        });
}




