<template>
  <div class="columns is-mobile is-centered" style="width: 100%; margin: 0;">
    <div class="column is-4-tablet is-11-mobile wrapper-top">
      <div class="columns is-mobile is-multiline is-vcentered">
        <div class="column is-12 mt-5">
          <div class="columns is-vcentered is-mobile">
            <div class="column is-6 has-text-weight-semibold" style="color: #404a72;">教材</div>
            <div class="column is-6 is-size-7 has-text-right"><span @click="goBookList" style="color: #a2a1a0;">一覧・編集&emsp;&gt;</span></div>
          </div>
        </div>
        <div class="column is-12">
          <div class="columns is-centered is-mobile">
            <button class="select-button" @click="onSelectModal">{{ selectedTitle }}</button>
          </div>
        </div>
        <div class="modal" id="modal" v-bind:class="modal_class">
          <div class="modal-background" id="modal-background"></div>
          <div class="modal-content has-background-white" id="modal-content-top" style="border-radius: 8px;">
            <div class="column is-12">
              <div class="columns is-mobile is-vcentered" id="modalnav">
                <div class="column is-2"></div>
                <div class="column is-8 has-text-weight-semibold has-text-centered" style="color: #404a72;">教材選択</div>
                <div class="column is-2 has-text-weight-semibold has-text-right" style="font-size: 1.5em; color: #404a72;"><span @click="onSelectModal" id="close">×</span></div>
              </div>
            </div>
            <div class="column is-12"><input type="text" v-model="searchWord" placeholder="教材を検索"></div>
            <hr style="margin: 0;">
            <div style="max-height: 328px; overflow-x: scroll;">
              <div v-for="(bookidtitle, index) in bookList" :key="bookidtitle" style="cursor: pointer;">
                <hr v-if="index != 0" style="margin: 0;">
                <div class="column is-12" @click="selectBook(index)">
                  <div class="columns is-mobile is-vcentered">
                    <div class="column is-1 has-text-weight-semibold has-text-centered" style="color: #f18d1d; transition: all 0.3s;">{{checkLetters[index]}}</div>
                    <div class="column is-11" :style="modalStyles[index]">{{bookidtitle}}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="column is-12 has-text-weight-semibold mt-2" style="color: #404a72;">速度</div>
        <div class="column is-12">
          <div class="columns is-centered is-vcentered is-mobile">
            <figure class="image" style="display: flex; align-items: center;">
              <Min style="width: 40px; height: 40px;"/>
            </figure>
            <vue-slider style="width: 70%;" ref="slider" v-model="speed" :min=1 :max=100></vue-slider>
            <figure class="image" style="display: flex; align-items: center;">
              <Max style="width: 40px; height: 40px;"/>
            </figure>
            <button class="guinness-button is-size-7" style="cursor: pointer;" @click="setGuinness">ギネス</button>
          </div>
        </div>
        <div class="column is-12 is-size-7 has-text-centered" style="padding-bottom: 0; color: #404a72;">{{displaySpeed}}文字/分</div>
        <div class="column is-12 has-text-weight-semibold mt-3" style="color: #404a72;">文字サイズ</div>
        <div class="column is-12 mt-2">
          <div class="columns is-centered is-mobile">
            <template v-for="(item, key) in fontsizes">
              <FontSizeButton @click.native="changeFontsize(key)" :size="key" :isSelected="item" v-bind:key="item.key" />
              <div v-if="key !== 'large'" class="column is-2" v-bind:key="item.key" ></div>
            </template>
          </div>
        </div>
        <div class="column is-12 mt-6 mb-6">
          <div class="columns is-centered is-mobile">
            <button class="button has-text-white start-button" @click="startSokutore">スタート</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Min from 'assets/Accessory_speed_low.svg'
import Max from 'assets/Accessory_speed_max.svg'
import FontSizeButton from '~/components/FontSizeButton.vue'
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'

