'use strict';

/* Wrapper module
 * To include all services, just include sphere-api as an application dependency
 */
angular.module('sphere-services', [
  'ngResource'
])
.constant('SphereDefaults', {
  method: 'GET',
  url: 'https://sphere-dev.outbrain.com/api/v1/recommendations/:type',
  headers: {
    Authorization: 'API_KEY c2e75315550543fdbf0a85e9a96a458e',
    'X-USER-ID': '9afa6143-4357-4b27-8311-a3d4626259c7'
  },
  withCredentials: true
})
.service('SphereHeaders', function (SphereDefaults) {
  return {
    headers: {},
    setHeaders: function (params) {
      var self = this;

      self.headers = angular.isObject(params) ? params : {};
    },
    extendHeaders: function (params) {
      var self = this;

      if (angular.isObject(params)) { angular.extend(self.headers, params); }
    },
    getHeaders: function () {
      console.log('headers: ', this.headers);
      return this.headers;
    }
  };
})
/* Sphere Recommendations
 * Includes custom actions for Documents, Categories, and Sites
 * Can also hit those endpoints by passing in {type: 'documents'}, etc, as a parameter when making a .get() request
 */
.factory('SphereRecommendations', function ($resource, SphereDefaults) {

  var Recommendations = $resource('https://sphere-dev.outbrain.com/api/v1/recommendations/:type', {}, {
      get: SphereDefaults ,
      // Custom actions
      getDocuments: { method: 'GET', url: 'https://sphere-dev.outbrain.com/api/v1/recommendations/documents' },
      getCategories: { method: 'GET', url: 'https://sphere-dev.outbrain.com/api/v1/recommendations/categories' },
      getSites: { method: 'GET', url: 'https://sphere-dev.outbrain.com/api/v1/recommendations/sites' }
    }
  );

  return Recommendations;
})
/* Sphere Interests
 * Includes custom actions for Categories, Topics, and Documents
 * Can also hit those endpoints by passing in {type: 'documents'}, etc, as a parameter when making a .get() request
 */
.factory('SphereInterests', function ($resource) {
  var Interests = $resource('https://sphere-dev.outbrain.com/api/v1/interests/:type/:id', {}, {
      // Custom actions
      getAll: { method: 'GET', isArray: true },
      get: { method: 'GET', isArray: true },
      getSites: { method: 'GET', url: 'https://sphere-dev.outbrain.com/api/v1/interests/sites' },
      getCategories: { method: 'GET', url: 'https://sphere-dev.outbrain.com/api/v1/interests/categories' },
      getTopics: { method: 'GET', url: 'https://sphere-dev.outbrain.com/api/v1/interests/topics' },
      getDocuments: { method: 'GET', url: 'https://sphere-dev.outbrain.com/api/v1/interests/documents' },
      getInterest: { method: 'GET' },
      addInterest: { method: 'POST',
        transformRequest: function (data) {
          console.log('Data: ', data);
        } 
      },
      removeInterest: { method: 'DELETE',
        transformRequest: function (data) {
          console.log('Data: ', data);
        } 
      }
    }
  );

  return Interests;
})
/* Sphere Entities
 * Includes custom actions for Documents, Categories, and Sites
 * Can also hit those endpoints by passing in {type: 'documents'}, etc, as a parameter when making a .get() request
 */
.factory('SphereEntities', function ($resource) {
  var Entities = $resource('https://sphere-dev.outbrain.com/api/v1/:type/:id', {}, {
    //Custome actions
      getSites: { method: 'GET', url: 'https://sphere-dev.outbrain.com/api/v1/sites' },
      getCategories: { method: 'GET', url: 'https://sphere-dev.outbrain.com/api/v1/categories'},
      getDocuments: { method: 'GET', url: 'https://sphere-dev.outbrain.com/api/v1/documents'}
    }
  );

  return Entities;
});