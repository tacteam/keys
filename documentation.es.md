### guia de desarrollo TAC

# tac-keys

**tac.keys** administra los eventos de teclado emitidos por el browser, convirtiéndolos en acciones sobre todo aquel que se subscriba al servicio proporcionado.

## Install

Este repositorio de distribuye a travez del administrador `bower`. Los fuentes de este módulo se pueden encontrar en el
[repositorio general TacTeam](https://github.com/tacteam/keys).
Sientase a gusto de reportar problemas o proponer nuevas *features* en este repositorio

### bower

Este módulo puede ser instalado con `bower`.

```shell
bower install tac-keys
```

Opcionalmente puede agregar el prefijo --save para agregar la dependencia al archivo bower.js

```shell
bower install tac-keys --save
```

Luego agregue el correpondiente tag `<script>` a su `index.html`:

```html
<script src="/bower_components/tac-keys/dist/keys.js"></script>
```

## Documentación

##### Dependencia Angular

```js
angular.module('main-application',[
  '...dependencies...'
  'module.tac.keys'
  '...dependencies...'
])
```

##### Inicialización del componente

```js
angular.module('main-application')
.run([
  'tac.keys',
  function(keys) {
    keys.bind_keydown(document);
  }
])
```

##### Uso

```js
angular.module('main-application')
.run([
  'tac.keys',
  'manejador',
  function(keys, manejador) {
    keys.bind_keydown(document);
    keys.subscribe(manejador);
  }
])
```

Cuando una tecla es presionada **tac.key** verifica que **manejador** implemente la correspondiente accion y la ejecuta.

## Licencia

No disponible aún.
