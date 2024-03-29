"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.subscribe = subscribe;

exports.default = function(store) {
    var prevState = store.getState();

    store.subscribe(function() {
        var newState = store.getState();

        Object.keys(subscribers).forEach(function(key) {
            if (
                (0, _objectPath.get)(prevState, key) !==
                (0, _objectPath.get)(newState, key)
            ) {
                subscribers[key].forEach(function(cb) {
                    return cb(newState, prevState);
                });
            }
        });

        prevState = newState;
    });

    return subscribe;
};

var _objectPath = require("object-path");

var subscribers = {};

function subscribe(key, cb) {
    if (subscribers.hasOwnProperty(key)) {
        subscribers[key].push(cb);
    } else {
        subscribers[key] = [cb];
    }

    // return "unsubscribe" function
    return function() {
        subscribers[key] = subscribers[key].filter(function(s) {
            return s !== cb;
        });
        console.log(subscribers);
    };
}
