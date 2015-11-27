(function() {
  'use strict';
  angular.module('module.tac.keys', []).service('tac.keys', [
    function() {
      var Control, broadcast, ctrlkeycodes, dump, get_ctrlkeycode, get_if_letter, get_if_number, get_keycode, get_keyupcode, handler, keycodes, keyupcodes, listeners, listeners_stack, make_ctrl, make_letter, make_normal, make_number, remove, unknow;
      listeners = [];
      listeners_stack = [];
      keycodes = [
        {
          key: 'enter',
          code: 13,
          stop: true
        }, {
          key: 'back_space',
          code: 8,
          stop: true
        }, {
          key: 'left',
          code: 37,
          stop: true
        }, {
          key: 'up',
          code: 38,
          stop: true
        }, {
          key: 'right',
          code: 39,
          stop: true
        }, {
          key: 'down',
          code: 40,
          stop: true
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
        }, {
          key: 'caps_lock',
          code: 20
        }, {
          key: 'space_bar',
          code: 32
        }, {
          key: 'shift',
          code: 16
        }, {
          key: 'alt',
          code: 18
        }, {
          key: 'acute',
          code: 219
        }, {
          key: 'alt_gr',
          code: 225
        }
      ];
      keyupcodes = [
        {
          key: 'shift',
          code: 16
        }, {
          key: 'alt_gr',
          code: 225
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
      remove = function(collection, elem) {
        var elem_index;
        elem_index = collection.indexOf(elem);
        return (elem_index > -1) && collection.splice(elem_index, 1);
      };
      make_letter = function(letter) {
        return {
          is_letter: true,
          key: 'letter',
          letter: letter
        };
      };
      make_number = function(number) {
        return {
          is_number: true,
          key: 'number',
          number: number
        };
      };
      get_if_letter = function(code) {
        var value;
        if (code === 192) {
          return make_letter('ñ');
        }
        if (code >= 65 && code <= 90) {
          value = String.fromCharCode(code + 32);
          return make_letter(value);
        }
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
        return (get_if_number(code)) || (get_if_letter(code));
      };
      get_keyupcode = function(code) {
        var keycode, _i, _len;
        for (_i = 0, _len = keyupcodes.length; _i < _len; _i++) {
          keycode = keyupcodes[_i];
          if (keycode.code === code) {
            return keycode;
          }
        }
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
      broadcast = function(code) {
        var listener, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = listeners.length; _i < _len; _i++) {
          listener = listeners[_i];
          _results.push(listener.handle(code));
        }
        return _results;
      };
      unknow = function(code) {
        console.log('unregistered key ' + code);
        return {
          key: 'unknow',
          value: code
        };
      };
      dump = function() {
        var listener, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = listeners.length; _i < _len; _i++) {
          listener = listeners[_i];
          _results.push(listener.dump && listener.dump());
        }
        return _results;
      };
      make_normal = function(owner) {
        return {
          onkeydown: function(event) {
            var keycode;
            if (event.keyCode === 17) {
              return owner.current = owner.ctrl;
            } else {
              keycode = (get_keycode(event.keyCode)) || (unknow(event.keyCode));
              broadcast(keycode);
              if (keycode.stop && !owner.allow_default_once) {
                event.preventDefault();
              }
              owner.allow_default_once && (owner.allow_default_once = false);
              return true;
            }
          }
        };
      };
      make_ctrl = function(owner) {
        return {
          onkeydown: function(event) {
            var keycode;
            keycode = get_ctrlkeycode(event.keyCode);
            if (keycode) {
              broadcast(keycode);
              return event.preventDefault();
            } else {
              if (event.keyCode === 68) {
                console.log('dumping');
                event.preventDefault();
                return dump();
              } else {
                return console.log('unregistered key ' + event.keyCode);
              }
            }
          }
        };
      };
      handler = {
        allow_default_once: false
      };
      handler.normal = make_normal(handler);
      handler.ctrl = make_ctrl(handler);
      handler.current = handler.normal;
      return Control = (function() {
        function Control() {}

        Control.subscribe = function(listener) {
          listeners.push(listener);
          return function() {
            return remove(listeners, listener);
          };
        };

        Control.unsubscribe = function(listener) {
          return remove(listeners, listener);
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

        Control.allow_default_once = function() {
          return handler.allow_default_once = true;
        };

        Control.bind_keydown = function(scope) {
          scope.onkeydown = function(event) {
            return handler.current.onkeydown(event);
          };
          return scope.onkeyup = function(event) {
            var keycode;
            if (event.keyCode === 17) {
              handler.current = handler.normal;
            }
            keycode = get_keyupcode(event.keyCode);
            if (keycode) {
              keycode.disable = true;
              return broadcast(keycode);
            }
          };
        };

        return Control;

      })();
    }
  ]);

}).call(this);
