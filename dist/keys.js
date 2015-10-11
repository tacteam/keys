(function() {
  'use strict';
  angular.module('module.tac.keys', []).service('tac.keys', [
    function() {
      var Control, ctrlkeycodes, get_ctrlkeycode, get_if_number, get_keycode, handler, keycodes, listeners, listeners_stack, make_ctrl, make_normal, make_number;
      listeners = [];
      listeners_stack = [];
      keycodes = [
        {
          key: 'enter',
          code: 13,
          stop: true
        }, {
          key: 'left',
          code: 37
        }, {
          key: 'up',
          code: 38
        }, {
          key: 'right',
          code: 39
        }, {
          key: 'down',
          code: 40
        }, {
          key: 'info',
          code: 457
        }, {
          key: 'red',
          code: 403
        }, {
          key: 'green',
          code: 404
        }, {
          key: 'yellow',
          code: 405
        }, {
          key: 'blue',
          code: 406
        }, {
          key: 'play',
          code: 415
        }, {
          key: 'pause',
          code: 19
        }, {
          key: 'rewind',
          code: 412
        }, {
          key: 'fast_fwd',
          code: 417
        }, {
          key: 'page_up',
          code: 33
        }, {
          key: 'page_down',
          code: 34
        }, {
          key: 'previous',
          code: 422
        }, {
          key: 'next',
          code: 423
        }, {
          key: 'go_back',
          code: 166
        }, {
          key: 'subtitle',
          code: 460
        }, {
          key: 'audio',
          code: 176
        }, {
          key: 'favorites',
          code: 372
        }, {
          key: 'help',
          code: 47
        }, {
          key: 'menu',
          code: 18
        }, {
          key: 'anterior',
          code: 413
        }
      ];
      ctrlkeycodes = [
        {
          key: 'menu',
          code: 77
        }, {
          key: 'anterior',
          code: 65
        }, {
          key: 'go_back',
          code: 86
        }, {
          key: 'fast_fwd',
          code: 75
        }, {
          key: 'rewind',
          code: 74
        }, {
          key: 'pause',
          code: 80
        }, {
          key: 'play',
          code: 32
        }, {
          key: 'info',
          code: 73
        }, {
          key: 'red',
          code: 82
        }, {
          key: 'green',
          code: 71
        }, {
          key: 'yellow',
          code: 89
        }, {
          key: 'blue',
          code: 66
        }
      ];
      make_number = function(number) {
        return {
          is_number: true,
          key: 'number',
          number: number
        };
      };
      get_if_number = function(code) {
        if (code >= 48 && code <= 57) {
          return make_number(code - 48);
        }
        if (code >= 96 && code <= 105) {
          return make_number(code - 96);
        }
      };
      get_keycode = function(code) {
        var keycode, _i, _len;
        for (_i = 0, _len = keycodes.length; _i < _len; _i++) {
          keycode = keycodes[_i];
          if (keycode.code === code) {
            return keycode;
          }
        }
        return get_if_number(code);
      };
      get_ctrlkeycode = function(code) {
        var keycode, _i, _len;
        for (_i = 0, _len = ctrlkeycodes.length; _i < _len; _i++) {
          keycode = ctrlkeycodes[_i];
          if (keycode.code === code) {
            return keycode;
          }
        }
      };
      make_normal = function(owner) {
        return {
          onkeydown: function(event) {
            var keycode, listener, _i, _len;
            if (event.keyCode === 17) {
              return owner.current = owner.ctrl;
            } else {
              keycode = get_keycode(event.keyCode);
              if (keycode) {
                for (_i = 0, _len = listeners.length; _i < _len; _i++) {
                  listener = listeners[_i];
                  listener.handle(keycode);
                }
                if (keycode.stop) {
                  return event.preventDefault();
                }
              } else {
                return console.log('unregistered key ' + event.keyCode);
              }
            }
          },
          onkeyup: function(event) {}
        };
      };
      make_ctrl = function(owner) {
        return {
          onkeydown: function(event) {
            var keycode, listener, _i, _len;
            keycode = get_ctrlkeycode(event.keyCode);
            if (keycode) {
              for (_i = 0, _len = listeners.length; _i < _len; _i++) {
                listener = listeners[_i];
                listener.handle(keycode);
              }
              return event.preventDefault();
            } else {
              return console.log('unregistered key ' + event.keyCode);
            }
          },
          onkeyup: function(event) {
            if (event.keyCode === 17) {
              return owner.current = owner.normal;
            }
          }
        };
      };
      handler = {};
      handler.normal = make_normal(handler);
      handler.ctrl = make_ctrl(handler);
      handler.current = handler.normal;
      return Control = (function() {
        function Control() {}

        Control.subscribe = function(listener) {
          listeners.push(listener);
          return function() {
            return unsubscribe(listener);
          };
        };

        Control.unsubscribe = function(listener) {
          return _.remove(listeners, listener);
        };

        Control.create_level = function() {
          listeners_stack.push(listeners);
          return listeners = [];
        };

        Control.previous_level = function() {
          if (listeners_stack.length > 0) {
            return listeners = listeners_stack.pop();
          } else {
            return console.error("trying to pop unique listener array from listeners_stack");
          }
        };

        Control.bind_keydown = function(scope) {
          scope.onkeydown = function(event) {
            return handler.current.onkeydown(event);
          };
          return scope.onkeyup = function(event) {
            return handler.current.onkeyup(event);
          };
        };

        return Control;

      })();
    }
  ]);

}).call(this);
