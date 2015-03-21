var app = angular.module("myApp", []);

app.controller("IndexCtrl", function($scope, $http, $q, $filter, $location) {
  var ref = new Firebase("https://edison-hackathon.firebaseio.com/");
  var dateNow = moment().format("YYYY-MM-DD");
  var timeNow = moment().format("HH:mm:ss");

  $scope.curTemperature = 0;
  $scope.curNoise = 0;
  $scope.curLight = 0;

  var updateChart = function() {
    var curDate;
    var i = 0;
    curDate = moment().subtract(i, 'days').format("YYYY-MM-DD");
    console.log(curDate);

    ref.child(0).child("temperature").child(curDate).on("value", function(snapshot) {
      var history = snapshot.val();
      console.log(history);

      var labels = [];
      var data = [];

      var lastHistory = 0;
      for (var k in history) {
        if (history.hasOwnProperty(k)) {
          labels.push(k);
          data.push(history[k]);

          lastHistory = history[k];
        }
      }

      $scope.$apply(function() {
        $scope.curTemperature = lastHistory;
      })

      var ctx = document.getElementById("temperatureChart").getContext("2d");
      var chartData = {
          labels: labels,
          datasets: [
              {
                  label: "My First dataset",
                  fillColor: "rgba(220,220,220,0.2)",
                  strokeColor: "rgba(220,220,220,1)",
                  pointColor: "rgba(220,220,220,1)",
                  pointStrokeColor: "#fff",
                  pointHighlightFill: "#fff",
                  pointHighlightStroke: "rgba(220,220,220,1)",
                  data: data
              }
          ]
      };
      var myNewChart = new Chart(ctx).Line(chartData, {animation: false});
    });

    ref.child(0).child("noise").child(curDate).on("value", function(snapshot) {
      var history = snapshot.val();
      console.log(history);

      var labels = [];
      var data = [];

      var lastHistory = 0;
      for (var k in history) {
        if (history.hasOwnProperty(k)) {
          labels.push(k);
          data.push(history[k]);

          lastHistory = history[k];
        }
      }

      $scope.$apply(function() {
        $scope.curNoise = lastHistory;
      })

      var ctx = document.getElementById("noiseChart").getContext("2d");
      var chartData = {
          labels: labels,
          datasets: [
              {
                  label: "My First dataset",
                  fillColor: "rgba(220,220,220,0.2)",
                  strokeColor: "rgba(220,220,220,1)",
                  pointColor: "rgba(220,220,220,1)",
                  pointStrokeColor: "#fff",
                  pointHighlightFill: "#fff",
                  pointHighlightStroke: "rgba(220,220,220,1)",
                  data: data
              }
          ]
      };
      var myNewChart = new Chart(ctx).Line(chartData, {animation: false});
    });

    ref.child(0).child("light").child(curDate).on("value", function(snapshot) {
      var history = snapshot.val();
      console.log(history);

      var labels = [];
      var data = [];

      var lastHistory = 0;
      for (var k in history) {
        if (history.hasOwnProperty(k)) {
          labels.push(k);
          data.push(history[k]);

          lastHistory = history[k];
        }
      }

      $scope.$apply(function() {
        $scope.curLight = lastHistory;
      })

      var ctx = document.getElementById("lightChart").getContext("2d");
      var chartData = {
          labels: labels,
          datasets: [
              {
                  label: "My First dataset",
                  fillColor: "rgba(220,220,220,0.2)",
                  strokeColor: "rgba(220,220,220,1)",
                  pointColor: "rgba(220,220,220,1)",
                  pointStrokeColor: "#fff",
                  pointHighlightFill: "#fff",
                  pointHighlightStroke: "rgba(220,220,220,1)",
                  data: data
              }
          ]
      };
      var myNewChart = new Chart(ctx).Line(chartData, {animation: false});
    });
  }

  updateChart();
});