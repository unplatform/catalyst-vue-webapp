<template lang="pug">
.hero.primary-hero
  .hero-head
    nav.navbar
      .container
        .navbar-brand
          router-link.navbar-item(to="/")
            img(:src="brandUrl")
        .navbar-end
          router-link.navbar-item(to="/about", active-class="is-active") About
  .hero-body(v-if="$slots.default")
    .container
      slot
  .hero-foot(v-if="$slots.foot")
    slot(name="foot")
</template>

<script>
import { GETTER_PUBLIC_ASSET } from '@/const'

export default {
  computed: {
    brandUrl() {
      return this.$store.getters[GETTER_PUBLIC_ASSET]('brand.png')
    }
  }
}
</script>

<style lang="sass">
.primary-hero
  +add-theme-colors

  &.is-gradient
    color: $white
    background-image: linear-gradient(to left, #36C0CD, #1FC986)

  &.is-not-found
    color: $white
    background-image: linear-gradient(to left, lighten($danger, 10%), #36C0CD)

  .hero-title-icon
    display: inline-block
    height: 1.75em
    line-height: 1em
    vertical-align: middle
    margin-right: 0.3em
    fill: currentColor

  .navbar-end
    .navbar-item
      color: white
      font-weight: 900
      &.is-active
        background: rgba(0,0,0,0.05)
        text-decoration: underline
      &:hover
        background: rgba(0,0,0,0.1)
</style>
