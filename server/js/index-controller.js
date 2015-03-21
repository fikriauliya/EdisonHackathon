var app = angular.module("myApp", []);

app.controller("IndexCtrl", function($scope, $http, $q, $filter, $location) {
  var ref = new Firebase("https://edison-hackathon.firebaseio.com/");
  var dateNow = moment().format("YYYY-MM-DD");
  var timeNow = moment().format("hh:mm");

  // Initializer
  ref.child("0").child("temperature").child(dateNow).child(timeNow).set((Math.random() * 10) + 1);
  ref.child("0").child("noise").child(dateNow).child(timeNow).set((Math.random() * 10) + 1);
  ref.child("0").child("light").child(dateNow).child(timeNow).set((Math.random() * 10) + 1);
  ref.child("0").child("button").child(dateNow).child(timeNow).set((Math.random() * 10) + 1);
});