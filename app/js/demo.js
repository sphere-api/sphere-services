angular.module('sphere-demo', [
  'ngRoute',
  'sphere-services'
])
.config(function ($routeProvider, $sphereProvider) {
  $sphereProvider.defaults.headers.Authorization = 'API_KEY c2e75315550543fdbf0a85e9a96a458e';
  $sphereProvider.defaults.headers['X-USER-ID'] = '9afa6143-4357-4b27-8311-a3d4626259c7';
  //$sphereProvider.prodEnabled(true);// Set to true to make api calls to the production version

  $routeProvider.when('/', {
    controller: 'DemoController',
    templateUrl: 'service-demo.html',
    resolve: {
      Recs: function ($sphere) {
        return $sphere.recommendations().get({type: 'documents'});
      },
      Interests: function ($sphere) {
        return $sphere.interests().getCategories();
      },
      Entities: function ($sphere) {
        return $sphere.entities().getSites();
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
  $scope.Entities = Entities;

  $scope.refreshRecs = function (params) {
    $scope.recommendations = SphereRecommendations.get(params);
  };

  $scope.refreshInterests = function (params) {
    $sphere.interests().get({type: 'categories', limit: 5}, function (success) {
      $scope.interests = success;
    }, function (failure) {
      throw failure;
    })
  };

  $scope.refreshEntities = function (params) {
    $sphere.entities().getDocuments().$promise.then(function (success) {
      $scope.entities = success;
    })
    .catch(function (failure) {
      throw failure;
    });
  };
});