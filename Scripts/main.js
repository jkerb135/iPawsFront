/**
 * Created by Josh on 1/21/2015.
 */

function starttime() {
    start = new Date().getTime();
}

function starttotaltime() {
    starttotal = new Date().getTime();
}

function endtime() {
    end = new Date().getTime();
    var time = (end - start);
    var seconds = (time / 1000);
    sessionStorage.setItem("timer", seconds);

}

function endtotaltime() {
    endtotal = new Date().getTime();
    var time = (endtotal - starttotal);
    console.log(endtotal);
    var totalseconds = (time / 1000);
    sessionStorage.setItem("TotalTime", totalseconds);

}

function completeTask() {
    if(sessionStorage.getItem("UserName") == undefined) return;
    var CompletedTask = {
        "CategoryID": sessionStorage.getItem("catid"),
        "TaskID": sessionStorage.getItem("task"),
        "TaskName": sessionStorage.getItem("taskname"),
        "AssignedUser": sessionStorage.getItem("UserName"),
        "TotalTime": sessionStorage.getItem("TotalTime"),
        'TotalDetailedStepsUsed': parseInt(sessionStorage.getItem('used'))
    };
    $.ajax({
        type: "POST",
        url: api + 'api/User/PostTaskCompleted',
        data: JSON.stringify(CompletedTask),
        contentType: "application/json;charset=utf-8",
        processData: true
    });

}

function finishMainStep() {
    if(sessionStorage.getItem("UserName")=== "null") return;
    var now = new Date;
    var CompletedMainStep = {
        "MainStepID": sessionStorage.getItem("stepid"),
        "TaskID": sessionStorage.getItem("task"),
        "MainStepName": sessionStorage.getItem("mainname"),
        "AssignedUser": sessionStorage.getItem("UserName"),
        "TotalTime": sessionStorage.getItem("timer"),
    };
    $.ajax({
        type: "POST",
        url: api + 'api/User/PostMainStepCompleted',
        data: JSON.stringify(CompletedMainStep),
        contentType: "application/json;charset=utf-8",
        processData: true
    });
}

function cleartask() {
    var keepuid = sessionStorage.getItem("UserName");
    var ip = sessionStorage.getItem("IP");
    var data = sessionStorage.getItem("data");
    sessionStorage.clear();
    sessionStorage.setItem("UserName", keepuid);
    sessionStorage.setItem("stepnum", 0);
    sessionStorage.setItem("IP", ip)
    sessionStorage.setItem("data", data);
}


function logout() {
    var uname = sessionStorage.getItem("UserName");
    if(uname === "null") return;
    var post = {
        "IpAddress": sessionStorage.getItem("IP"),
        "SignedIn": false,
        "Username": sessionStorage.getItem("UserName")

    }
    $.ajax({
        type: "POST",
        url: api + 'api/User/PostLoggedInIp',
        data: JSON.stringify(post),
        contentType: "application/json;charset=utf-8",
        processData: true

    });
    $.ajax({
        type: "POST",
        url: api + "/handlers/users.ashx",
        data: { action: 'logout', username: uname },
        dataType: "json",
        success: function (response) {
            alert(response.d)
        },
        error: function (response) {
            console.log(response.d)
        }
    });
    connection.server.removeUser(uname);
    refresh(uname + " has logged out.");
    sessionStorage.clear();
    console.log(sessionStorage);
}

/*function getMainSteps() {
    document.getElementById("start").style.display = "";

    $("#steptitle").text("");
    var task = sessionStorage.getItem("task");
    var curcat = sessionStorage.getItem(task);
    sessionStorage.setItem("catid", curcat);

    console.log(curcat);
    console.log(task);

    var total = 0;
    $("#bot").empty();
    //Team A user API
    $.getJSON(api + "api/MainStep/GetMainStepByTaskID/" + task,
        function(data) {
            console.log(data)
            if(data.length === 0){
                alert("No Steps Have Been Entered For This Tasks!");
            }
            else{
                window.location.href = "#dotask";

                for (var i = 0; len = data.length, i < len; i++){
                    var val = data[i];

                    total += 1;

                    var taskdet = new Task(val.mainStepId, val.mainStepName, val.audioPath, val.videoPath, val.image);

                    var store = JSON.stringify(taskdet);

                    sessionStorage.setItem("total", store);
                    sessionStorage.setItem("numofsteps", total);

                    sessionStorage.setItem('maintotal', total);
                    $("#bot").append('<li id="step' + total + '">' + val.mainStepName + '</li>');
                    $('#bot').listview().listview('refresh');
                }
            }
        });
} //end get main steps*/

