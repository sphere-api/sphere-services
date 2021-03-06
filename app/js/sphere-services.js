'use strict';

angular.module('sphere-services', [
  'ngResource'
])
.provider('$sphere', function $sphereProvider () {
  /*
   * Private objects and methods
   * ---------------------------
   */
  var self = this,
    setParams;

  setParams = function (urlPartial, options) {
    var params = angular.copy(self.defaults);

    angular.forEach(options, function (option) {
      if (angular.isObject(option)) {
        angular.extend(params, option);
      }
    });

    params.url += urlPartial;

    return params;
  };

  /*
   * Public objects and methods
   * Available during the config phase through $sphereProvider
   * --------------------------
   */
  this.defaults = {
    method: 'GET',
    url: 'https://sphere-dev.outbrain.com/api/v1/',
    headers: {},
    withCredentials: true
  };

  this.prodEnabled = function (bool) {
    if (typeof(bool) === 'boolean') {
      if (bool) {
        self.defaults.url = 'https://sphere.outbrain.com/api/v1/';
      }
    } else {
      throw 'Error: prodEnabled only accepts boolean values';
    }
  };
  
  /*
   * Public method
   * Contains methods available through $sphere
   * ---------------------------------------
   */
  this.$get = function ($resource) {
    var self = this;
    
    var data = {
      defaults: self.defaults,
      recommendations: function (options) {
        var recommendations = $resource(self.defaults.url + 'recommendations/:type', {}, {
          get: setParams('recommendations/:type', [options]),
          query: setParams('recommendations/:type', [options, {isArray: true}]),
          getDocuments: setParams('recommendations/documents', [options]),
          getCategories: setParams('recommendations/categories', [options, {isArray: true}]),
          getSites: setParams('recommendations/sites', [options, {isArray: true}]),
          getOnBoard: setParams('recommendations/onboard', [options])
        });

        return recommendations;
      },
      interests: function (options) {
        var interests = $resource(self.defaults.url + 'interests/:type/:id', {}, {
          getAll: setParams('interests', [options]),
          get: setParams('interests/:type/:id', [options]),
          query: setParams('interests/:type/:id', [options, {isArray: true}]),
          getCategories: setParams('interests/categories', [options]),
          getSites: setParams('interests/sites', [options]),
          getTopics: setParams('interests/topics', [options]),
          getDocuments: setParams('interests/documents', [options]),
          getInterest: setParams('interests/:type/:id', [options]),
          addInterest: setParams('interests/:type/:id', [options, {params: {id: '@id', type: '@type'}}, {method: 'POST'}, {
            transformRequest: function (data) {
              delete data.type;
              delete data.id;
              return JSON.stringify(data);
            }
          }]),
          removeInterest: setParams('interests/:type/:id', [options, {method: 'DELETE'}]),
          addCategorizedSites: setParams('interests/categorizedSites/:categoryId/:siteId', [options, {params: {categoryId: '@categoryId', siteId: '@siteId'}}, {method: 'POST'}, {
            transformRequest: function (data) {
              delete data.categoryId;
              delete data.siteId;
              return JSON.stringify(data);
            }
          }]),
          removeCategorizedSites: setParams('interests/categorizedSites/:categoryId/:siteId', [options, {method: 'DELETE'}])
        });

        return interests;
      },
      entities: function (options) {
        var entities = $resource(self.defaults.url + ':type/:id', {}, {
          get: setParams(':type/:id', [options]),
          query: setParams(':type/:id', [options, {isArray: true}]),
          getSites: setParams('sites/:id', [options]),
          getCategories: setParams('categories/:id', [options, {isArray: true}]),
          getDocuments: setParams('documents/:id', [options])
        });

        return entities;
      },
      stash: function (options) {
        var stash = $resource(self.defaults.url + 'stash/documents/:id', {}, {
          get: setParams('stash/documents', [options]),
          save: setParams('stash/documents/:id', [options, {params: {id: '@id'}}, {method: 'POST'}, {
            transformRequest: function (data) {
              delete data.id;
              return JSON.stringify(data);
            }
          }]),
          remove: setParams('stash/documents/:id', [options, {method: 'DELETE'}])
        });

        return stash;
      }

    };

    return data;
  }
});