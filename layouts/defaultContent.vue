<template>
  <div>
    <section class="main-content-content">
      <NavbarContent v-on:componentRef="backPage" :title="title"/>
      <div @click="isClose" class="container-content">
        <Nuxt/>
      </div>
    </section>
  </div>
</template>

<script>
import NavbarContent from '~/components/NavbarContent.vue'

export default {
  name: 'defaultContent', /* これ入れないとエラー出るので入れてます */
  data () {
    return {
      ref: '',
      title: ''
    }
  },
  components: {
    NavbarContent
  },
  created () {
    this.setListener()
  },
  methods: {
    setListener () {
      this.$nuxt.$on('updateRef', this.setRef1)
      this.$nuxt.$on('updateTitle', this.setRef2)
    },
    setRef1 (ref) {
      this.ref = ref || ''
    },
    setRef2 (title) {
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
.main-content-content {
  height: 100vh;
  background: #eff6f6;
}

.container-content {
  height: calc(100% - 58px);
  display: flex;
  align-items: center;
  justify-content: center;
}

@media screen and (min-width: 769px) {
  .container-content {
    height: calc(100% - 80px);
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
