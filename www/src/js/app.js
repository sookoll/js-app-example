requirejs.config({
    "baseUrl": "js/lib",
    "paths": {
        "jquery": "jquery-2.1.1.min",
        'jquery.bootstrap': "bootstrap.min",
        "app": "../app"
    },
    "shim": {
        "jquery.bootstrap": {
            deps: ['jquery']
        }
    }
});

// Load the main app module to start the app
requirejs(['app/main']);