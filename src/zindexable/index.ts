import { ObjectDirective } from 'vue'
import zIndexManager from './z-index-manager'

interface ZIndexableElement extends HTMLElement {
  '@@ziContext': {
    enabled: boolean
  }
}

const ctx: '@@ziContext' = '@@ziContext'

const zindexable: ObjectDirective<ZIndexableElement> = {
  mounted (el, bindings) {
    const { value = {} } = bindings
    const { zIndex, enabled } = value
    zIndexManager.ensureZIndex(el, zIndex)
    el[ctx] = {
      enabled
    }
  },
  updated (el, bindings) {
    const { value = {} } = bindings
    const { zIndex, enabled } = value
    const cachedEnabled = el[ctx].enabled
    if (enabled && !cachedEnabled) {
      zIndexManager.ensureZIndex(el, zIndex)
    }
    el[ctx].enabled = enabled
  },
  unmounted (el) {
    zIndexManager.unregister(el)
  }
}

export default zindexable
