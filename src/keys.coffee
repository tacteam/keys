'use strict'

angular.module('module.tac.keys', [])

.service('tac.keys', [
  () ->
    
    #must crete level to add listeners
    listeners = []
    listeners_stack = []
    
    keycodes = [
        key: 'enter'
        code: 13
        stop: true
      ,
        key: 'back_space'
        code: 8
        stop: true
      ,
        key: 'left'
        code: 37
        stop: true
      ,
        key: 'up'
        code: 38
        stop: true
      ,
        key: 'right'
        code: 39
        stop: true
      ,
        key: 'down'
        code: 40
        stop: true
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
      ,
        key: 'caps_lock'
        code: 20 
      ,
        key: 'space_bar'
        code: 32
      ,
        key: 'shift'
        code: 16
      ,
        key: 'alt'
        code: 18
      ,
        key: 'acute'
        code: 219
      ,
        key: 'alt_gr'
        code: 225
      ]
    
    keyupcodes = [
        key: 'shift'
        code: 16
      ,
        key: 'alt_gr'
        code: 225
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
    
    remove = (collection, elem)->
      elem_index = collection.indexOf(elem)
      (elem_index > -1) and collection.splice(elem_index, 1)
      
    make_letter = (letter)->
      is_letter: true
      key: 'letter'
      letter: letter
      
    make_number = (number)->
      is_number: true
      key: 'number'
      number: number
      
    get_if_letter = (code)->
      if code is 192
        return make_letter 'ñ'
      if code >= 65 and code <= 90
        value = String.fromCharCode(code + 32)
        return make_letter value
        
    get_if_number = (code)->
      if code >= 48 and code <= 57
        return make_number code - 48
      if code >= 96 and code <= 105
        return make_number code - 96
      
    get_keycode = (code)->
      for keycode in keycodes
        if keycode.code is code
          return keycode
      return (get_if_number code) or (get_if_letter code)
      
    get_keyupcode = (code)->
      for keycode in keyupcodes
        if keycode.code is code
          return keycode
          
    get_ctrlkeycode = (code)->
      for keycode in ctrlkeycodes
        if keycode.code is code
          return keycode
    
    broadcast = (code)->
      for listener in listeners
        listener.handle code
        
    unknow = (code)->
      console.log 'unregistered key ' + code
      key: 'unknow'
      value: code
      
    dump = ->
      for listener in listeners
        listener.dump and listener.dump()
          
    make_normal = (owner)->
      onkeydown: (event)->
        if event.keyCode is 17
          owner.current = owner.ctrl
        else
          keycode = (get_keycode event.keyCode) or (unknow event.keyCode)
          broadcast keycode
          if keycode.stop and not owner.allow_default_once
            event.preventDefault()
          owner.allow_default_once and (owner.allow_default_once = false)
          true
    
    make_ctrl = (owner)->
      onkeydown: (event)->
        keycode = get_ctrlkeycode(event.keyCode)
        if keycode
          broadcast keycode
          event.preventDefault()
        else
          if event.keyCode is 68
            console.log 'dumping'
            event.preventDefault()
            dump()
          else
            console.log 'unregistered key ' + event.keyCode
        
          
    handler = allow_default_once:false
    handler.normal  = make_normal(handler)
    handler.ctrl    = make_ctrl(handler)
    handler.current = handler.normal
       
    class Control
      
      @subscribe = (listener)->
        listeners.push listener
        -> remove listeners, listener
      
      @unsubscribe = (listener)->
        remove listeners, listener
        
      @create_level = ()->
        listeners_stack.push listeners
        listeners = []
        
      @previous_level = ()->
        if listeners_stack.length > 0
          listeners = listeners_stack.pop()
        else
          console.error "trying to pop unique listener array from listeners_stack"
      
      @allow_default_once = ->
        handler.allow_default_once = true
        
      
      @bind_keydown = (scope) ->
        scope.onkeydown = (event) ->
          handler.current.onkeydown event
        
        scope.onkeyup = (event) ->
          if event.keyCode is 17
            handler.current = handler.normal
          keycode = get_keyupcode event.keyCode
          if keycode
            keycode.disable = true
            broadcast keycode
          
      
])