angular.module('sphere-demo', [
  'ngRoute',
  'sphere-services'
])
.config(function ($routeProvider) {
  $routeProvider.when('/', {
    controller: 'DemoController',
    templateUrl: 'service-demo.html',
    resolve: {
      Recs: function (SphereRecommendations) {
        return SphereRecommendations.get({type: 'documents'});
      },
      Interests: function (SphereInterests) {
        return SphereInterests.getCategories();
      },
      Entities: function (SphereEntities) {
        return SphereEntities.getSites();
      }
    }
  })
  .otherwise('/');
})
.controller('DemoController', function ($scope, Recs, Interests, Entities, SphereRecommendations, SphereInterests, SphereEntities) {
  $scope.recommendations = Recs;
  $scope.interests = Interests;
  $scope.Entities = Entities;

  $scope.refreshRecs = function (params) {
    $scope.recommendations = SphereRecommendations.get(params);
  };

  $scope.refreshInterests = function (params) {
    SphereInterests.get({type: 'categories', limit: 5}, function (success) {
      $scope.interests = success;
    }, function (failure) {
      throw failure;
    })
  };

  $scope.refreshEntities = function (params) {
    SphereEntities.getDocuments().$promise.then(function (success) {
      $scope.entities = success;
    })
    .catch(function (failure) {
      throw failure;
    });
  };
});