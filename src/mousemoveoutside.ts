import { ObjectDirective } from 'vue'
import { warn } from './utils'
import { on, off } from 'evtd'

const ctx:'@@mmoContext' = '@@mmoContext'

interface MouseMoveOutsideElement extends HTMLElement {
  '@@mmoContext': {
    handler: (e: MouseEvent) => any
  }
}

const mousemoveoutside: ObjectDirective<MouseMoveOutsideElement> = {
  beforeMount (el, { value }) {
    if (typeof value === 'function') {
      el[ctx] = {
        handler: value
      }
      on('mousemoveoutside', el, value)
    }
  },
  updated (el, { value }) {
    if (typeof value === 'function') {
      if (el[ctx] && el[ctx].handler) {
        if (el[ctx].handler !== value) {
          off('mousemoveoutside', el, el[ctx].handler)
          el[ctx].handler = value
          on('mousemoveoutside', el, el[ctx].handler)
        }
      } else {
        el[ctx].handler = value
        on('mousemoveoutside', el, el[ctx].handler)
      }
    } else {
      warn('mousemoveoutside', 'Binding value is not a function.')
    }
  },
  unmounted (el) {
    off('mousemoveoutside', el, el[ctx].handler)
  }
}

export default mousemoveoutside
