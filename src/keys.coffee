'use strict'

angular.module('module.tac.keys', [])

.service('tac.keys', [
  () ->
    
    listeners = []
    listeners_stack = []
    
    keycodes = [
        key: 'enter'
        code: 13
        stop: true
      ,
        key: 'left'
        code: 37
      ,
        key: 'up'
        code: 38
      ,
        key: 'right'
        code: 39
      ,
        key: 'down'
        code: 40
      ,
        key: 'info'
        code: 457
      ,
        key: 'red'
        code: 403
      ,
        key: 'green'
        code: 404
      ,
        key: 'yellow'
        code: 405
      ,
        key: 'blue'
        code: 406
      ,
        key: 'play'
        code: 415
      ,
        key: 'pause'
        code: 19
      ,
        key: 'rewind'
        code: 412
      ,
        key: 'fast_fwd'
        code: 417
      ,
        key: 'page_up'
        code: 33
      ,
        key: 'page_down'
        code: 34
      ,
        key: 'previous'
        code: 422
      ,
        key: 'next'
        code: 423 
      ,
        key: 'go_back'
        code: 166
      ,
        key: 'subtitle'
        code: 460
      ,
        key: 'audio'
        code: 176
      ,
        key: 'favorites'
        code: 372
      ,
        key: 'help'
        code: 47
      ,
        key: 'menu'
        code: 18
      ,
        key: 'anterior'
        code: 413
      ]
    
    ctrlkeycodes = [
        key: 'menu'
        code: 77 #keyboard M
      ,
        key: 'anterior'
        code: 65 #keyboard A
      ,
        key: 'go_back'
        code: 86 #keyboard V
      ,
        key: 'fast_fwd'
        code: 75 #keyboard k
      ,
        key: 'rewind'
        code: 74 #keyboard j
      ,
        key: 'pause'
        code: 80 #keyboard P
      ,
        key: 'play'
        code: 32 #keyboard space
      ,
        key: 'info'
        code: 73 #keyboard I
      ,
        key: 'red'
        code: 82 #keyboard R
      ,
        key: 'green'
        code: 71 #keyboard G
      ,
        key: 'yellow'
        code: 89 #keyboard Y
      ,
        key: 'blue'
        code: 66 #keyboard B
    ]
      
    make_number = (number)->
      is_number: true
      key: 'number'
      number: number
      
    get_if_number = (code)->
      if code >= 48 and code <= 57
        return make_number code - 48
      if code >= 96 and code <= 105
        return make_number code - 96
      
    get_keycode = (code)->
      for keycode in keycodes
        if keycode.code is code
          return keycode
      return get_if_number code
      
    get_ctrlkeycode = (code)->
      for keycode in ctrlkeycodes
        if keycode.code is code
          return keycode
          
    make_normal = (owner)->
      onkeydown: (event)->
        #console.log 'normal onkeydown ' + event.keyCode
        if event.keyCode is 17
          owner.current = owner.ctrl
        else
          keycode = get_keycode(event.keyCode)
          if keycode
            for listener in listeners
              listener.handle keycode
            if keycode.stop
              event.preventDefault()
          else
            console.log 'unregistered key ' + event.keyCode
      onkeyup: (event)->
        #console.log 'normal onkeyup ' + event.keyCode
        
            
    make_ctrl = (owner)->
      onkeydown: (event)->
        #console.log 'ctrl onkeydown ' + event.keyCode
        keycode = get_ctrlkeycode(event.keyCode)
        if keycode
          for listener in listeners
            listener.handle keycode
          event.preventDefault()
        else
          console.log 'unregistered key ' + event.keyCode
      onkeyup: (event)->
        #console.log 'ctrl onkeyup ' + event.keyCode
        if event.keyCode is 17
          owner.current = owner.normal
    
    handler = {}
    handler.normal  = make_normal(handler)
    handler.ctrl    = make_ctrl(handler)
    handler.current = handler.normal
       
    class Control
      
      @subscribe = (listener)->
        listeners.push listener
        -> unsubscribe listener
      
      @unsubscribe = (listener)->
        _.remove listeners, listener
        
      @create_level = ()->
        listeners_stack.push listeners
        listeners = []
        
      @previous_level = ()->
        if listeners_stack.length > 0
          listeners = listeners_stack.pop()
        else
          console.error "trying to pop unique listener array from listeners_stack"
      
      @bind_keydown = (scope) ->
        scope.onkeydown = (event) ->
          handler.current.onkeydown event
            
        scope.onkeyup = (event) ->
          handler.current.onkeyup event
          
      
      
])