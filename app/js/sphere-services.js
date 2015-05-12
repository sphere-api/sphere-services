'use strict';

angular.module('sphere-services', [
  'ngResource'
])
.provider('$sphere', function $sphereProvider ($httpProvider) {
  /*
   * Private objects and methods
   * ---------------------------
   */
  var self = this,
    setParams, transform,//Private methods
    linkKey = '_actions';//Private variables

  setParams = function (urlPartial, options) {
    var params = angular.copy(self.defaults);
    params.url += urlPartial;

    angular.forEach(options, function (option) {
      if (angular.isObject(option)) {
        angular.extend(params, option);
      }
    });

    return params;
  };

  transform = function (data) {
    var response = angular.isObject(data) ? data : JSON.parse(data);
    //console.log('Data: ', response, headers());

    if (response[linkKey]) {
      angular.forEach(response[linkKey], function (action, key) {
        console.log('Making a call to ', action, ': ', key);
      });
    }

    // Do a recursive search for actions in the object
    angular.forEach(response, function (value, key) {
      if (key !== linkKey && angular.isObject(value) && (angular.isArray(value) || value[linkKey])) {
        data[key] = new transform(value);
      }
    });
    return response;

  };

  /*
   * Public objects and methods
   * Available during the config phase through $sphereProvider
   * --------------------------
   */
  this.defaults = {
    method: 'GET',
    url: 'https://sphere-dev.outbrain.com/api/v1/',
    withCredentials: true/*,
    transformResponse: function (data, headers) {
      var response = transform(JSON.parse(data));

      return response;
    }*/
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
      recommendations: function (options) {
        var recommendations = $resource(self.defaults.url + 'recommendations/:type', {}, {
          get: setParams('recommendations/:type', options),
          query: setParams('recommendations/:type', [options, {method: 'GET', isArray: true}]),
          getDocuments: setParams('recommendations/documents', options),
          getCategories: setParams('recommendations/categories', [options, {isArray: true}]),
          getSites: setParams('recommendations/sites', [options, {isArray: true}]),
          getOnBoard: setParams('recommendations/onboard', options)
        });

        return recommendations;
      },
      interests: function (options) {
        var interests = $resource(self.defaults.url + 'interests/:type/:id', {}, {
          getAll: setParams('interests', options),
          get: setParams('interests/:type/:id', options),
          query: setParams('interests/:type/:id', [options, {method: 'GET', isArray: true}]),
          getCategories: setParams('interests/categories', options),
          getSites: setParams('interests/sites', options),
          getTopics: setParams('interests/topics', options),
          getDocuments: setParams('interests/documents', options),
          getInterest: setParams('interests/:type/:id', options),
          addInterest: setParams('interests/:type/:id', [options, {params: {id: '@id', type: '@type'}}, {method: 'POST'}, {
            transformRequest: function (data) {
              delete data.type;
              delete data.id;
              return JSON.stringify(data);
            }
          }]),
          removeInterest: setParams('interests/:type/:id', [options, { method: 'DELETE'}])
        });

        return interests;
      },
      entities: function (options) {
        var entities = $resource(self.defaults.url + ':type/:id', {}, {
          get: setParams(':type/:id', options),
          query: setParams(':type/:id', [options, {method: 'GET', isArray: true}]),
          getSites: setParams('sites/:id', options),
          getCategories: setParams('categories/:id', [options, {isArray: true}]),
          getDocuments: setParams('documents/:id', options)
        });

        return entities;
      },
      actions: function (url, options) {
        options = options ? options : {};
        angular.extend(options, {url: url});
        
        var actions = $resource('', {}, {
          reportViewed: setParams(url, [{method: 'GET'}, options]),
          click: setParams(url, [{method: 'GET'}, options]),
          stash: setParams(url, [{method: 'POST'}, options]),
          setInterest: setParams(url, [{method: 'POST'}, options]),
          removeInterest: setParams(url, [{method: 'DELETE'}, options])
        });

        return actions;
      }
    };

    return data;
  }
});