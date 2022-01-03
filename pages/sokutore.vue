<template>
  <div class="columns is-mobile is-centered" style="width: 100%; height: 80%; margin: 0;">
    <div class="column is-4-tablet is-11-mobile">
      <div class="columns is-mobile is-multiline is-centered is-vcentered">
        <div class="column is-12 wrapper-content mb-5 tategaki-wrapper">
          <div class="tategaki pt-3 pb-1" :class="fontsize">
            <div v-for="i in 3" :key="i" class="trimmed-wrapper">
              <span :style="highlightStyle[(i - 1) * 2]">{{firstLetter[page + (i - 1)]}}</span>
              <span>{{trimmed[page + (i - 1)]}}</span>
              <span :style="highlightStyle[(i - 1) * 2 + 1]">{{lastLetter[page + (i - 1)]}}</span>
            </div>
          </div>
          <div class="is-size-7 has-text-centered">{{(page / 3 + 1) +'/'+length}}</div>
        </div>
        <div class="column is-12 wrapper-content">
          <div class="columns is-mobile is-vcentered">
            <div class="column is-6 has-text-left"><span class="p-2 is-size-7" id="sokutore_button" @click="nextPage">&lt; 次へ</span></div>
            <div class="column is-6 has-text-right"><span class="p-2 is-size-7" id="sokutore_button" @click="goTopPage">最初に戻る >|</span></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'defaultContent',
  data () {
    return {
      bookTitle: '',
      body: '',
      trimmed: [],
      firstLetter: [],
      lastLetter: [],
      highlightStyle: [],
      intervalId: undefined,
      length: '',
      page: '',
      fontsize: '',
      speed: 50
    }
  },
  async mounted () {
    this.speed = this.$store.state.data.sokutoreSpeed/* スピードをvuexから取得します。 */
    /* 文字サイズを設定します。 */
    if (this.$store.state.data.fontsize === 'small') {
      this.fontsize = 'is-size-8-sokutore'
    } else if (this.$store.state.data.fontsize === 'medium') {
      this.fontsize = 'is-size-7-sokutore'
    } else {
      this.fontsize = 'is-size-6-sokutore'
    }
    const bookList = this.$store.state.data.bookList.concat(this.$store.state.data.userBookList)
    const bookContent = this.$store.state.data.bookContent.concat(this.$store.state.data.userBookContent)
    this.bookTitle = bookList[this.$store.state.data.bookIndex]
    this.body = bookContent[this.$store.state.data.bookIndex]
    this.$nuxt.$emit('updateRef', 'sokutore-top')/* navbarの戻るボタンの遷移先の受け渡し */
    this.$nuxt.$emit('updateTitle', this.bookTitle)/* navbarのタイトルの受け渡し */
    /* 本の中身を40文字ずつに分割します */
    for (let i = 0; i < this.body.length / 40; i++) {
      if (i === Math.floor(this.body.length / 40)) {
        this.firstLetter.push(this.body.charAt(i * 40))
        this.trimmed.push(this.body.slice(i * 40 + 1, this.body.length - 1))
        this.lastLetter.push(this.body.charAt(this.body.length - 1))
      } else {
        this.firstLetter.push(this.body.charAt(i * 40))
        this.trimmed.push(this.body.slice(i * 40 + 1, (i + 1) * 40 - 1))
        this.lastLetter.push(this.body.charAt((i + 1) * 40 - 1))
      }
    }
    /* 全ページ数と現在ページの表示を設定します。 */
    this.page = this.$store.state.data.bookPages[this.$store.state.data.bookIndex][1]
    this.length = Math.ceil(this.trimmed.length / 3)
    /* 最初のページのハイライト表示を開始します。 */
    this.highlight()
  },
  destroyed () {
    clearInterval(this.intervalId)
  },
  methods: {
    nextPage () {
      if (this.$store.state.data.bookPages[this.$store.state.data.bookIndex][1] / 3 < this.length - 1) {
        this.$store.commit('data/changePage', 1)
        this.page = this.$store.state.data.bookPages[this.$store.state.data.bookIndex][1]
        this.highlight()
      }
    },
    goTopPage () {
      clearInterval(this.intervalId)
      this.isPlay = false
      this.$store.commit('data/goTopPage', 1)
      this.page = this.$store.state.data.bookPages[this.$store.state.data.bookIndex][1]
      this.highlight()
    },
    highlight () {
      /* ハイライトの初期表示を設定します。 */
      let n = 0
      let limit = 0
      this.highlightStyle = []
      clearInterval(this.intervalId)
      for (let i = 0; i < 3; i++) {
        if (this.firstLetter[this.page + i] !== undefined) {
          limit += 2
        } else {
          break
        }
      }
      for (let i = 0; i < limit; i++) {
        this.highlightStyle.push({ background: 'none' })
      }
      this.highlightStyle[0].background = 'yellow'
      /* ハイライトの移動処理を開始します。 */
      this.intervalId = setInterval(() => {
        if (n < limit - 1) {
          for (let i = 0; i < limit; i++) {
            if (i === n + 1) {
              this.highlightStyle[i].background = 'yellow'
            } else {
              this.highlightStyle[i].background = 'none'
            }
          }
          n++
        }
      }, -100 * this.speed + 10100)
    }
  }
}
</script>

<style>
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
  letter-spacing: 0.3em;
  display: flex;
  flex-flow: column;
}

.trimmed-wrapper span {
  padding: 0.3em;
}

.trimmed-wrapper span:nth-child(1) {
  z-index: 1;
  text-align: center;
  border-radius: 50%;
  letter-spacing: 0;
}

.trimmed-wrapper span:nth-child(2) {
  z-index: 2;
  margin-top: -0.9em;
  margin-bottom: -1.2em;
}

.trimmed-wrapper span:nth-child(3) {
  z-index: 1;
  text-align: center;
  border-radius: 50%;
  letter-spacing: 0;
}

.wrapper-content {
  border-radius: 4px;
  background: white;
}

#sokutore_button {
  border: 0.5px solid #3362a8;
  color: #3362a8;
  border-radius: 8px;
}

.is-size-8-sokutore {
  font-size: 0.5em;
  line-height: 6em;
}

.is-size-7-sokutore {
  font-size: 0.5em;
  line-height: 6em;
}

.is-size-6-sokutore {
  font-size: 0.5em;
  line-height: 6em;
}
</style>