function Task(mainStepId, mainStepName, audioPath, videoPath, imagePath) {
    this.mainStepId = mainStepId;
    this.mainStepName = mainStepName;
    this.audioPath = audioPath;
    this.videoPath = videoPath;
    this.imagePath = imagePath;
}

function getDetSteps(id) {
    $('ul ul').empty();
    var dtotal = 0;
    //Team A user API
    $.getJSON(api + "api/DetailedStep/GetDetailedStepById/" + id,
        function(data) {
            $.each(data, function(key, val) {
                dtotal += 1;
                if (val.imagePath != null) {
                    $("ul ul").append('<li class="dets" id="step' + val.id + '"><a href="#" ><img src="http://ipawsteamb.csweb.kutztown.edu' + val.imagePath.slice(1) + '" height="80" /><h2>Step: ' + dtotal + ':</h2><p> ' + val.detailedStepName + '</p></a></li>');
                } else {
                    $("ul ul").append('<li class="dets" id="step' + val.id + '"><a href="#" ><img src="http://teamcipaws.csweb.kutztown.edu/images/noimage.png" height="80" /><h2>Step: ' + dtotal + ':</h2><p> ' + val.detailedStepName + '</p></a></li>');
                }
                $('ul ul').listview().listview('refresh');
            });
        });

} //end get det steps

function next() {
    $('#morehelp').trigger('collapse');
    var stepup = sessionStorage.getItem("stepnum");
    stepup = parseInt(stepup);
    $('#step' + stepup).css("text-decoration", "line-through");
    stepup += 1;
    sessionStorage.setItem("stepnum", stepup);
    var end = sessionStorage.getItem("maintotal");

    if (end == stepup) {
        setpage();
        $("#next").hide();
        $("#done").hide();
        $("#finish").show();
    } else {
        setpage();
    }

}

function setpage() {
    var step = sessionStorage.getItem("stepnum");
    stepup = parseInt(step);
    var test = JSON.parse(sessionStorage.getItem(step));
    $("#steptitle").text(test.mainStepName);
    sessionStorage.setItem("mainname", test.mainStepName);
    $("#av").empty();
    if (test.videoPath != null) {
        $("#av").append('<video width="400" controls><source src="http://ipawsteamb.csweb.kutztown.edu/' + test.videoPath.slice(2) + '" type="video/mp4"><img src="http://teamcipaws.csweb.kutztown.edu/images/video.png" border="0" height="50px" /></video>');
    }
    if (test.audioPath != null) {
        $("#av").append('<audio width="400" controls><source src="http://ipawsteamb.csweb.kutztown.edu/' + test.audioPath.slice(2) + '" type="audio/mp3"><img src="http://teamcipaws.csweb.kutztown.edu/images/audio.png" border="0" height="50px" /></audio>');
    }
    $("#detailstep").empty();
    $("#image").empty();
    var id = (test.mainStepId);
    sessionStorage.setItem("stepid", id);
    getDetSteps(id);
}

$(function() {
 var login = "login";

    if (annyang) {
        commands = {
            login: function() {
                getLogin();
            }
        };

        annyang.addCommands(commands);

        annyang.start();
    }
    if(urlParams.taskId !== undefined){
        sessionStorage.setItem("task",urlParams['taskId']);
        getMainSteps();
        show_button_controls("start");
        sessionStorage.setItem("stepnum", 0);
        document.getElementById("clearrun").style['display'] = "none";
        document.getElementById("reset").style['display'] = "none";
    }else{
        $(document).bind('pageinit');
        hide_button_controls();
    }
}); //end doc ready function

function refresh(user, message){
    console.log(user);
    connection.server.refreshUsers(user, message);
}

function sendMessage(username, message) {
    contact.server.sendTaskRequest(username,message);
}

var urlParams;
(window.onpopstate = function () {
    var match,
        pl = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
        query = window.location.search.substring(1);

    urlParams = {};
    while ((match = search.exec(query)))
        urlParams[decode(match[1])] = decode(match[2]);
})();

