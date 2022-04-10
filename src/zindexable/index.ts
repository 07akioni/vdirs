import { ObjectDirective } from 'vue'
import zIndexManager from './z-index-manager'

interface ZIndexableElement extends HTMLElement {
  '@@ziContext': {
    enabled: boolean
    initialized: boolean
  }
}

const ctx: '@@ziContext' = '@@ziContext'

// We don't expect manually bound zindex should be changed
const zindexable: ObjectDirective<
  ZIndexableElement,
  { zIndex?: number; enabled?: boolean } | undefined
> = {
  mounted(el, bindings) {
    const { value = {} } = bindings
    const { zIndex, enabled } = value
    el[ctx] = {
      enabled: !!enabled,
      initialized: false
    }
    if (enabled) {
      zIndexManager.ensureZIndex(el, zIndex)
      el[ctx].initialized = true
    }
  },
  updated(el, bindings) {
    const { value = {} } = bindings
    const { zIndex, enabled } = value
    const cachedEnabled = el[ctx].enabled
    if (enabled && !cachedEnabled) {
      zIndexManager.ensureZIndex(el, zIndex)
      el[ctx].initialized = true
    }
    el[ctx].enabled = !!enabled
  },
  unmounted(el, bindings) {
    if (!el[ctx].initialized) return
    const { value = {} } = bindings
    const { zIndex } = value
    zIndexManager.unregister(el, zIndex)
  }
}

export default zindexable
