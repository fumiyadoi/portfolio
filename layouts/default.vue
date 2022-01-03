<template>
  <div>
    <section class="main-content">
      <Navbar />
      <div @click="isClose" class="container">
        <Nuxt />
      </div>
    </section>
  </div>
</template>

<script>
import Navbar from '~/components/Navbar.vue'

export default {
  components: {
    Navbar
  },
  methods: {
    isClose () {
      this.$nuxt.$emit('isClose')
    }
  }
}
</script>

<style>
.main-content {
  background: #eff6f6;
  height: 100vh;
}
</style>
