<template>
  <div class="columns is-mobile is-centered" style="width: 100%; height: 80%; margin: 0;">
    <div class="column is-4-tablet is-11-mobile">
      <div class="columns is-mobile is-multiline is-centered is-vcentered">
        <div class="column is-12 wrapper-content mb-5 tategaki-wrapper">
          <div class="tategaki pt-3 pb-1" :class="fontsize">{{trimmed[page]}}</div>
          <div class="is-size-7 has-text-centered">{{(page + 1) +'/'+length}}</div>
        </div>
        <div class="column is-12 wrapper-content">
          <div class="columns is-mobile is-vcentered">
            <figure @click="onSpeedModal" class="image is-1" id="speed"><Speed style="width: 60px; height: 60px;"/></figure>
            <figure v-if="isPlay" @click="pause" class="image is-1" id="pause"><Pause style="width: 60px; height: 60px;"/></figure>
            <figure v-else @click="play" class="image is-1" id="play"><Play style="width: 60px; height: 60px;"/></figure>
            <div class="column is-fullwidth has-text-right"><span class="p-2 is-size-7" id="gotoppage" @click="goTopPage">最初に戻る >|</span></div>
          </div>
        </div>
      </div>
      <div class="modal" id="modal" v-bind:class="modal_class">
        <div class="modal-background" id="modal-background"></div>
        <div class="modal-content has-background-white" id="modal-content-content" style="border-radius: 8px;">
          <div class="column is-12">
            <div class="columns is-mobile is-vcentered" id="modalnav">
              <div class="column is-2"></div>
              <div class="column is-8 has-text-weight-semibold has-text-centered" style="color: #404a72;">速度</div>
              <div class="column is-2 has-text-weight-semibold has-text-right" style="font-size: 1.5em; color: #404a72;"><span @click="onSpeedModal" id="close">×</span></div>
            </div>
          </div>
          <hr>
          <div class="column is-12 mt-6 mb-4">
            <div class="columns is-centered is-vcentered is-mobile">
              <figure class="image is-2" style="display: flex; align-items: center;">
                <Min style="width: 40px; height: 40px;"/>
              </figure>
              <vue-slider style="width: 70%;" ref="slider" v-model="speed" :min=1 :max=100></vue-slider>
              <figure class="image is-2" style="display: flex; align-items: center;">
                <Max style="width: 40px; height: 40px;"/>
              </figure>
            </div>
          </div>
          <div class="column is-12 has-text-centered">スライドして速度の調整が可能です。</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Speed from 'assets/Accessory_speed_low_2.svg'
import Pause from 'assets/Accessory_Pause.svg'
import Play from 'assets/Accessory_Play.svg'
import Min from 'assets/Accessory_speed_low.svg'
import Max from 'assets/Accessory_speed_max.svg'
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'

export default {
  layout: 'defaultContent',
  data () {
    return {
      Ref: 'sokudoku-top', /* ここにnavberの戻るボタンの遷移先を入れください（by fumiya 2021.12.5） */
      bookTitle: '',
      body: '',
      trimmed: [],
      length: '',
      page: '',
      intervalId: undefined,
      isPlay: true,
      fontsize: '',
      modal_class: '',
      speed: 50
    }
  },
  components: {
    Speed,
    Pause,
    Play,
    Min,
    Max,
    VueSlider
  },
  async mounted () {
    console.log(this.$store.state.data.bookPages)
    this.speed = this.$store.state.data.sokudokuSpeed/* スピードをvuexから取得します。 */
    /* 文字サイズを設定します。 */
    if (this.$store.state.data.fontsize === 'small') {
      this.fontsize = 'is-size-7'
    } else if (this.$store.state.data.fontsize === 'medium') {
      this.fontsize = 'is-size-6'
    } else {
      this.fontsize = 'is-size-5'
    }
    const bookList = this.$store.state.data.bookList.concat(this.$store.state.data.userBookList)
    const bookContent = this.$store.state.data.bookContent.concat(this.$store.state.data.userBookContent)
    this.bookTitle = bookList[this.$store.state.data.bookIndex]
    this.body = bookContent[this.$store.state.data.bookIndex]
    for (let i = 0; i < this.body.length / 40; i++) {
      if (i === Math.floor(this.body.length / 40)) {
        this.trimmed.push(this.body.slice(i * 40, this.body.length))
      } else {
        this.trimmed.push(this.body.slice(i * 40, (i + 1) * 40))
      }
    }
    /* 全ページ数と現在ページの表示を設定します。 */
    this.page = this.$store.state.data.bookPages[this.$store.state.data.bookIndex][0]
    this.length = this.trimmed.length
    this.updateRef()/* navbarの戻るボタンの遷移先の受け渡し */
    this.updateTitle()/* navbarのタイトルの受け渡し */
    /* 速読処理を開始します。 */
    this.play()
  },
  destroyed () {
    this.pause()
  },
  methods: {
    updateRef () {
      this.$nuxt.$emit('updateRef', this.Ref)
    },
    updateTitle () {
      this.$nuxt.$emit('updateTitle', this.bookTitle)
    },
    onSpeedModal () {
      this.pause()
      if (this.modal_class === 'is-active') {
        this.modal_class = ''
        this.$store.commit('data/changeSokudokuSpeed', this.speed)
      } else {
        this.modal_class = 'is-active'
      }
    },
    changePage () {
      if (this.$store.state.data.bookPages[this.$store.state.data.bookIndex][0] < this.length - 1) {
        this.$store.commit('data/changePage', 0)
        this.page = this.$store.state.data.bookPages[this.$store.state.data.bookIndex][0]
      } else {
        this.pause()
      }
    },
    goTopPage () {
      this.pause()
      this.$store.commit('data/goTopPage', 0)
      this.page = this.$store.state.data.bookPages[this.$store.state.data.bookIndex][0]
    },
    pause () {
      clearInterval(this.intervalId)
      this.isPlay = false
    },
    play () {
      this.intervalId = setInterval(() => {
        this.isPlay = true
        this.changePage()
      }, -49.5 * this.speed + 5049)
    }
  }
}
</script>

<style>
.vue-slider-dot-tooltip-inner.vue-slider-dot-tooltip-inner-top {
  border: #f18d1d;
  background-color: #f18d1d;
  visibility: visible;
}

.tategaki-wrapper {
  display: flex;
  flex-flow: column;
  align-items: center;
}

.tategaki {
  -ms-writing-mode: tb-rl;
  -webkit-writing-mode: vertical-rl;
  writing-mode: vertical-rl;
  height: 50%;
  line-height: 3em;
  letter-spacing: 0.3em;
  display: flex;
  align-items: center;
}

.wrapper-content {
  border-radius: 4px;
  background: white;
}

#speed,
#pause,
#play {
  display: flex;
  align-items: center;
  cursor: pointer;
}

#pause,
#play {
  align-items: 'center';
}

#gotoppage {
  border: 0.5px solid #3362a8;
  color: #3362a8;
  border-radius: 8px;
}

#close:hover {
  cursor: pointer;
}

hr {
  margin: 0;
}

#modal-content-content {
  width: 90%;
}

@media screen and (min-width: 769px) {
  #modal-content-content {
    width: 50%;
  }
}
</style>
