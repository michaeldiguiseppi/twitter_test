var twitterStream = angular.module('myApp', ['chart.js'])

twitterStream.controller("mainCtrl", ['$scope', 'socket',
function ($scope, socket) {
  //chart labels
  $scope.labels = ["iPhone", "Android", "Other"];
  //chart colors
  $scope.colors = ['#ff0eca','#0038ff', 'rgb(75, 255, 1)'];
  //intial data values
  $scope.wcwData = [0,0,0];
  $scope.mcmData = [0,0,0];

  socket.on('newTweet', function (tweet) {
    $scope.tweet = tweet.text;
    $scope.user = tweet.user.screen_name;
    //parse source from payload
    var source = tweet.source.split('>')[1].split('<')[0].split(' ')[2];
    //all hashtags in the tweet
    var hashtags = tweet.entities.hashtags.map(function(el){
      return el.text.toLowerCase();
    });

    //check source and increment for #wcw tweets
    if (hashtags.indexOf('wcw') !== -1){
      switch (source) {
        case 'iPhone': $scope.wcwData[0]++;
        break;
        case 'Android': $scope.wcwData[1]++;
        break;
        default: $scope.wcwData[2]++;
      }
    } else if (hashtags.indexOf('mcm') !== -1){
      switch (source) {
        case 'iPhone': $scope.mcmData[0]++;
        break;
        case 'Android': $scope.mcmData[1]++;
        break;
        default: $scope.mcmData[2]++;
      }
    }
  });
}
]);


/*---------SOCKET IO METHODS (careful)---------*/

twitterStream.factory('socket', function ($rootScope) {
  var socket = io.connect();
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      });
    }
  };
});
