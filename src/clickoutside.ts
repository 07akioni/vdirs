import { ObjectDirective } from 'vue'
import { on, off } from 'evtd'

const ctxKey: '@@coContext' = '@@coContext'

interface ClickOutsideElement extends HTMLElement {
  '@@coContext': {
    handler: ((e: MouseEvent) => any) | undefined
  }
}

const clickoutside: ObjectDirective<ClickOutsideElement> = {
  mounted (el, { value }) {
    el[ctxKey] = {
      handler: undefined
    }
    if (typeof value === 'function') {
      el[ctxKey].handler = value
      on('clickoutside', el, value)
    }
  },
  updated (el, { value }) {
    const ctx = el[ctxKey]
    if (typeof value === 'function') {
      if (ctx.handler) {
        if (ctx.handler !== value) {
          off('clickoutside', el, ctx.handler)
          ctx.handler = value
          on('clickoutside', el, value)
        }
      } else {
        el[ctxKey].handler = value
        on('clickoutside', el, value)
      }
    } else {
      if (ctx.handler) {
        off('clickoutside', el, ctx.handler)
        ctx.handler = undefined
      }
    }
  },
  unmounted (el) {
    const { handler } = el[ctxKey]
    if (handler) {
      off('clickoutside', el, handler)
    }
    el[ctxKey].handler = undefined
  }
}

export default clickoutside
