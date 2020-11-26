import { warn } from '../utils'

class ZIndexManager {
  elementZIndex: Map<HTMLElement, number>
  nextZIndex: number

  constructor () {
    this.elementZIndex = new Map()
    this.nextZIndex = 2000
  }

  get elementCount () {
    return this.elementZIndex.size
  }

  ensureZIndex (el: HTMLElement, zIndex ?: number) {
    const { elementZIndex } = this
    if (zIndex !== undefined) {
      el.style.zIndex = `${zIndex}`
      elementZIndex.delete(el)
      return
    }
    const { nextZIndex } = this
    if (elementZIndex.has(el)) {
      const currentZIndex = elementZIndex.get(el)
      if (
        currentZIndex !== undefined &&
        currentZIndex + 1 === this.nextZIndex
      ) return
    }
    el.style.zIndex = `${nextZIndex}`
    elementZIndex.set(el, nextZIndex)
    this.nextZIndex = nextZIndex + 1
    this.squashState()
  }

  unregister (el: HTMLElement) {
    const { elementZIndex } = this
    if (elementZIndex.has(el)) {
      elementZIndex.delete(el)
    } else {
      warn('vdirs/z-index-manager/unregister-element', 'Element not found when unregistering.')
    }
    this.squashState()
  }

  squashState () {
    const { elementCount } = this
    if (!elementCount) {
      this.nextZIndex = 2000
    }
    if (this.nextZIndex - elementCount > 2500) this.rearrange()
  }

  rearrange () {
    const elementZIndexPair = Array.from(this.elementZIndex.entries())
    elementZIndexPair.sort((pair1, pair2) => {
      return pair1[1] - pair2[1]
    })
    this.nextZIndex = 2000
    elementZIndexPair.forEach(pair => {
      const el = pair[0]
      const zIndex = this.nextZIndex++
      if (`${zIndex}` !== el.style.zIndex) el.style.zIndex = `${zIndex}`
    })
  }
}

export default new ZIndexManager()
