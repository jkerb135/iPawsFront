/**
 * Created by Josh on 1/21/2015.
 */
var wait = 0;
var end;
var start;
var endtotal;
var starttotal;
var commands;
var encouragements = ["Excellent job!","Keep up the good work!","You're doing great!","Good Job!","Nice work!"];

var ipawsApp = angular.module('iPawsFrontEnd', []);

var api = "http://ipaws.ngrok.com/";
//var api = "http://ipawsteamb.csweb.kutztown.edu/";

$.connection.hub.url = "http://ipaws.ngrok.com/signalr";
var connection = $.connection.userHub;


$.connection.hub.start()
    .done(function () {
    })
    .fail(function () {
        console.log("Could Not Connect");
    });

