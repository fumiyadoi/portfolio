<template>
  <div>
    <section class="main-content-top">
      <NavbarTop :title="title"/>
      <div @click="isClose" class="container_top">
        <Nuxt />
      </div>
    </section>
  </div>
</template>

<script>
import NavbarTop from '~/components/NavbarTop.vue'

export default {
  name: 'defaultTop', /* これ入れないとエラー出るので入れてます */
  data () {
    return {
      ref: '',
      title: ''
    }
  },
  components: {
    NavbarTop
  },
  created () {
    this.setListener()
  },
  methods: {
    setListener () {
      this.$nuxt.$on('updateTitle', this.setRef)
    },
    setRef (title) {
      this.title = title || ''
    },
    backPage () {
      this.$router.push(this.ref)
    },
    isClose () {
      this.$nuxt.$emit('isClose')
    }
  }
}
</script>

<style>
.main-content-top {
  height: 100vh;
  background: #eff6f6;
}

.container-top {
  height: calc(100% - 58px);
  display: flex;
  align-items: center;
  justify-content: center;
}

@media screen and (min-width: 769px) {
  .container_top {
    height: calc(100% - 80px);
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
