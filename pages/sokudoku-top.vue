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
            <div v-for="(bookList, index) in bookList" :key="bookList">
              <hr>
              <div class="column is-12" @click="selectBook(index)">
                <div class="columns is-mobile is-vcentered">
                  <div class="column is-1 has-text-weight-semibold has-text-centered" style="color: #f18d1d; transition: all 0.3s;">{{checkLetters[index]}}</div>
                  <div class="column is-11" :style="modalStyles[index]">{{bookList}}</div>
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
            <vue-slider @change="changeSpeed" style="width: 70%;" ref="slider" v-model="speed" :min=1 :max=100></vue-slider>
            <figure class="image" style="display: flex; align-items: center;">
              <Max style="width: 40px; height: 40px;"/>
            </figure>
          </div>
        </div>
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
      bookList: [],
      selectedTitle: undefined,
      modal_class: '',
      modalStyles: [],
      checkLetters: [],
      speed: 50,
      userId: '',
      fontsizes: {
        small: true,
        medium: false,
        large: false
      }
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
    this.bookList = this.$store.state.data.bookList.concat(this.$store.state.data.userBookList)
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
  methods: {
    changeSpeed () {
      this.$store.commit('data/changeSokudokuSpeed', this.speed)
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

hr {
  margin: 0;
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
