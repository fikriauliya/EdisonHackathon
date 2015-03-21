var app = angular.module("myApp", []);

app.controller("IndexCtrl", function($scope, $http, $q, $filter, $location) {
  var ref = new Firebase("https://edison-hackathon.firebaseio.com/");
  var dateNow = moment().format("YYYY-MM-DD");
  var timeNow = moment().format("HH:mm:ss");

  $scope.curtemperature = null;
  $scope.curnoise = null;
  $scope.curlight = null;
  $scope.iDay = 0;
  $scope.curDate = null;

  var sendSms = function(number, message) {
    $http.get('http://localhost:3000/?number=' + number + '&message=' + message);
  }
  var lastNotificationSent = moment();

  $scope.updateChart = function(iDay) {
    $scope.iDay = iDay;
    var curDate;
    var curDate = moment().add(iDay, 'days').format("YYYY-MM-DD");
    $scope.curDate = curDate;
    
    console.log("Unsubcribe");
    ref.off();

    var criteria = ["temperature", "noise", "light"];
    for (var j=0;j<criteria.length;j++) {
      (function(c) {
        var ctx = document.getElementById(c + "Chart").getContext("2d");
        var chartData = {
            labels: [],
            datasets: [
                {
                    label: "My First dataset",
                    fillColor: "rgba(220,220,220,0.2)",
                    strokeColor: "rgba(220,220,220,1)",
                    pointColor: "rgba(220,220,220,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(220,220,220,1)",
                    data: []
                }
            ]
        };
        var myNewChart = new Chart(ctx).Line(chartData, {animation: false, scaleShowVerticalLines: false});

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
            //check threshold
            if (c == "temperature") {
              if (lastHistory > 28) {
                // if (moment().diff(lastNotificationSent, 'minutes') > 1) {
                  sendSms("%2B6581010737", "Warning: Temperature too high " + $filter('number')(lastHistory, 2));
                  lastNotificationSent = moment();
                // }
              } else if (lastHistory < 20) {
                // if (moment().diff(lastNotificationSent, 'minutes') > 1) {
                  sendSms("%2B6581010737", "Warning: Temperature too low " + $filter('number')(lastHistory, 2));
                  lastNotificationSent = moment(); 
                // }
              }
            }
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

  $scope.updateChart($scope.iDay);
});