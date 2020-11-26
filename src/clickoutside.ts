import { ObjectDirective } from 'vue'
import { on, off } from 'evtd'
import { warn } from './utils'

const ctx: '@@coContext' = '@@coContext'

interface ClickOutsideElement extends HTMLElement {
  '@@coContext': {
    handler: (e: MouseEvent) => any
  }
}

const clickoutside: ObjectDirective<ClickOutsideElement> = {
  mounted (el, { value }) {
    if (typeof value === 'function') {
      el[ctx] = {
        handler: value
      }
      on('clickoutside', el, el[ctx].handler)
    }
  },
  updated (el, { value }) {
    if (typeof value === 'function') {
      if (el[ctx] && el[ctx].handler) {
        if (el[ctx].handler !== value) {
          off('clickoutside', el, el[ctx].handler)
          el[ctx].handler = value
          on('clickoutside', el, el[ctx].handler)
        }
      } else {
        el[ctx].handler = value
        on('clickoutside', el, el[ctx].handler)
      }
    } else if (process.env.NODE_ENV !== 'production') {
      warn('clickoutside', 'Binding value is not a function.')
    }
  },
  unmounted (el) {
    off('clickoutside', el, el[ctx].handler)
  }
}

export default clickoutside
