

function CreateList(elem_parent_id, item_id_prefix, element_creator_cb, default_class, selected_class) {
    var list = {
        'parent': document.getElementById(elem_parent_id),
        'selected_element': -1,
        'elems': {},
        'onselect': null,
        'onupdate': null,
        'element_type': 'div',

        'CreateElem': function(idx, item_data) {
            var elem_id = item_id_prefix + idx;

            var elem = document.createElement(this.element_type);

            var html = element_creator_cb(elem, elem_id, idx, item_data);
            elem.innerHTML = html;
            elem.className = default_class;
            elem.id = elem_id;
            
            var self = this;
            elem.onclick = function() 
            { 
                self.SelectElem(idx); 
            };

            this.elems[idx] = [elem, item_data];

            this.parent.appendChild(elem);

            if(this.selected_element == -1) {
                this.SelectElem(idx);
            }
        },

        'UpdateElem': function(idx, item_data) {
            
            var elem_id = item_id_prefix + idx;
            var elem = this.elems[idx][0];
            this.elems[idx][1] = item_data;

            var html = element_creator_cb(elem, elem_id, idx, item_data);
            elem.innerHTML = html;

            if(this.onupdate != null) {
                this.onupdate(this.selected_element);
            }
        },

        'RemoveElem': function(idx) {
            var elem_id = item_id_prefix + idx;

            var keys = Object.keys(this.elems);
            if(idx == this.selected_element) {
                if(keys.length == 1) {
                    this.selected_element = -1;
                } else {
                    var array_index = -1;
                    keys.find(function (elem, index) { if(elem == idx) { array_index = index; return true; } return false; })

                    if(array_index == keys.length - 1) {
                        this.SelectElem(keys[array_index - 1]);
                    } else {
                        this.SelectElem(keys[array_index + 1]);
                    }
                }
            }

            if(idx in this.elems) {
                this.parent.removeChild(this.elems[idx][0]);
                delete this.elems[idx];
            }
        },

        'SelectElem': function(idx) {
            if(idx == this.selected_element) {
                return;
            }

            var elem_id = item_id_prefix + idx;
            var prev_id = this.selected_element != -1 ? item_id_prefix + this.selected_element : "";

            var new_selection = null;
            for(var child = this.parent.firstElementChild; child !== null; child = child.nextElementSibling) {
                if(child.id == elem_id) {
                    new_selection = child;
                }

                if(child.id == prev_id) {
                    child.classList.remove(selected_class);
                }
            }

            if(new_selection != null) {
                new_selection.classList.add(selected_class);
            }

            this.selected_element = idx;

            if(this.onselect != null) {
                this.onselect(this.selected_element);
            }
        },

        'ClearElems': function() {
            this.parent.innerHTML = "";
            this.elems = {};
            this.selected_element = -1;
        },

        'GetSelection': function() {
            if(this.selected_element == -1) {
                return null;
            }

            for(var idx in this.elems) {
                if(idx == this.selected_element) {
                    return [idx, this.elems[idx][1]];
                }
            }

            return null;
        }
    };

    return list;
}

function CreateListBinding(list, path, callback_list, data) {
    list.ClearElems();
    CreateListChangeCallback(callback_list, data, path, 
        function(idx, val) { 
            list.CreateElem(idx, val);
        },
        function(idx, val) {
            list.UpdateElem(idx, val);
        },
        function(idx) {
            list.RemoveElem(idx);
        },
        function() {
            list.ClearElems();
        }); 
}

