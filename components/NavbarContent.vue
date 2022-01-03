<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="columns is-mobile  is-vcentered" style="margin: 0; height: 100%;">
      <div class="column is-2 has-text-right-tablet" style="display: flex; align-items: center;">
        <Batsu class="batsu" style="width: 44px; height: 44px;" @click="goAnotherPage"/>
      </div>
      <div class="column is-2"></div>
      <div class="column is-4 has-text-white has-text-centered">{{ title }}</div>
    </div>
  </nav>
</template>

<script>
import Batsu from '~/assets/Accessory_Batsu.svg'

export default {
  components: {
    Batsu
  },
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  methods: {
    goAnotherPage () {
      this.$emit('componentRef')
    }
  }
}
</script>

<style>
/* 共通 */
.navbar {
  background: #3362a8;
  height: 58px;
}

.navbar-burger span {
  height: 2px;
}

span:hover {
  cursor: pointer;
}

.batsu:hover {
  cursor: pointer;
}

@media screen and (min-width: 769px) {
  .navbar {
    height: 80px;
    display: block;
  }
}
</style>
