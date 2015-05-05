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

Make sure the `sphere-services.json` file is included in your `index.html`, then include the dependency in your Angular application:

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
$httpProvider.defaults.headers.Authorization = 'API_KEY my-api-key';
$httpProvider.defaults.headers['X-USER-ID'] = 'my-user-id';
```

Additionally, by default, sphere-service will make requests to the development version of the Sphere Api. When you're ready to move to production, you can tell the service to switch by setting `$sphereProvider.prodEnabled(true)`.
