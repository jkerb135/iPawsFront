$(document).on("click", "#start", function(e){
    e.preventDefault();

    annyang.removeCommands(commands);
    commands = {
        "next": function() {
            $("#next").click();
        }
    };
    annyang.addCommands(commands);

    show_button_controls("next");
    next();
    starttime();
    starttotaltime();
});

$(document).on("click", "#next", function(e){
    e.preventDefault();

    annyang.removeCommands(commands);
    commands = {
        "done": function() {
            $("#done").click();
        }
    };
    annyang.addCommands(commands);

    show_button_controls("done");

    $('#morehelp').trigger('collapse');

    next();
    starttime();

});

$(document).on("click", "#done", function(e) {
    e.preventDefault();


    document.getElementById("pump_text").innerHTML = encouragements[Math.floor(Math.random()*(encouragements.length - 1 + 1)) + 0];

    annyang.removeCommands(commands);
    commands = {
        "next": function() {
            $("#next").click();
        }
    };
    annyang.addCommands(commands);

    show_button_controls("next","pump");

    $('#morehelp').trigger('collapse');

    endtime();
    finishMainStep();
});

$(document).on("click", "#finish", function(e) {
    e.preventDefault();
    if(urlParams != undefined) {
        alert("Please Close tab");
    }
    else{
    annyang.removeCommands(commands);
    commands = {
        "finish": function() {
            $("#finish").click();
        }
    };
    annyang.addCommands(commands);

    endtime();
    endtotaltime();
    completeTask();
    cleartask();

        window.location  = "#home";

    document.getElementById("finish").style.display = "none";
    }
});

$(document).on("pagebeforecreate", "#task", function () {
    cleartask();
});

/*$(document).on("click", "#listtask .taskpage", function (e) {
    e.preventDefault();

    var tasknum = $(this).prop('id');
    sessionStorage.setItem("taskname",$(this).text());
    sessionStorage.setItem("task", tasknum);
    sessionStorage.setItem("stepnum", 0);
    getMainSteps();
});*/

$(document).on("pagecreate", "#dotask",function(e){
    e.preventDefault();
    annyang.removeCommands(commands);
    commands = {
        "start": function() {
            $("#start").click();
        }
    };
    annyang.addCommands(commands);
    sessionStorage.setItem("used",0);
});

$(document).on("click","#detstep .dets", function(e) {
    e.preventDefault();

    $(this).wrap("<strike>");
    sessionStorage.setItem("used",parseInt(sessionStorage.used)+1);
    console.log("Detailed Steps Used:" + sessionStorage.used);
});

$(document).on("click", "#requestTask", function(e) {
    e.preventDefault();
    var Request = {
        'UserName': sessionStorage.getItem("UserName"),
        'TaskName': $('#name').val(),
        'TaskDescription': $('#desc').val(),
        'DateCompleted': $('#date').val()
    };

    $.ajax({
        type: "POST",
        url: api + 'api/User/RequestTask',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(Request),
        cache: false,
        success: function (data) {
            console.log(data);
            console.log(sessionStorage.getItem("UserName"));
            console.log(contact);

            sendMessage(sessionStorage.getItem("UserName"),sessionStorage.getItem("UserName") + " has requested you to create a task");
        }
    });

    var desc = document.getElementsByClassName("description");
    for( var i = 0; len = desc.length, i < len; i++){
        desc[i].value = "";
    }
});


$(document).on("click","#reset",function() {
    show_button_controls("start");
    cleartask();
});

//Clear session storage on logout confirmation
$(document).on("click","#yes",function() {
    logout();
    annyang.removeCommands(commands);

    commands = {
        'Login': function() {
            getLogin();
        }
    };

    annyang.addCommands(commands);
});

//Clear seesion data when going to another task
$(document).on("click","#clearrun",function() {
    cleartask();
});
