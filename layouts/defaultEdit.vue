<template>
  <div>
    <section class="main-content-top">
      <NavbarEdit :isChanged="isChanged" />
      <div @click="isClose" class="container_top">
        <Nuxt />
      </div>
    </section>
  </div>
</template>

<script>
import NavbarEdit from '~/components/NavbarEdit.vue'

export default {
  name: 'defaultEdit', /* これ入れないとエラー出るので入れてます */
  data () {
    return {
      isChanged: false
    }
  },
  components: {
    NavbarEdit
  },
  created () {
    this.setListener()
  },
  methods: {
    setListener () {
      this.$nuxt.$on('checkChange', this.setRef)
    },
    setRef (boolean) {
      if (boolean) {
        this.isChanged = true
      } else {
        this.isChanged = false
      }
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
