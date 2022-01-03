<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="columns is-mobile  is-vcentered" style="margin: 0; height: 100%;">
      <div class="column is-2 has-text-right-tablet" style="display: flex; align-items: center;">
        <LeftArrow @click="checkBack" class="leftarrow" style="width: 44px; height: 44px;" />
      </div>
      <div class="column is-2"></div>
      <div class="column is-4 has-text-white has-text-centered">{{ title }}</div>
    </div>
    <div class="modal" id="modal" v-bind:class="modal_class">
      <div class="modal-background" id="modal-background"></div>
      <div class="modal-content has-background-white" id="modal-content-top" style="border-radius: 8px;">
        <div class="column is-12">
          <div class="columns is-mobile is-vcentered" id="modalnav">
            <div class="column is-2"></div>
            <div class="column is-8 has-text-weight-semibold has-text-centered" style="color: #404a72;">確認</div>
            <div class="column is-2 has-text-weight-semibold has-text-right" style="font-size: 1.5em; color: #404a72;"><span @click="onSelectModal" id="close">×</span></div>
          </div>
        </div>
        <hr>
        <div class="column is-12 has-text-weight-semibold has-text-centered">入力内容の変更が保存されませんが戻りますか？</div>
        <div class="column is-12">
          <div class="columns is-mobile is-vcentered is-multiline">
            <div class="column is-6">
              <button @click="onSelectModal" class="button back-button is-size-7">いいえ</button>
            </div>
            <div class="column is-6">
              <button @click="goBookList" class="button back-button Warn is-size-7">はい</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import LeftArrow from '~/assets/Accessory_Left_Arrow.svg'

export default {
  data () {
    return {
      modal_class: ''
    }
  },
  components: {
    LeftArrow
  },
  props: {
    isChanged: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    checkBack () {
      if (this.isChanged) {
        this.onSelectModal()
      } else {
        this.$router.push('booklist')
      }
    },
    onSelectModal () {
      if (this.modal_class === 'is-active') {
        this.modal_class = ''
      } else {
        this.modal_class = 'is-active'
      }
    },
    goBookList () {
      this.$router.push('booklist')
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

.leftarrow:hover {
  cursor: pointer;
}

#close:hover {
  cursor: pointer;
}

#modal-content-top {
  width: 90%;
}

@media screen and (min-width: 769px) {
  .navbar {
    height: 80px;
    display: block;
  }

  #modal-content-top {
    width: 50%;
  }
}
</style>
