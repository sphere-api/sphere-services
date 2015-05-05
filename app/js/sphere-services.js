'use strict';

/* Wrapper module
 * To include all services, just include sphere-api as an application dependency
 */
angular.module('sphere-services', [
  'ngResource'
])
.provider('$sphere', function $sphereProvider () {
  var self = this,
    setParams;

  setParams = function (urlPartial, options) {
    var params = angular.copy(self.defaults);
    params.url += urlPartial;

    if (options && angular.isObject(options)) {
      angular.extend(params, options);
    } else if (angular.isArray(options)) {
      angular.forEach(options, function (option) {
        if (angular.isObject(option)) {
          angular.extend(params.option);
        }
      });
    }

    return params;
  };

  // Setup defaults for the Sphere Api calls
  this.defaults = {
    method: 'GET',
    url: 'https://sphere-dev.outbrain.com/api/v1/',
    withCredentials: true
  };

  this.prodEnabled = function (bool) {
    if (typeof(bool) === 'boolean') {
      if (bool) {
        self.defaults.url = 'https://sphere.outbrain.com/api/v1/'
      }
    } else {
      throw 'Error: prodEnabled only accepts boolean values';
    }
  };
  
  this.$get = function ($resource) {
    var self = this;
    
    var data = {
      recommendations: function (options) {
        var recommendations = $resource(self.defaults.url + 'recommendations/:type', {}, {
          get: setParams('recommendations/:type', options),
          getDocuments: setParams('recommendations/documents', options),
          getCategories: setParams('recommendations/categories', options),
          getSites: setParams('recommendations/sites', options)
        });

        return recommendations;
      },
      interests: function (options) {
        var interests = $resource(self.defaults.url + 'interests/:type/:id', {}, {
          getAll: setParams('interests', [options, {isArray: true}]),
          get: setParams('interests/:type', [options, {isArray: true}]),
          getCategories: setParams('interests/categories', options),
          getSites: setParams('interests/sites', options),
          getTopics: setParams('interests/topics', options),
          getInterest: setParams('interests/:type/:id', options)
          /*,
           * haven't yet been able to test the add/remove interests, so they are temporarily disabled
           * ==================================
          addInterest: { method: 'POST',
            transformRequest: function (data) {
              console.log('Data: ', data);
            } 
          },
          removeInterest: { method: 'DELETE',
            transformRequest: function (data) {
              console.log('Data: ', data);
            } 
          }*/
        });

        return interests;
      },
      entities: function (options) {
        var entities = $resource(self.defaults.url + ':type/:id', {}, {
          getSites: setParams('sites/:id', options),
          getCategories: setParams('categories/:id', options),
          getDocuments: setParams('documents/:id', options)
        });

        return entities;
      }
    };

    return data;
  }
});