export default {
  layout: 'defaultTop',
  data () {
    return {
      bookBaseList: [],
      bookList: [],
      selectedTitle: undefined,
      selectedId: undefined,
      modal_class: '',
      modalStyles: [],
      checkLetters: [],
      searchWord: '',
      speed: 50,
      userId: '',
      fontsizes: {
        small: true,
        medium: false,
        large: false
      }
    }
  },
  computed: {
    displaySpeed: function () {
      // return Math.floor(60000 / (-3.28 * Math.log(this.speed) + 17.50495821))
      return Math.floor(6000 / (17.91196 * Math.exp(-0.0201 * this.speed))) * 10
    }
  },
  watch: {
    searchWord: function (newVal, oldVal) {
      this.searchBook()
    }
  },
  components: {
    Min,
    Max,
    FontSizeButton,
    VueSlider
  },
  async mounted () {
    this.checkFontsize(this.$store.state.data.fontsize)
    // this.$store.commit('data/tmp')/* 保存しているページ数をリセットします。 */
    this.bookBaseList = this.$store.state.data.bookList.concat(this.$store.state.data.userBookList)
    this.bookList = this.bookBaseList
    this.speed = this.$store.state.data.sokudokuSpeed/* スピードをvuexから取得します。 */
    this.$nuxt.$emit('updateTitle', '速読')/* navbarのタイトルの受け渡し */
    /* これはモーダルのデザインを設定する処理 */
    for (let i = 0; i < this.bookList.length; i++) {
      this.modalStyles.push({
        color: '#404a72',
        transition: 'all 0.3s'
      })
      this.checkLetters.push('')
    }
    this.selectBook(this.$store.state.data.bookIndex)
  },
  destroyed () {
    this.$store.commit('data/changeSokudokuSpeed', this.speed)
  },
  methods: {
    setGuinness () {
      this.speed = 100
    },
    changeFontsize (fontsize) {
      this.$store.commit('data/changeFontsize', fontsize)
      this.checkFontsize(fontsize)
    },
    checkFontsize (fontsize) {
      for (const [key] of Object.entries(this.fontsizes)) {
        if (key === fontsize) {
          this.fontsizes[key] = true
        } else {
          this.fontsizes[key] = false
        }
      }
    },
    startSokutore () {
      this.$router.push('sokudoku')
    },
    goBookList () {
      this.$router.push('booklist')
      this.$store.commit('data/changeIndetifier', 'sokudoku-top')
    },
    onSelectModal () {
      if (this.modal_class === 'is-active') {
        this.modal_class = ''
      } else {
        this.modal_class = 'is-active'
      }
    },
    selectBook (index) {
      this.$store.commit('data/changeBookIndex', index)
      for (let i = 0; i < this.bookList.length; i++) {
        if (i === index) {
          this.checkLetters[i] = '✓'
          this.modalStyles[i].color = '#f18d1d'
          this.selectedTitle = this.bookList[i]
        } else {
          this.checkLetters[i] = ''
          this.modalStyles[i].color = '#404a72'
        }
      }
    },
    searchBook () {
      this.bookList = []
      this.checkLetters = []
      this.modalStyles = []
      if (this.searchWord !== '') {
        for (let i = 0; i < this.bookBaseList.length; i++) {
          const title = this.bookBaseList[i]
          const searchword = this.searchWord
          if (title.indexOf(searchword) !== -1) {
            this.bookList.push(this.bookBaseList[i])
            this.modalStyles.push({
              color: '#404a72',
              transition: 'all 0.3s'
            })
            this.checkLetters.push('')
          }
        }
        for (let i = 0; i < this.bookList.length; i++) {
          if (this.bookList[i] === this.selectedTitle) {
            this.checkLetters[i] = '✓'
            this.modalStyles[i].color = '#f18d1d'
          } else {
            this.checkLetters[i] = ''
            this.modalStyles[i].color = '#404a72'
          }
        }
      } else {
        this.bookList = this.bookBaseList
        for (let i = 0; i < this.bookBaseList.length; i++) {
          this.modalStyles.push({
            color: '#404a72',
            transition: 'all 0.3s'
          })
          this.checkLetters.push('')
        }
        for (let i = 0; i < this.bookList.length; i++) {
          if (this.bookList[i] === this.selectedTitle) {
            this.checkLetters[i] = '✓'
            this.modalStyles[i].color = '#f18d1d'
          } else {
            this.checkLetters[i] = ''
            this.modalStyles[i].color = '#404a72'
          }
        }
      }
    }
  }
}
</script>

<style>
input {
  width: 100%;
  border: 1px solid #dbdbdb;
  border-radius: 4px;
  padding: 6px;
}

input::placeholder {
  color: #dbdbdb;
}

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

.select-button {
  margin: 12px;
  width: 100%;
  height: 40px;
  border-radius: 8px;
  font-size: 1em;
  padding: 7px 16px;
  transition: all 0.3;
  border: none;
  background: white;
  display: flex;
  justify-content: space-between;
  vertical-align: center;
}

.select-button::after {
  content: '';
  width: 8px;
  height: 8px;
  border-bottom: solid 2px #404a72;
  border-right: solid 2px #404a72;
  -ms-transform: rotate(45deg);
  -webkit-transform: rotate(45deg);
  transform: rotate(45deg);
  margin: auto 0;
}

.select-button:hover {
  cursor: pointer;
}

.start-button {
  width: 80%;
  height: 40px;
  border-radius: 8px;
  border: none;
  background: #f18d1d;
}

.size-button:hover {
  cursor: pointer;
}

#close:hover {
  cursor: pointer;
}

#modal-content-top {
  width: 90%;
}

.modal_class {
  transition: all 0.5;
}

@media screen and (min-width: 769px) {
  .wrapper-top {
    background: white;
  }

  .select-button {
    border: 0.5px solid #c9c8c7;
  }

  #modal-content-top {
    width: 50%;
  }
}
</style>
