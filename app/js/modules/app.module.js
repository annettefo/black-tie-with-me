var app = angular.module("shop-with-me", ["ui.router", "ngNotify", "pubnub.angular.service", "ngStamplay", "ngSanitize"])

app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

  $stateProvider
    .state("Home", {
        url : '/',
        templateUrl : "../../views/home.html",
        controller: "HomeController",
        resolve : {
          loggedin : function(User) {
            return User.current();
          }
        }
    })
    .state("Account", {
        url : '/account/:tab?list',
        templateUrl : "../../views/account.html",
        controller : "AccountController",
    })
    .state("List", {
      url : "/list/:slug",
      templateUrl : '../../views/list.html',
      controller : "ListController",
      resolve : {
        loggedin : function(User) {
          return User.current();
        },
        list : function(List, $stateParams) {
          return List.getList($stateParams.slug);
        },
        items : function(Item, $stateParams) {
          return Item.getListItems($stateParams.slug);
        }
      }
    })

  $urlRouterProvider.otherwise("/");

  $locationProvider.html5Mode(true);

})

app.run(function(Pubnub, User, $rootScope, ngNotify) {

  Stamplay.init("githublogin");

  Pubnub.init({
    publish_key : "pub-c-c2f74f7c-ef19-433b-b553-357e8460e050",
    subscribe_key : "sub-c-eda2a9f0-f31c-11e6-819d-0619f8945a4f",
    ssl : (('https:' === window.location.protocol) ? true : false)
  })

  User.current()
    .then(
      function(response) {
        $rootScope.user = response.user;
      }
    )

  //  New
  ngNotify.config({
    duration: 3000,
    type: 'info',
    html: true
  });

})
