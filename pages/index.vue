<template>
  <section class="section">
    <div class="columns is-mobile center mt-5">
      <div class="column is-12">
        <Logo width="251" height="108" />
      </div>
    </div>
    <div class="columns is-mobile center mt-80">
      <div class="column is-12">
        <button @click="goSokudoku" class="button menu-button">速読</button>
      </div>
    </div>
    <div class="columns is-mobile center mt-4">
      <div class="column is-12">
        <button @click="goSokutore" class="button menu-button">速トレ</button>
      </div>
    </div>
  </section>
</template>

<script>
import Logo from '~/assets/logo.svg'

export default {
  components: {
    Logo
  },
  methods: {
    goSokudoku () {
      this.$router.push('sokudoku-top')
    },
    goSokutore () {
      this.$router.push('sokutore-top')
    }
  }
}
</script>

<style>
.center {
  text-align: center;
}

.menu-button {
  width: 343px;
  height: 80px;
  border: 1px solid #c9c8c7;
  border-radius: 8px;
  color: #3362a8;
  font-size: 28px;
  font-weight: bold;
  box-shadow: 0 2px 3px #00000029;
}

.mt-80 {
  margin-top: 80px;
}
</style>
