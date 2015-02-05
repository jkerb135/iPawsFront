/**
 * Created by Josh on 1/21/2015.
 */

show_button_controls = function(id, id2) {
    var controls = document.getElementsByClassName("control");
    for (var i = 0; len = controls.length, i < len; i++) {
        var control = controls[i];
        control.id === id || control.id === id2 ? control.style.display = "" : control.style.display = "none";
    }
}

hide_button_controls = function() {
    var controls = document.getElementsByClassName("control");
    for (var i = 0; len = controls.length, i < len; i++) {
        controls[i].style.display = "none";
    }
}