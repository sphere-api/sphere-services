angular.module('sphere-demo', [
  'ngRoute',
  'sphere-services'
])
.config(function ($routeProvider, $httpProvider, $sphereProvider) {
  // You can either set default headers for the $httpProvider, or
  // if you want to isolate it to just the Sphere Api calls, you can set default headers to the $sphereProvider
  $httpProvider.defaults.headers.common.Authorization = 'API_KEY c2e75315550543fdbf0a85e9a96a458e';
  $httpProvider.defaults.headers.common['X-USER-ID'] = '9afa6143-4357-4b27-8311-a3d4626259c7';
  //$sphereProvider.defaults.headers.Authorization = 'API_KEY c2e75315550543fdbf0a85e9a96a458e';
  //$sphereProvider.defaults.headers['X-USER-ID'] = '9afa6143-4357-4b27-8311-a3d4626259c7';
  //$sphereProvider.prodEnabled(true);// Set to true to make api calls to the production version

  $routeProvider.when('/', {
    controller: 'DemoController',
    templateUrl: 'service-demo.html',
    resolve: {
      Recs: function ($sphere) {
        return $sphere.recommendations().getDocuments();
      },
      Interests: function ($sphere) {
        return $sphere.interests().getDocuments();
      },
      Entities: function ($sphere) {
        return $sphere.entities().getDocuments({id: 'G3MuMmR4YZS-XBVJsTb_yA'});
      }
    }
  })
  .otherwise('/');
})
.controller('DemoController', function ($scope, $sphere, Recs, Interests, Entities) {
  console.log('Recs: ', Recs);
  $scope.recommendations = Recs;
  console.log('Interests: ', Interests);
  $scope.interests = Interests;
  console.log('Entities: ', Entities);
  $scope.entities = Entities;

  $scope.addInterest = function (interest, type, index) {
    var idArr = $scope.recommendations.items[index].document._actions.setInterest.split('/'),
      id = idArr[idArr.length - 1];

  // Forming the call
  $sphere.interests().addInterest({
    interested: true,
    type: type,
    id: id
  }, function (success) {
      console.log('Success: ', success);
    }, function (failure) {
      console.log('Failure: ', failure);
    });
  };


  $scope.removeInterest = function (type, item) {
    console.log('Remove Item: ', item);

    var idArr = item.document._actions.setInterest.split('/'),
      id = idArr[idArr.length - 1];

    $sphere.interests().removeInterest({
      type: type,
      id: id
    }, function (success) {
      console.log('Success: ', success);
    }, function (failure) {
      console.log('Failure: ', failure);
    });
  };

  $scope.refreshRecs = function (params) {
    $scope.recommendations = $sphere.recommendations({headers: {Authorization: 'API_KEY c2e75315550543fdbf0a85e9a96a458e'}}).getDocuments();
  };

  $scope.refreshInterests = function (params) {
    $sphere.interests().get({type: 'categories', limit: 5}, function (success) {
      $scope.interests = success;
    }, function (failure) {
      throw failure;
    });
  };

  $scope.refreshEntities = function (params) {
    $sphere.entities().getSites({limit: 5}).$promise
    .then(function (success) {
      $scope.entities = success;
    })
    .catch(function (failure) {
      throw failure;
    });
  };
});