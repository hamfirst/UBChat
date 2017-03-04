
function CreateAnimationSequence() {
    return [[], null];
}

function PushAnimation(anim_seq, time, complete_cb, update_cb, start_cb) {
    anim_seq[0].push([time, complete_cb, update_cb, start_cb]);
}

function StartNextAnim(anim_seq) {
    if(anim_seq[0].length == 0) {
        if(anim_seq[1] != null) {
            anim_seq[1]();
        }
        return;
    }

    var elem = anim_seq[0][0];
    anim_seq[0].splice(0, 1);

    if(elem[3] != null) {
        elem[3]();
    }

    if(elem[2] != null) {
        window.requestAnimationFrame(function() { UpdateNextAnimSeq(anim_seq, elem, performance.now()); });
    } else {
        setTimeout(function() { CompleteNextAnimSeq(anim_seq, elem); }, elem[0]);
    }
}

function UpdateNextAnimSeq(anim_seq, elem, start_time) {
    var n = performance.now();
    var delta = n - start_time;
    var val = delta / elem[0];
    if(val >= 1.0) {
        CompleteNextAnimSeq(anim_seq, elem);        
    } else {
        if(elem[2] != null) {
            elem[2](val);
        }
        
        window.requestAnimationFrame(function() { UpdateNextAnimSeq(anim_seq, elem, start_time); });
    }
}

function CompleteNextAnimSeq(anim_seq, elem) {
    if(elem[2] != null) {
        elem[2](1.0);
    }
    
    if(elem[1] != null) {
        elem[1]();
    }

    StartNextAnim(anim_seq);
}

function BeginAnimation(anim_seq, complete_cb) {
    anim_seq[1] = complete_cb;
    StartNextAnim(anim_seq);
}



