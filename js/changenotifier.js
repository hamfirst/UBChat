
function ParseChangePath(path) {
  var strs = path.split(/\.|\[|\]/);
  
  var assign_str = "";
  var elems = [];
  for(var i = 0; i < strs.length; i++) {
    if(strs[i] != "") {
      assign_str += "[\"" + strs[i] + "\"]";
      elems.push(strs[i]);
    }
  }
  
  return { "assign": assign_str, "elems": elems, "path": path };
}

function ParseChangeNotification(str) {
  var first_space = str.indexOf(' ');
  if(first_space == -1) {
    return null;
  }
  
  var operation = str.substr(0, first_space);
  if(operation == "kClear" || operation == "kCompress") {
    var temp_path = ParseChangePath(str.substr(first_space + 1));
    return { "op": operation, "path": temp_path };
  }
  
  first_space++;
  var next_space = str.indexOf(' ', first_space);
  if(next_space == -1) {
    return null;
  }
  
  var path = ParseChangePath(str.substr(first_space, next_space - first_space));
  
  next_space++;
  
  if(operation == "kSet") {
    var data = str.substr(next_space);
    return { "op": operation, "path": path, "data": data };
  }
  
  if(operation == "kRemove") {
    var index = str.substr(next_space);
    return { "op": operation, "path": path, "index": index };
  }
  
  if(operation == "kInsert") {
    var final_space = str.indexOf(' ', next_space);
    var insert_index = str.substr(next_space, final_space - next_space);
    var insert_data = str.substr(final_space + 1);
    return { "op": operation, "path": path, "index": insert_index, "data": insert_data };
  }
  
  return null;
}

function GetValueAtPath(path, obj) {
  return eval("obj" + path["assign"]);
}

function ApplyChangeNotification(change, obj) {
  if(change == null) {
    return obj;
  }
  
  if(change["op"] == "kSet") { 
    var set_eval_data = "obj" + change["path"]["assign"] + " = " + change["data"];
    eval(set_eval_data);
  }
  
  if(change["op"] == "kClear") {
    var clear_eval_data = "obj" + change["path"]["assign"] + " = {}";
    eval(clear_eval_data);
  }
  
  if(change["op"] == "kInsert") {
    var insert_eval_data = "obj" + change["path"]["assign"] + "[\"" + change["index"] + "\"] = " + change["data"];
    eval(insert_eval_data);
  }
  
  if(change["op"] == "kRemove") {
    var remove_eval_data = "delete obj" + change["path"]["assign"] + "[\"" + change["index"] + "\"]";
    eval(remove_eval_data);
  }
  
  return obj;
}

function CreateChangeCallback(callback_list, obj, change_path, onset_cb) {
  var path = ParseChangePath(change_path);
  callback_list.push({
    "path": path,
    "defunct": false,
    "onset": onset_cb
  });
 
  if(PathExistsInObject(path, obj)) {
    onset_cb(GetValueAtPath(path, obj));
  }
}

function CreateListChangeCallback(callback_list, obj, change_path, oninsert_cb, onmodify_cb, onremove_cb, onclear_cb) {
  var path = ParseChangePath(change_path);
  callback_list.push({
    "path": path,
    "defunct": false,
    "oninsert": oninsert_cb,
    "onmodify": onmodify_cb,
    "onremove": onremove_cb,
    "onclear": onclear_cb
  });
  
  onclear_cb();
  if(PathExistsInObject(path, obj)) {
    var val = GetValueAtPath(path, obj);
    if(IsList(val)) {
      for(var e in val) {
        oninsert_cb(e, val[e], true);
      }      
    }
  }
}

function RemoveChangeCallback(callback_list, change_path) {
  var num_elems = callback_list.length;
  for(var i = 0; i < num_elems; i++) {
    if(callback_list[i].path["path"] == change_path && callback_list[i].defunct == false) {
      callback_list[i].defunct = true;
      return;
    }
  }
}

function CleanupCallbackList(callback_list) {
  var num_elems = callback_list.length;
  for(var i = num_elems - 1; i >= 0; i--) {
    if(callback_list[i].defunct) {
      callback_list.splice(i, 1);
    }
  }
}

function PathExistsInObject(path, obj)
{
  var obj_ptr = obj;
  var num_elems = path["elems"].length;
  for(var i = 0; i < num_elems; i++) {
    if(path["elems"][i] in obj_ptr) {
      obj_ptr = obj_ptr[path["elems"][i]];
    }
    else {
      return false;
    }
  }
  
  return true;
}

function IsList(v) {
  if(typeof v !== 'object') {
    return false;
  }
  
  if(v === null) {
    return false;
  }
  
  if(v instanceof Array) {
    return false;
  }
  
  if(v instanceof Date) {
    return false;
  }
  
  return true;
}


function CallChangeCallbacks(change, callback_list, obj) {

  if(change["op"] == "kSet") {
    HandleSetChange(change, callback_list, obj);
  }
  
  if(change["op"] == "kClear") {
    HandleClearChange(change, callback_list, obj);
  }
  
  if(change["op"] == "kInsert") {
    HandleInsertChange(change, callback_list, obj);
  }
  
  if(change["op"] == "kRemove") {
    HandleRemoveChange(change, callback_list, obj);
  }
  
  CleanupCallbackList(callback_list);
}

