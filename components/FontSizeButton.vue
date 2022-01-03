<template>
  <button class="size-button" :class="{isOrange: isSelected, isBlue: !isSelected}" @click="selectSize">{{sizeTitle}}</button>
</template>

<script>
export default {
  data () {
    return {
      sizeTitle: ''
    }
  },
  props: {
    size: {
      type: String,
      default: ''
    },
    isSelected: {
      type: Boolean,
      default: false
    }
  },
  created () {
    if (this.size === 'small') {
      this.sizeTitle = '小'
    } else if (this.size === 'medium') {
      this.sizeTitle = '中'
    } else {
      this.sizeTitle = '大'
    }
  },
  methods: {
    selectSize () {
      this.$store.commit('data/changeFontsize', this.size)
    }
  }
}
</script>

<style>
.size-button {
  font-size: 1em;
  padding: 7px 16px;
  border-radius: 4px;
  transition: all 0.3s;
  border: 1px solid #3362a8;
  background: white;
  color: #3362a8;
  font-weight: bold;
  box-shadow: 0 2px 3px #00000029;
}

.isOrange {
  border: 1px solid #f18d1d;
  color: #f18d1d;
}

.isBlue {
  border: 1px solid #3362a8;
  color: #3362a8;
}
</style>
