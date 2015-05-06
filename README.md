# sphere-services

Provides methods for interacting with the Sphere Api endpoints

Dependencies:

* [AngularJS](https://angularjs.org/)
* [ngResource](https://docs.angularjs.org/api/ngResource/service/$resource)

## Running the demo site

To run the demo site on your machine for testing the service calls:
```shell
git clone git@github.com:sphere-api/sphere-services.git
cd sphere-services
bower install && npm install
```

Then, to run the server:
```shell
grunt serve
```

## Getting Started

In your bower.json file:
```json
"dependencies": {
  "sphere-services": "https://github.com/sphere-api/sphere-services.git"
}
```

```shell
bower install
```

Make sure the `sphere-services.js` file is included in your `index.html`, then include the dependency in your Angular application:

```js
angular.module('myApp', [
  'sphere-services'
]);
```

## Using sphere-services in your Angular project

The sphere-services module creates a provider for your application which allows you to set defaults in your config function. This is useful if you want to set the default authorization headers for the Sphere Api requests without affecting other Ajax calls your application may be making.

### $sphereProvider

The $sphereProvider gives you access to a defaults object, which gets passed into the header for all of the Sphere Api requests. If the same default name is set for both the $httpProvider and the $sphereProvider, the $sphereProvider defaults will override the other.

Example:
```js
$sphereProvider.defaults.headers.Authorization = 'API_KEY my-api-key';
$sphereProvider.defaults.headers['X-USER-ID'] = 'my-user-id';
```

Additionally, by default, sphere-service will make requests to the development version of the Sphere Api. When you're ready to move to production, you can tell the service to switch urls by setting `$sphereProvider.prodEnabled(true)`

### $sphere

The $sphere object allows you to interact with the Sphere Api services by passing it into your applications functions. This is built to extend the ngResource module ([ngResource](https://docs.angularjs.org/api/ngResource/service/$resource)), and so similar syntax is used. For more information on the endpoints available, see Sphere Api documentation at [developers.sphere.com](http://developers.sphere.com/#/docs/). The models can be bound directly to your $scope, or you can make use of the built-in success/failure callbacks.

For example, there are three ways you can make a call to the same endpoint;
```js
// Binding directing to a scope variable
$scope.recommendations = $sphere.recommendations().get({type: 'documents'});

// Using success/failure callback functions
$sphere.recommendations().get({type: 'documents'},
function (success) {
  $scope.recommendations = success;
}, function (failure) {
  throw failure;
});

// Making use of $resource's built-in then/catch/finally
$sphere.recommendations().get({type: 'documents'}).$promise
.then(function (success) {
  $scope.recommendations = success;
})
.catch(function (failure) {
  throw failure;
});
```

Additionally, you have the option of two different ways of calling any resource. As shown, you can use the generic get/post/delete requests and pass in an object with the `type` key. Or, you can make a direct request to the resource by calling a custom method:
```js
$sphere.recommendations().getDocuments();
```

# Constructing resource calls

## Setting the initial resource

There are three broad endpoints you can make a call to on the Sphere Api:
```js
$sphere.recommendations()
$sphere.interests()
$sphere.entities()
```

When setting up an individual call, you can also pass in optional header parameters into the endpoint by passing an object into the function. Any valid header parameters can be passed in, and it will override any `$httpProvider` or `$sphereProvider` defaults that you set in the config.

```js
$sphere.recommendations({
  headers: {
    Authorization: 'API_KEY my-api-key'
  },
  withCredentials: true
})
```

## Specifying the Endpoint

Once you've setup your initial request, you can then specify what type you want from that resource, as well as passing in any optional parameters:

```js
// Passing in the Type declaration
$sphere.recommendations().get({
  type: 'documents',
  limit: 5,
  contextId: 0
});

// Using the custom service
$sphere.recommendations().getDocuments({
  limit: 5,
  contextId: 0
});
```

See the [Sphere Api Documentation](http://developers.sphere.com/#/docs/) for more details on what optional parameters are available.