function HandleSetChange(change, callback_list, obj) {
  var change_path = change["path"];
  var num_callbacks = callback_list.length;
  for(var i = 0; i < num_callbacks; i++) {
    var callback = callback_list[i];
    var callback_path = callback["path"];
    
    if(callback["defunct"]) {
      continue;
    }
            
    if(change_path["path"].length < callback_path["path"].length) {
      if(callback_path["path"].substr(0, change_path["path"].length) == change_path["path"]) {
        // Root level change
        if(PathExistsInObject(callback_path, obj)) {
          var val = GetValueAtPath(callback_path, obj);
            
          if("onset" in callback) {
            callback.onset(val);
          }
            
          if("onclear" in callback) {
            callback.onclear();
          }
            
          if("oninsert" in callback && IsList(val)) {
            for(var e in val) {
              callback.oninsert(e, val[e]);
            }
          }
        }
        else {
          if("ondelete" in callback) {
            callback.ondelete();
          }
        }
      }
    }
    else {
      if(change_path["path"].substr(0, callback_path["path"].length) == callback_path["path"]) {
        // Child level change         
        var parent_val = GetValueAtPath(callback_path, obj);
          
        if("onset" in callback) {
          callback.onset(parent_val);
        }
          
        if("onmodify" in callback) {
          var sub_index = change_path["elems"][callback_path["elems"].length];
          callback.onmodify(sub_index, parent_val[sub_index]);
        }
      }
    }
  }
}

function HandleClearChange(change, callback_list, obj) {
  var change_path = change["path"];
  var num_callbacks = callback_list.length;
  for(var i = 0; i < num_callbacks; i++) {
    var callback = callback_list[i];
    var callback_path = callback["path"];
    
    if(callback["defunct"]) {
      continue;
    }
            
    if(change_path["path"].length < callback_path["path"].length) {
      if(callback_path["path"].substr(0, change_path["path"].length) == change_path["path"]) {
        // Root level change
        if("ondelete" in callback) {
          callback.ondelete();
        }
        
        if("onclear" in callback) {
          callback.onclear();
        }
      }
    }
    else if(change_path["path"] == callback_path["path"]) {
      if("onclear" in callback) {
        callback.onclear();
      }
    }
    else if(change_path["path"].substr(0, callback_path["path"].length) == callback_path["path"]) { 
      // Child level change              
      if("onmodify" in callback) {
        var parent_val = GetValueAtPath(callback_path, obj);
        var sub_index = change_path["elems"][callback_path["elems"].length];
        callback.onmodify(sub_index, parent_val[sub_index]);
      }      
    }
  }
}

function HandleInsertChange(change, callback_list, obj) {
  var change_path = change["path"];
  var elem_path = change_path["path"] + '[' + change["index"] + ']';
  var num_callbacks = callback_list.length;
  for(var i = 0; i < num_callbacks; i++) {
    var callback = callback_list[i];
    var callback_path = callback["path"];
    
    if(callback["defunct"]) {
      continue;
    }
    
    if(elem_path.length < callback_path["path"].length) {
      if(callback_path["path"].substr(0, elem_path.length) == elem_path) {
        // Root level change
        if(PathExistsInObject(callback_path, obj)) {
          var val = GetValueAtPath(callback_path, obj);
            
          if("onset" in callback) {
            callback.onset(val);
          }
            
          if("onclear" in callback) {
            callback.onclear();
          }
            
          if("oninsert" in callback && IsList(val)) {
            for(var e in val) {
              callback.oninsert(e, val[e]);
            }
          }
        }        
      }
    }
    else if(change_path["path"] == callback_path["path"]) {
      if("oninsert" in callback) {
        var matching_val = GetValueAtPath(callback_path, obj);
        callback.oninsert(change["index"], matching_val[change["index"]]);
      }
    }
    else if(change_path["path"].substr(0, callback_path["path"].length) == callback_path["path"]) {   
      if("onmodify" in callback) {
        var parent_val = GetValueAtPath(callback_path, obj);
        var sub_index = change_path["elems"][callback_path["elems"].length];
        callback.onmodify(sub_index, parent_val[sub_index]);
      } 
    }
  }
}

function HandleRemoveChange(change, callback_list, obj) {
  var change_path = change["path"];
  var elem_path = change_path["path"] + '[' + change["index"] + ']';

  var num_callbacks = callback_list.length;
  for(var i = 0; i < num_callbacks; i++) {
    var callback = callback_list[i];
    var callback_path = callback["path"];
    
    if(callback["defunct"]) {
      continue;
    }
    
    if(elem_path.length < callback_path["path"].length) {
      if(callback_path["path"].substr(0, elem_path.length) == elem_path) {
        // Root level change
        if("ondelete" in callback) {
          callback.ondelete();
        }
          
        if("onclear" in callback) {
          callback.onclear();
        }
      }
    }
    else if(change_path["path"] == callback_path["path"]) {
      if("onremove" in callback) {
        callback.onremove(change["index"]);
      }
    }
    else if(change_path["path"].substr(0, callback_path["path"].length) == callback_path["path"]) {   
      if("onmodify" in callback) {
        var parent_val = GetValueAtPath(callback_path, obj);
        var sub_index = change_path["elems"][callback_path["elems"].length];
        callback.onmodify(sub_index, parent_val[sub_index]);
      } 
    }
  }
}

function ClearChangeCallbacks(callback_list) {

  var num_callbacks = callback_list.length;
  for(var i = 0; i < num_callbacks; i++) {
    var callback = callback_list[i];
    
    if("ondelete" in callback) {
      callback.ondelete();
    }
    
    if("onclear" in callback) {
      callback.onclear();
    }    
  }
}

// cases
/// thing comes into existence <- same as set, for lists nothing happens
/// thing gets modified <- call onset, for lists nothing happens?
/// thing gets destroyed <- not handled explicity, must be dealt with up stream?
/// child gets added <- call oninsert
/// child gets removed <- call onremove
/// child gets modified <- call onmodify


