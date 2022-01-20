<template>
  <div class="columns is-mobile is-centered" style="width: 100%; height: 97%; margin: 0;">
    <div class="column is-4-tablet is-11-mobile">
      <div class="columns is-mobile is-multiline is-centered is-vcentered">
        <div class="column is-12 wrapper-content mb-3 tategaki-wrapper">
          <div class="sokudoku-wrapper tategaki pt-3 pb-1" :class="fontsize" :style="height">
            <span v-for="i in lines" :key="i" :style="highlights[i-1]" style="cursor: default;">{{trimmed[page * lines + i - 1]}}</span>
          </div>
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
              <vue-slider style="width: 60%;" ref="slider" v-model="speed" :min=1 :max=100></vue-slider>
              <figure class="image is-2" style="display: flex; align-items: center;">
                <Max style="width: 40px; height: 40px;"/>
              </figure>
              <button class="guinness-button is-size-7" style="cursor: pointer;" @click="setGuinness">ギネス</button>
            </div>
          </div>
          <div class="column is-12 is-size-7 has-text-centered" style="padding-top: 0; color: #404a72;">{{displaySpeed}}文字/分</div>
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
      bookTitle: '',
      body: '',
      trimmed: [],
      highlights: [],
      page: 0,
      length: '',
      intervalId: undefined,
      isPlay: true,
      fontsize: '',
      charaLen: 0,
      lines: 0,
      nowline: 0,
      modal_class: '',
      speed: 50
    }
  },
  computed: {
    tategakiHeight: function () {
      if (window.innerWidth > 768) {
        return 0.97 * (window.innerHeight - 58) - 132
      } else {
        return 0.97 * (window.innerHeight - 80) - 108
      }
    },
    height: function () {
      return `height: ${this.tategakiHeight}px;`
    },
    displaySpeed: function () {
      return Math.floor(6000 / (17.91196 * Math.exp(-0.0201 * this.speed))) * 10
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
  watch: {
    page: function(newVal, oldVal) {
      this.text = String(this.page)
    }
  },
  async mounted () {
    this.speed = this.$store.state.data.sokudokuSpeed/* スピードをvuexから取得します。 */
    /* 文字サイズを設定します。 */
    if (this.$store.state.data.fontsize === 'small') {
      this.fontsize = 'is-size-7'
      this.lines = window.innerWidth < 769 ? Math.floor(window.innerWidth * 0.03803) : Math.floor(window.innerWidth * 0.01341)
    } else if (this.$store.state.data.fontsize === 'medium') {
      this.fontsize = 'is-size-6'
      this.lines = window.innerWidth < 769 ? Math.floor(window.innerWidth * 0.02679) : Math.floor(window.innerWidth * 0.009 + 1)
    } else {
      this.fontsize = 'is-size-5'
      this.lines = window.innerWidth < 769 ? Math.floor(window.innerWidth * 0.02232) : Math.floor(window.innerWidth * 0.00746)
    }
    // ハイライトのスタイルの初期設定を追加
    for (let i = 0; i < this.lines; i++) {
      if (this.$store.state.data.fontsize === 'small') {
        this.highlights.push({ color: '#c9c8c7', width: '24px' })
      } else if (this.$store.state.data.fontsize === 'medium') {
        this.highlights.push({ color: '#c9c8c7', width: '32px' })
      } else {
        this.highlights.push({ color: '#c9c8c7', width: '40px' })
      }
    }
    const bookList = this.$store.state.data.bookList.concat(this.$store.state.data.userBookList)
    const bookContent = this.$store.state.data.bookContent.concat(this.$store.state.data.userBookContent)
    this.bookTitle = bookList[this.$store.state.data.bookIndex]
    this.body = bookContent[this.$store.state.data.bookIndex]
    /* 本の中身を1行ごとに分割します */
    if (this.fontsize === 'is-size-7') {
      this.charaLen = Math.floor(this.tategakiHeight * 0.07675)
      this.bodySlice()
    } else if (this.fontsize === 'is-size-6') {
      this.charaLen = Math.floor(this.tategakiHeight * 0.05907)
      this.bodySlice()
    } else {
      this.charaLen = Math.floor(this.tategakiHeight * 0.04922 - 1.966)
      this.bodySlice()
    }
    /* 全ページ数と現在ページの表示を設定します。 */
    this.length = Math.floor((this.trimmed.length / this.lines) + 1)
    this.$nuxt.$emit('updateRef', 'sokudoku-top')/* navbarの戻るボタンの遷移先の受け渡し */
    this.$nuxt.$emit('updateTitle', this.bookTitle)/* navbarのタイトルの受け渡し */
    /* 速読処理を開始します。 */
    this.play()
  },
  destroyed () {
    this.pause()
    let charaLeftSumTmp = 0
    for (let i = 0; i < this.page * this.lines; i++) {
      if (this.trimmed[i].length < this.charaLen) {
        charaLeftSumTmp += this.charaLen - this.trimmed[i].length - 1
      }
    }
    this.$store.commit('data/changePage', [0, this.page * this.lines * this.charaLen - charaLeftSumTmp])
  },
  methods: {
    bodySlice () {
      const nowCharaNum = this.$store.state.data.charaIndexs[this.$store.state.data.bookIndex][0]
      let charaNum = 0
      let endFlag = false
      let checked = false
      while (true) {
        let newlineFlag = false
        // 1行の文字数分先の間に改行がないかと文章の最後の文字がないかをチェックします
        for (let i = 0; i < this.charaLen; i++) {
          // 改行があれば次の行へ
          if (this.body[charaNum + i] === ' ') {
            this.trimmed.push(this.body.slice(charaNum, charaNum + i))
            charaNum += i + 1
            newlineFlag = true
          }
          // 文章の最後ならばendFlagをtrueにします
          if (this.body[charaNum + i] === undefined) {
            endFlag = true
            if (i !== 0) {
              this.trimmed.push(this.body.slice(charaNum, charaNum + i))
            }
            break
          }
        }
        // 終了判定をします
        if (endFlag) {
          break
        }
        // 改行がなければ1行に入る文字数分追加します
        if (!newlineFlag) {
          this.trimmed.push(this.body.slice(charaNum, charaNum + this.charaLen))
          charaNum += this.charaLen
        }
        // 現在の累積文字数がvuexに保存されている読み進めた文字数を越えたらページ数を算出
        if (!checked) {
          if (charaNum > nowCharaNum) {
            this.page = Math.floor(this.trimmed.length / this.lines)
            checked = true
          }
        }
      }
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
    setGuinness () {
      this.speed = 100
      this.$store.commit('data/changeSokudokuSpeed', this.speed)
    },
    goTopPage () {
      this.pause()
      this.resetHighlights()
      this.highlights[0].color = 'black'
      this.nowline = 0
      this.page = 0
    },
    pause () {
      clearInterval(this.intervalId)
      this.isPlay = false
    },
    resetHighlights () {
      for (let i = 0; i < this.lines; i++) {
        this.highlights[i].color = '#c9c8c7'
      }
    },
    play () {
      if (this.trimmed[this.page * this.lines + this.nowline + 1] === undefined) {
        clearInterval(this.intervalId)
        this.isPlay = false
      } else {
        this.highlights[this.nowline].color = 'black'
        this.isPlay = true
        this.intervalId = setInterval(() => {
          if (this.nowline < this.lines - 1) {
            this.resetHighlights()
            this.nowline++
            this.highlights[this.nowline].color = 'black'
            if (this.trimmed[this.page * this.lines + this.nowline + 1] === undefined) {
              clearInterval(this.intervalId)
              this.isPlay = false
            }
          } else {
            this.page++
            this.nowline = 0
            this.resetHighlights()
            this.highlights[0].color = 'black'
            if (this.trimmed[this.page * this.lines + this.nowline + 1] === undefined) {
              clearInterval(this.intervalId)
              this.isPlay = false
            }
          }
        }, this.charaLen * (17.91196 * Math.exp(-0.0201 * this.speed)))
      }
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

.vue-slider-process {
  background-color: #f18d1d;
}

.vue-slider-dot-handle {
  background-color: #f18d1d;
}

.guinness-button {
  padding: 4px 6px;
  border-radius: 4px;
  transition: all 0.3s;
  border: 1px solid #3362a8;
  background: white;
  color: #3362a8;
  box-shadow: 0 2px 3px #00000029;
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
  line-height: 2em;
  letter-spacing: 0.03em;
  display: inline-block;
}

.sokudoku-wrapper {
  display: flex;
  flex-flow: column;
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
