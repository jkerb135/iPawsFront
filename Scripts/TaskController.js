/**
 * Created by Josh on 2/4/2015.
 */
ipawsApp.controller('iPawsController', ['$scope', '$http', function ($scope, $http) {
    $scope.categories = [];
    var tasks = [];
    var mainsteps = [];
    var detailedSteps = [];

    if(sessionStorage.getItem("data") !== null){
        var data = JSON.parse(sessionStorage.getItem("data"));
        $scope.categories = data;
    }

    $scope.login = function(){
        var uname = "Tina Pelle";
        var password = "ku123.";

        //var uname = $("#uname").val();
        // var password = $("#password").val();

        $.ajax({
            type: "POST",
            url: api + "handlers/users.ashx",
            data: { action: 'login', username: uname, password: password },
            dataType: "json",
            success: function (response) {

                if(response.d !== "sign in success"){
                    alert("Credentials Invalid");
                    return;
                }
                sessionStorage.setItem("UserName", uname);
                window.location = "#home";
                $.get("http://ipinfo.io", function (data) {
                    sessionStorage.setItem("IP", data.ip)
                    var post = {
                        "IpAddress": sessionStorage.getItem("IP"),
                        "SignedIn": true,
                        "Username": uname
                    }
                    //Post Login Status
                    $.ajax({
                        type: "POST",
                        url: api + 'api/User/PostLoggedInIp',
                        data: JSON.stringify(post),
                        contentType: "application/json;charset=utf-8",
                        processData: true
                    });
                }, "jsonp");
                connection.server.addUser(uname);
                refresh(uname,uname + " has logged in");
                getUserData(uname);
            },
            error: function (response) {
                console.log(response);
                alert("error");
            }
        });

        annyang.removeCommands(commands)
        commands = {
            'logout': function() {
                $("#logout").click();
            },
            'complete a task': function(){
                $("#gettaskapi").click();
            }
        };
        annyang.addCommands(commands);
    }

    function getUserData(uname) {
        console.log('here');

        $http.get(api + '/api/user/GetByUser/' + uname).
            success(function (data) {
                console.log("session set");
                $scope.categories = data;
                (sessionStorage.setItem("data", JSON.stringify(data)));
            });
    }

    $scope.getTaskData = function(taskid){
        $http.get(api + '/api/user/GetTaskDetails/' + taskid).
            success(function (data) {
                console.log(data);
                if(data.length == 0){
                    alert("No Steps Have Been Entered For This Tasks!");
                }
                else{
                    $scope.tasks = data;
                    sessionStorage.setItem("taskdata", JSON.stringify(data));
                    window.location = "#dotask";
                }
            });
    }

}]);
