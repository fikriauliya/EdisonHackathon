var app = angular.module("myApp", []);

app.controller("IndexCtrl", function($scope, $http, $q, $filter, $location) {
  var ref = new Firebase("https://edison-hackathon.firebaseio.com/");
  var dateNow = moment().format("YYYY-MM-DD");
  var timeNow = moment().format("HH:mm:ss");

  $scope.curtemperature = 0;
  $scope.curnoise = 0;
  $scope.curlight = 0;

  var updateChart = function() {
    var curDate;
    var i = 0;
    curDate = moment().subtract(i, 'days').format("YYYY-MM-DD");
    
    var criteria = ["temperature", "noise", "light"];
    for (var j=0;j<criteria.length;j++) {
      (function(c) {
        ref.child(0).child(c).child(curDate).on("value", function(snapshot) {
          var history = snapshot.val();
    
          var labels = [];
          var data = [];

          var lastHistory = 0;

          var historyLength = 0;
          for (var k in history) {
            if (history.hasOwnProperty(k)) {
              data.push(history[k]);
              lastHistory = history[k];

              historyLength++;
            }
          }

          var i = 0;
          for (var k in history) {
            if (i % Math.floor(historyLength / 20) == 0) {
              labels.push(k);  
            } else {
              labels.push("");
            }
            i++;
          }

          $scope.$apply(function() {
            $scope["cur" + c] = lastHistory;
          })

          var ctx = document.getElementById(c + "Chart").getContext("2d");
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
          var myNewChart = new Chart(ctx).Line(chartData, {animation: false, scaleShowVerticalLines: false});
        });
      })(criteria[j]);
    }
  }

  updateChart();
});