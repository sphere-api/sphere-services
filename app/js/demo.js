angular.module('sphere-demo', [
  'ngRoute',
  'hateoas',
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

  $routeProvider
    .when('/', {
    })
    .when('/categories', {
      controller: 'DemoController',
      templateUrl: 'views/categories-demo.html',
      resolve: {
        Recs: function ($sphere) {
          return $sphere.recommendations().query({type: 'categories'});
        },
        Interests: function ($sphere) {
          return $sphere.interests().get({type: 'categories'});
        },
        Entities: function ($sphere) {
          return $sphere.entities().query({type: 'categories'});
        }
      }
    })
    .when('/documents', {
      controller: 'DemoController',
      templateUrl: 'views/documents-demo.html',
      resolve: {
        Recs: function ($sphere) {
          return $sphere.recommendations().get({type: 'documents'});
        },
        Interests: function ($sphere) {
          return $sphere.interests().get({type: 'documents'});
        },
        Entities: function ($sphere) {
          return $sphere.entities().get({type: 'documents'});
        }
      }
    })
    .when('/sites', {
      controller: 'DemoController',
      templateUrl: 'views/sites-demo.html',
      resolve: {
        Recs: function ($sphere) {
          return $sphere.recommendations().query({type: 'sites'});
        },
        Interests: function ($sphere) {
          return $sphere.interests().get({type: 'sites'});
        },
        Entities: function ($sphere) {
          return $sphere.entities().get({type: 'sites'});
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

  // Function for converting _actions 'http' to 'https'
  var fixHttp = function (url) {
    var splitUrl = url.split(':'),
      //splitUrl[0] = 'https',
      newUrl = '';

    angular.forEach(splitUrl, function (partial, idx) {
      if (idx === 0) { partial = 'https:'; }
      newUrl += partial;
    });

    return newUrl;
  };

  // Possible format for creating a generic request for committing a HATEOAS action
  $scope.commitAction = function (action, key, interest) {
    var body = angular.isObject(interest) ? interest : interest ? {interested: true} : interest !== null ? {interested: false} : null;

    // Switch http to https
    action = fixHttp(action);

    $sphere.actions(action)[key](body, function (success) {
      console.log('Success: ', success);
    }, function (failure) {
      console.log('Failure: ', failure);
    });
  };

  // Action for refreshing recommendations
  $scope.refreshRecs = function (type) {
    $scope.recommendations = $sphere.recommendations().get({type: type});
  };

  // Action for refreshing Interests
  $scope.refreshInterests = function (type) {
    $sphere.interests().get({type: type, limit: 5}, function (success) {
      $scope.interests = success;
    }, function (failure) {
      throw failure;
    });
  };

  // Action for refreshing entities
  $scope.refreshEntities = function (type) {
    $sphere.entities().get({limit: 5, type: type}).$promise
    .then(function (success) {
      $scope.entities = success;
    })
    .catch(function (failure) {
      throw failure;
    });
  };
});