export { default as Card } from '../../components/Card.vue'
export { default as FontSizeButton } from '../../components/FontSizeButton.vue'
export { default as Navbar } from '../../components/Navbar.vue'
export { default as NavbarContent } from '../../components/NavbarContent.vue'
export { default as NavbarEdit } from '../../components/NavbarEdit.vue'
export { default as NavbarList } from '../../components/NavbarList.vue'
export { default as NavbarTop } from '../../components/NavbarTop.vue'
export { default as NuxtLogo } from '../../components/NuxtLogo.vue'
export { default as Tutorial } from '../../components/Tutorial.vue'

// nuxt/nuxt.js#8607
function wrapFunctional(options) {
  if (!options || !options.functional) {
    return options
  }

  const propKeys = Array.isArray(options.props) ? options.props : Object.keys(options.props || {})

  return {
    render(h) {
      const attrs = {}
      const props = {}

      for (const key in this.$attrs) {
        if (propKeys.includes(key)) {
          props[key] = this.$attrs[key]
        } else {
          attrs[key] = this.$attrs[key]
        }
      }

      return h(options, {
        on: this.$listeners,
        attrs,
        props,
        scopedSlots: this.$scopedSlots,
      }, this.$slots.default)
    }
  }
}
