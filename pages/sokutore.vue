<template>
  <div class="columns is-mobile is-centered" style="width: 100%; height: 97%; margin: 0;">
    <div class="column is-4-tablet is-11-mobile">
      <div class="columns is-mobile is-multiline is-centered is-vcentered">
        <div class="column is-12 wrapper-content mb-3 tategaki-wrapper">
          <div class="sokutore-wrapper tategaki pt-3 pb-1" :class="fontsize" :style="height">
            <template v-if="highlightVer == '1列ハイライト'">
              <div class="trimmed-wrapper" v-for="i in lines" :key="i" style="cursor: default;" :style="width">
                <span :key="String(page)+String(i)+'first'" :style="highlightStyle1[i - 1]">{{highlightChara1[page * lines + i - 1]}}</span>
                <span :key="String(page)+String(i)+'text1'">{{trimmed1[page * lines + i - 1]}}</span>
                <span :key="String(page)+String(i)+'last'" :style="highlightStyle2[i - 1]" :class="lastSpace[i - 1]">{{highlightChara2[page * lines + i - 1]}}</span>
              </div>
            </template>
            <template v-else>
              <div class="trimmed-wrapper" v-for="i in lines" :key="i" style="cursor: default;" :style="width">
                <span :key="String(page)+String(i)+'text1'">{{trimmed1[page * lines + i - 1]}}</span>
                <span :key="String(page)+String(i)+'first'" :style="highlightStyle1[i - 1]">{{highlightChara1[page * lines + i - 1]}}</span>
                <span :key="String(page)+String(i)+'text2'">{{trimmed2[page * lines + i - 1]}}</span>
                <span :key="String(page)+String(i)+'last'" :style="highlightStyle2[i - 1]">{{highlightChara2[page * lines + i - 1]}}</span>
                <span :key="String(page)+String(i)+'text3'">{{trimmed3[page * lines + i - 1]}}</span>
                <span :key="String(page)+String(i)+'last'" :style="highlightStyle3[i - 1]">{{highlightChara3[page * lines + i - 1]}}</span>
                <span :key="String(page)+String(i)+'text4'">{{trimmed4[page * lines + i - 1]}}</span>
              </div>
            </template>
          </div>
          <div class="is-size-7 has-text-centered">{{(page + 1) +'/'+length}}</div>
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
      trimmed1: [],
      trimmed2: [],
      trimmed3: [],
      trimmed4: [],
      highlightChara1: [],
      highlightChara2: [],
      highlightChara3: [],
      highlightStyle1: [],
      highlightStyle2: [],
      highlightStyle3: [],
      lastSpace: [],
      width: {},
      page: 0,
      length: 0,
      charaLeftSum: 0,
      intervalId: undefined,
      fontsize: '',
      charaLen: 0,
      lines: 0,
      nowline: 0,
      speed: 50
    }
  },
  computed: {
    highlightVer: function () {
      return this.$store.state.data.highlightStyle
    },
    displayTrimmed: function (i) {
      return this.trimmed[this.page * this.lines + i - 1]
    },
    tategakiHeight: function () {
      if (window.innerWidth > 768) {
        return 0.97 * (window.innerHeight - 58) - 132
      } else {
        return 0.97 * (window.innerHeight - 80) - 108
      }
    },
    height: function () {
      return `height: ${this.tategakiHeight}px;`
    }
  },
  async mounted () {
    this.speed = this.$store.state.data.sokutoreSpeed/* スピードをvuexから取得します。 */
    /* 文字サイズを設定します。 */
    if (this.$store.state.data.fontsize === 'small') {
      this.fontsize = 'is-size-7'
      this.width.width = '24px'
      this.lines = window.innerWidth < 769 ? Math.floor(window.innerWidth * 0.03803) : Math.floor(window.innerWidth * 0.01341)
    } else if (this.$store.state.data.fontsize === 'medium') {
      this.fontsize = 'is-size-6'
      this.width.width = '32px'
      this.lines = window.innerWidth < 769 ? Math.floor(window.innerWidth * 0.02679) : Math.floor(window.innerWidth * 0.009 + 1)
    } else {
      this.fontsize = 'is-size-5'
      this.width.width = '40px'
      this.lines = window.innerWidth < 769 ? Math.floor(window.innerWidth * 0.02232) : Math.floor(window.innerWidth * 0.00746)
    }
    const bookList = this.$store.state.data.bookList.concat(this.$store.state.data.userBookList)
    const bookContent = this.$store.state.data.bookContent.concat(this.$store.state.data.userBookContent)
    this.bookTitle = bookList[this.$store.state.data.bookIndex]
    this.body = bookContent[this.$store.state.data.bookIndex]
    this.$nuxt.$emit('updateRef', 'sokutore-top')/* navbarの戻るボタンの遷移先の受け渡し */
    this.$nuxt.$emit('updateTitle', this.bookTitle)/* navbarのタイトルの受け渡し */
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
    this.length = Math.floor((this.trimmed1.length / this.lines) + 1)
    /* 最初のページのハイライト表示を開始します。 */
    this.highlight()
  },
  destroyed () {
    clearInterval(this.intervalId)
    let charaLeftSumTmp = 0
    if (this.highlightVer === '1列ハイライト') {
      for (let i = 0; i < this.page * this.lines; i++) {
        if (this.trimmed1[i].length < this.charaLen - 2) {
          charaLeftSumTmp += this.charaLen - this.highlightChara1[i].length - this.trimmed1[i].length - this.highlightChara2[i].length - 1
        }
      }
    } else if (this.highlightVer === '1列2分割ハイライト') {
      for (let i = 0; i < this.page * this.lines; i++) {
        if (this.trimmed1[i].length + this.trimmed2[i].length + this.trimmed3[i].length < this.charaLen - 2) {
          charaLeftSumTmp += this.charaLen - this.trimmed1[i].length - this.highlightChara1[i].length - this.trimmed2[i].length - this.highlightChara2[i].length - this.trimmed3[i].length - 1
        }
      }
    } else {
      for (let i = 0; i < this.page * this.lines; i++) {
        if (this.trimmed1[i].length + this.trimmed2[i].length + this.trimmed3[i].length + this.trimmed4[i].length < this.charaLen - 3) {
          charaLeftSumTmp += this.charaLen - this.trimmed1[i].length - this.highlightChara1[i].length - this.trimmed2[i].length - this.highlightChara2[i].length - this.trimmed3[i].length - this.highlightChara3[i].length - this.trimmed4[i].length - 1
        }
      }
    }
    this.$store.commit('data/changePage', [1, this.page * this.lines * this.charaLen - charaLeftSumTmp])
  },
  methods: {
    bodySlice () {
      const nowCharaNum = this.$store.state.data.charaIndexs[this.$store.state.data.bookIndex][1]
      let charaNum = 0
      let endFlag = false
      let newlineFlag = false
      let checked = false
      if (this.highlightVer === '1列ハイライト') {
        while (true) {
          newlineFlag = false
          // 1行の文字数分先の間に改行がないかと文章の最後の文字がないかをチェックします
          for (let i = 0; i < this.charaLen; i++) {
            // 改行があれば次の行へ
            if (this.body[charaNum + i] === ' ') {
              if (i === 0) {
                this.highlightChara1.push('')
                this.trimmed1.push('')
                this.highlightChara2.push('')
              } else if (i === 1) {
                this.highlightChara1.push(this.body[charaNum])
                this.trimmed1.push('')
                this.highlightChara2.push('')
              } else if (i === 2) {
                this.highlightChara1.push(this.body[charaNum])
                this.trimmed1.push('')
                this.highlightChara2.push(this.body[charaNum + 1])
              } else if (i > 2) {
                this.highlightChara1.push(this.body[charaNum])
                this.trimmed1.push(this.body.slice(charaNum + 1, charaNum + i - 1))
                this.highlightChara2.push(this.body[charaNum + i - 1])
              }
              charaNum += i + 1
              newlineFlag = true
              this.charaLeftSum += this.charaLen - i
              break
            }
            // 文章の最後ならばendFlagをtrueにします
            if (this.body[charaNum + i] === undefined) {
              endFlag = true
              if (i !== 0) {
                if (i === 1) {
                  this.highlightChara1.push(this.body[charaNum])
                  this.trimmed1.push('')
                  this.highlightChara2.push('')
                } else if (i === 2) {
                  this.highlightChara1.push(this.body[charaNum])
                  this.trimmed1.push('')
                  this.highlightChara2.push(this.body[charaNum + 1])
                } else {
                  this.highlightChara1.push(this.body[charaNum])
                  this.trimmed1.push(this.body.slice(charaNum + 1, charaNum + i - 1))
                  this.highlightChara2.push(this.body[charaNum + i - 1])
                }
              }
              break
            }
          }
          // 終了判定をします
          if (endFlag) {
            break
          }
          // 改行がなければ1行の文字数分追加します
          if (!newlineFlag) {
            this.highlightChara1.push(this.body[charaNum])
            this.trimmed1.push(this.body.slice(charaNum + 1, charaNum + this.charaLen - 1))
            this.highlightChara2.push(this.body[charaNum + this.charaLen - 1])
            charaNum += this.charaLen
          }
          // 現在の累積文字数がvuexに保存されている読み進めた文字数を越えたらページ数を算出
          if (!checked) {
            if (charaNum > nowCharaNum) {
              this.page = Math.floor(this.trimmed1.length / this.lines)
              checked = true
            }
          }
        }
      } else if (this.highlightVer === '1列2分割ハイライト') {
        const highlightPoint1 = Math.floor(this.charaLen * 0.25)
        const medium = Math.floor(this.charaLen * 0.5)
        const highlightPoint2 = Math.floor(this.charaLen * 0.75)
        while (true) {
          newlineFlag = false
          // 1行の文字数分先の間に改行がないかと文章の最後の文字がないかをチェックします
          for (let i = 0; i < this.charaLen; i++) {
            // 改行があれば次の行へ
            if (this.body[charaNum + i] === ' ') {
              if (i === 0) {
                this.trimmed1.push('')
                this.highlightChara1.push('')
                this.trimmed2.push('')
                this.highlightChara2.push('')
                this.trimmed3.push('')
              } else if (i <= highlightPoint1 + 1) {
                this.trimmed1.push(this.body.slice(charaNum, charaNum + i - 1))
                this.highlightChara1.push(this.body[charaNum + i - 1])
                this.trimmed2.push('')
                this.highlightChara2.push('')
                this.trimmed3.push('')
              } else if (i < medium) {
                this.trimmed1.push(this.body.slice(charaNum, charaNum + highlightPoint1))
                this.highlightChara1.push(this.body[charaNum + highlightPoint1])
                this.trimmed2.push(this.body.slice(charaNum + highlightPoint1 + 1, charaNum + i))
                this.highlightChara2.push('')
                this.trimmed3.push('')
              } else if (i <= highlightPoint2 + 1) {
                this.trimmed1.push(this.body.slice(charaNum, charaNum + highlightPoint1))
                this.highlightChara1.push(this.body[charaNum + highlightPoint1])
                this.trimmed2.push(this.body.slice(charaNum + highlightPoint1 + 1, charaNum + i - 1))
                this.highlightChara2.push(this.body[charaNum + i - 1])
                this.trimmed3.push('')
              } else {
                this.trimmed1.push(this.body.slice(charaNum, charaNum + highlightPoint1))
                this.highlightChara1.push(this.body[charaNum + highlightPoint1])
                this.trimmed2.push(this.body.slice(charaNum + highlightPoint1 + 1, charaNum + highlightPoint2))
                this.highlightChara2.push(this.body[charaNum + highlightPoint2])
                this.trimmed3.push(this.body.slice(charaNum + highlightPoint2 + 1, charaNum + i))
              }
              charaNum += i + 1
              newlineFlag = true
              this.charaLeftSum += this.charaLen - i
              break
            }
            // 文章の最後ならばendFlagをtrueにします
            if (this.body[charaNum + i] === undefined) {
              endFlag = true
              if (i !== 0) {
                if (i <= highlightPoint1 + 1) {
                  this.trimmed1.push(this.body.slice(charaNum, charaNum + i - 1))
                  this.highlightChara1.push(this.body[charaNum + i - 1])
                  this.trimmed2.push('')
                  this.highlightChara2.push('')
                  this.trimmed3.push('')
                } else if (i < medium) {
                  this.trimmed1.push(this.body.slice(charaNum, charaNum + highlightPoint1))
                  this.highlightChara1.push(this.body[charaNum + highlightPoint1])
                  this.trimmed2.push(this.body.slice(charaNum + highlightPoint1 + 1, charaNum + i))
                  this.highlightChara2.push('')
                  this.trimmed3.push('')
                } else if (i <= highlightPoint2 + 1) {
                  this.trimmed1.push(this.body.slice(charaNum, charaNum + highlightPoint1))
                  this.highlightChara1.push(this.body[charaNum + highlightPoint1])
                  this.trimmed2.push(this.body.slice(charaNum + highlightPoint1 + 1, charaNum + i - 1))
                  this.highlightChara2.push(this.body[charaNum + i - 1])
                  this.trimmed3.push('')
                } else {
                  this.trimmed1.push(this.body.slice(charaNum, charaNum + highlightPoint1))
                  this.highlightChara1.push(this.body[charaNum + highlightPoint1])
                  this.trimmed2.push(this.body.slice(charaNum + highlightPoint1 + 1, charaNum + highlightPoint2))
                  this.highlightChara2.push(this.body[charaNum + highlightPoint2])
                  this.trimmed3.push(this.body.slice(charaNum + highlightPoint2 + 1, charaNum + i))
                }
              }
              break
            }
          }
          // 終了判定をします
          if (endFlag) {
            break
          }
          // 改行がなければ1行の文字数分追加します
          if (!newlineFlag) {
            this.trimmed1.push(this.body.slice(charaNum, charaNum + highlightPoint1))
            this.highlightChara1.push(this.body[charaNum + highlightPoint1])
            this.trimmed2.push(this.body.slice(charaNum + highlightPoint1 + 1, charaNum + highlightPoint2))
            this.highlightChara2.push(this.body[charaNum + highlightPoint2])
            this.trimmed3.push(this.body.slice(charaNum + highlightPoint2 + 1, charaNum + this.charaLen))
            charaNum += this.charaLen
          }
          // 現在の累積文字数がvuexに保存されている読み進めた文字数を越えたらページ数を算出
          if (!checked) {
            if (charaNum > nowCharaNum) {
              this.page = Math.floor(this.trimmed1.length / this.lines)
              checked = true
            }
          }
        }
      } else {
        const highlightPoint1 = Math.floor(this.charaLen * 0.167)
        const medium1 = Math.floor(this.charaLen * 0.333)
        const highlightPoint2 = Math.floor(this.charaLen * 0.5)
        const medium2 = Math.floor(this.charaLen * 0.667)
        const highlightPoint3 = Math.floor(this.charaLen * 0.833)
        while (true) {
          newlineFlag = false
          // 1行の文字数分先の間に改行がないかと文章の最後の文字がないかをチェックします
          for (let i = 0; i < this.charaLen; i++) {
            // 改行があれば次の行へ
            if (this.body[charaNum + i] === ' ') {
              if (i === 0) {
                this.trimmed1.push('')
                this.highlightChara1.push('')
                this.trimmed2.push('')
                this.highlightChara2.push('')
                this.trimmed3.push('')
                this.highlightChara3.push('')
                this.trimmed4.push('')
              } else if (i <= highlightPoint1 + 1) {
                this.trimmed1.push(this.body.slice(charaNum, charaNum + i - 1))
                this.highlightChara1.push(this.body[charaNum + i - 1])
                this.trimmed2.push('')
                this.highlightChara2.push('')
                this.trimmed3.push('')
                this.highlightChara3.push('')
                this.trimmed4.push('')
              } else if (i < medium1) {
                this.trimmed1.push(this.body.slice(charaNum, charaNum + highlightPoint1))
                this.highlightChara1.push(this.body[charaNum + highlightPoint1])
                this.trimmed2.push(this.body.slice(charaNum + highlightPoint1 + 1, charaNum + i))
                this.highlightChara2.push('')
                this.trimmed3.push('')
                this.highlightChara3.push('')
                this.trimmed4.push('')
              } else if (i <= highlightPoint2 + 1) {
                this.trimmed1.push(this.body.slice(charaNum, charaNum + highlightPoint1))
                this.highlightChara1.push(this.body[charaNum + highlightPoint1])
                this.trimmed2.push(this.body.slice(charaNum + highlightPoint1 + 1, charaNum + i - 1))
                this.highlightChara2.push(this.body[charaNum + i - 1])
                this.trimmed3.push('')
                this.highlightChara3.push('')
                this.trimmed4.push('')
              } else if (i < medium2) {
                this.trimmed1.push(this.body.slice(charaNum, charaNum + highlightPoint1))
                this.highlightChara1.push(this.body[charaNum + highlightPoint1])
                this.trimmed2.push(this.body.slice(charaNum + highlightPoint1 + 1, charaNum + highlightPoint2))
                this.highlightChara2.push(this.body[charaNum + highlightPoint2])
                this.trimmed3.push(this.body.slice(charaNum + highlightPoint2 + 1, charaNum + i))
                this.highlightChara3.push('')
                this.trimmed4.push('')
              } else if (i <= highlightPoint3 + 1) {
                this.trimmed1.push(this.body.slice(charaNum, charaNum + highlightPoint1))
                this.highlightChara1.push(this.body[charaNum + highlightPoint1])
                this.trimmed2.push(this.body.slice(charaNum + highlightPoint1 + 1, charaNum + highlightPoint2))
                this.highlightChara2.push(this.body[charaNum + highlightPoint2])
                this.trimmed3.push(this.body.slice(charaNum + highlightPoint2 + 1, charaNum + i - 1))
                this.highlightChara3.push(this.body[charaNum + i - 1])
                this.trimmed4.push('')
              } else {
                this.trimmed1.push(this.body.slice(charaNum, charaNum + highlightPoint1))
                this.highlightChara1.push(this.body[charaNum + highlightPoint1])
                this.trimmed2.push(this.body.slice(charaNum + highlightPoint1 + 1, charaNum + highlightPoint2))
                this.highlightChara2.push(this.body[charaNum + highlightPoint2])
                this.trimmed3.push(this.body.slice(charaNum + highlightPoint2 + 1, charaNum + highlightPoint3))
                this.highlightChara3.push(this.body[charaNum + highlightPoint3])
                this.trimmed4.push(this.body.slice(charaNum + highlightPoint3 + 1, charaNum + i))
              }
              charaNum += i + 1
              newlineFlag = true
              this.charaLeftSum += this.charaLen - i
              break
            }
            // 文章の最後ならばendFlagをtrueにします
            if (this.body[charaNum + i] === undefined) {
              endFlag = true
              if (i !== 0) {
                if (i <= highlightPoint1 + 1) {
                  this.trimmed1.push(this.body.slice(charaNum, charaNum + i - 1))
                  this.highlightChara1.push(this.body[charaNum + i - 1])
                  this.trimmed2.push('')
                  this.highlightChara2.push('')
                  this.trimmed3.push('')
                  this.highlightChara3.push('')
                  this.trimmed4.push('')
                } else if (i < medium1) {
                  this.trimmed1.push(this.body.slice(charaNum, charaNum + highlightPoint1))
                  this.highlightChara1.push(this.body[charaNum + highlightPoint1])
                  this.trimmed2.push(this.body.slice(charaNum + highlightPoint1 + 1, charaNum + i))
                  this.highlightChara2.push('')
                  this.trimmed3.push('')
                  this.highlightChara3.push('')
                  this.trimmed4.push('')
                } else if (i <= highlightPoint2 + 1) {
                  this.trimmed1.push(this.body.slice(charaNum, charaNum + highlightPoint1))
                  this.highlightChara1.push(this.body[charaNum + highlightPoint1])
                  this.trimmed2.push(this.body.slice(charaNum + highlightPoint1 + 1, charaNum + i - 1))
                  this.highlightChara2.push(this.body[charaNum + i - 1])
                  this.trimmed3.push('')
                  this.highlightChara3.push('')
                  this.trimmed4.push('')
                } else if (i < medium2) {
                  this.trimmed1.push(this.body.slice(charaNum, charaNum + highlightPoint1))
                  this.highlightChara1.push(this.body[charaNum + highlightPoint1])
                  this.trimmed2.push(this.body.slice(charaNum + highlightPoint1 + 1, charaNum + highlightPoint2))
                  this.highlightChara2.push(this.body[charaNum + highlightPoint2])
                  this.trimmed3.push(this.body.slice(charaNum + highlightPoint2 + 1, charaNum + i))
                  this.highlightChara3.push('')
                  this.trimmed4.push('')
                } else if (i <= highlightPoint3 + 1) {
                  this.trimmed1.push(this.body.slice(charaNum, charaNum + highlightPoint1))
                  this.highlightChara1.push(this.body[charaNum + highlightPoint1])
                  this.trimmed2.push(this.body.slice(charaNum + highlightPoint1 + 1, charaNum + highlightPoint2))
                  this.highlightChara2.push(this.body[charaNum + highlightPoint2])
                  this.trimmed3.push(this.body.slice(charaNum + highlightPoint2 + 1, charaNum + i - 1))
                  this.highlightChara3.push(this.body[charaNum + i - 1])
                  this.trimmed4.push('')
                } else {
                  this.trimmed1.push(this.body.slice(charaNum, charaNum + highlightPoint1))
                  this.highlightChara1.push(this.body[charaNum + highlightPoint1])
                  this.trimmed2.push(this.body.slice(charaNum + highlightPoint1 + 1, charaNum + highlightPoint2))
                  this.highlightChara2.push(this.body[charaNum + highlightPoint2])
                  this.trimmed3.push(this.body.slice(charaNum + highlightPoint2 + 1, charaNum + highlightPoint3))
                  this.highlightChara3.push(this.body[charaNum + highlightPoint3])
                  this.trimmed4.push(this.body.slice(charaNum + highlightPoint3 + 1, charaNum + i))
                }
              }
              break
            }
          }
          // 終了判定をします
          if (endFlag) {
            break
          }
          // 改行がなければ1行の文字数分追加します
          if (!newlineFlag) {
            this.trimmed1.push(this.body.slice(charaNum, charaNum + highlightPoint1))
            this.highlightChara1.push(this.body[charaNum + highlightPoint1])
            this.trimmed2.push(this.body.slice(charaNum + highlightPoint1 + 1, charaNum + highlightPoint2))
            this.highlightChara2.push(this.body[charaNum + highlightPoint2])
            this.trimmed3.push(this.body.slice(charaNum + highlightPoint2 + 1, charaNum + highlightPoint3))
            this.highlightChara3.push(this.body[charaNum + highlightPoint3])
            this.trimmed4.push(this.body.slice(charaNum + highlightPoint3 + 1, charaNum + this.charaLen))
            charaNum += this.charaLen
          }
          // 現在の累積文字数がvuexに保存されている読み進めた文字数を越えたらページ数を算出
          if (!checked) {
            if (charaNum > nowCharaNum) {
              this.page = Math.floor(this.trimmed1.length / this.lines)
              checked = true
            }
          }
        }
      }
    },
    nextPage () {
      if (this.page + 1 < this.length) {
        clearInterval(this.intervalId)
        this.page++
        this.highlight()
      }
    },
    goTopPage () {
      clearInterval(this.intervalId)
      this.page = 0
      this.highlight()
    },
    highlight () {
      /* ハイライトの初期表示を設定します。 */
      let n = 0
      let fromFirstIndex = 0
      this.highlightStyle1 = []
      this.highlightStyle2 = []
      this.highlightStyle3 = []
      let hasNext = false
      let endFlag = false
      for (let i = 0; i < this.lines; i++) {
        this.highlightStyle1.push({ background: 'none' })
        this.highlightStyle2.push({ background: 'none' })
        this.highlightStyle3.push({ background: 'none' })
      }
      if (this.highlightChara1[this.page * this.lines] !== '') {
        this.highlightStyle1[0].background = 'yellow'
      } else {
        hasNext = false
        for (let i = 1; i < this.lines - 1; i++) {
          if (this.highlightChara1[this.page * this.lines + i] !== '') {
            n += i
            this.highlightStyle1[n].background = 'yellow'
            hasNext = true
            break
          }
        }
        if (!hasNext) {
          endFlag = true
        }
      }
      if (this.highlightVer === '1列3分割ハイライト') {
        /* ハイライトの移動処理を開始します。 */
        this.intervalId = setInterval(() => {
          endFlag = false
          if (n < this.lines) {
            if (fromFirstIndex === 0) {
              if (this.highlightChara2[this.page * this.lines + n] !== '') {
                if (this.highlightChara2[this.page * this.lines + n] === undefined) {
                  endFlag = true
                } else {
                  fromFirstIndex++
                }
              } else {
                hasNext = false
                for (let i = 1; i < this.lines - n; i++) {
                  if (this.highlightChara1[this.page * this.lines + n + i] !== '') {
                    n += i
                    hasNext = true
                    break
                  }
                }
                if (!hasNext) {
                  endFlag = true
                }
              }
            } else if (fromFirstIndex === 1) {
              if (this.highlightChara3[this.page * this.lines + n] !== '') {
                if (this.highlightChara3[this.page * this.lines + n] === undefined) {
                  endFlag = true
                } else {
                  fromFirstIndex++
                }
              } else {
                hasNext = false
                for (let i = 1; i < this.lines - n; i++) {
                  if (this.highlightChara1[this.page * this.lines + n + i] !== '') {
                    n += i
                    fromFirstIndex = 0
                    hasNext = true
                    break
                  }
                }
                if (!hasNext) {
                  endFlag = true
                }
              }
            } else if (fromFirstIndex === 2) {
              fromFirstIndex = 0
              if (this.highlightChara1[this.page * this.lines + n + 1] !== '') {
                if (this.highlightChara1[this.page * this.lines + n + 1] === undefined) {
                  endFlag = true
                } else if (n + 1 === this.lines) {
                  endFlag = true
                } else {
                  n++
                }
              } else {
                hasNext = false
                for (let i = 1; i < this.lines - 1; i++) {
                  if (this.highlightChara1[this.page * this.lines + n + i] !== '') {
                    n += i
                    hasNext = true
                    break
                  }
                }
                if (!hasNext) {
                  endFlag = true
                }
              }
            }
            if (!endFlag) {
              for (let i = 0; i < this.lines; i++) {
                this.highlightStyle1[i].background = 'none'
                this.highlightStyle2[i].background = 'none'
                this.highlightStyle3[i].background = 'none'
              }
              if (fromFirstIndex === 0) {
                this.highlightStyle1[n].background = 'yellow'
              } else if (fromFirstIndex === 1) {
                this.highlightStyle2[n].background = 'yellow'
              } else {
                this.highlightStyle3[n].background = 'yellow'
              }
            } else {
              clearInterval(this.intervalId)
            }
          } else {
            clearInterval(this.intervalId)
          }
        }, this.charaLen * (0.33 * 17.91196 * Math.exp(-0.0201 * this.speed)))
      } else {
        /* ハイライトの移動処理を開始します。 */
        this.intervalId = setInterval(() => {
          endFlag = false
          if (n < this.lines) {
            if (fromFirstIndex === 0) {
              if (this.highlightChara2[this.page * this.lines + n] !== '') {
                if (this.highlightChara2[this.page * this.lines + n] === undefined) {
                  endFlag = true
                } else {
                  fromFirstIndex++
                }
              } else {
                hasNext = false
                for (let i = 1; i < this.lines - n; i++) {
                  if (this.highlightChara1[this.page * this.lines + n + i] !== '') {
                    n += i
                    hasNext = true
                    break
                  }
                }
                if (!hasNext) {
                  endFlag = true
                }
              }
            } else if (fromFirstIndex === 1) {
              fromFirstIndex = 0
              if (this.highlightChara1[this.page * this.lines + n + 1] !== '') {
                if (this.highlightChara1[this.page * this.lines + n + 1] === undefined) {
                  endFlag = true
                } else if (n + 1 === this.lines) {
                  endFlag = true
                } else {
                  n++
                }
              } else {
                hasNext = false
                for (let i = 1; i < this.lines - 1; i++) {
                  if (this.highlightChara1[this.page * this.lines + n + i] !== '') {
                    n += i
                    hasNext = true
                    break
                  }
                }
                if (!hasNext) {
                  endFlag = true
                }
              }
            }
            if (!endFlag) {
              for (let i = 0; i < this.lines; i++) {
                this.highlightStyle1[i].background = 'none'
                this.highlightStyle2[i].background = 'none'
              }
              if (fromFirstIndex === 0) {
                this.highlightStyle1[n].background = 'yellow'
              } else {
                this.highlightStyle2[n].background = 'yellow'
              }
            } else {
              clearInterval(this.intervalId)
            }
          } else {
            clearInterval(this.intervalId)
          }
        }, this.charaLen * (0.5 * 17.91196 * Math.exp(-0.0201 * this.speed)))
      }
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
  line-height: 2em;
  letter-spacing: 0.03em;
  display: inline-block;
}

.sokutore-wrapper {
  display: flex;
  flex-flow: column;
}

.trimmed-wrapper span:nth-child(1) {
  z-index: 1;
  border-radius: 50%;
}

.trimmed-wrapper span:nth-child(2) {
  margin-top: -0.32em;
  margin-bottom: -0.28em;
  border-radius: 50%;
}

.trimmed-wrapper span:nth-child(3) {
  z-index: 1;
  border-radius: 50%;
}

.trimmed-wrapper span:nth-child(4) {
  margin-top: -0.32em;
  margin-bottom: -0.28em;
  border-radius: 50%;
}

.trimmed-wrapper span:nth-child(5) {
  z-index: 1;
  border-radius: 50%;
}

.trimmed-wrapper span:nth-child(6) {
  margin-top: -0.32em;
  margin-bottom: -0.28em;
  border-radius: 50%;
}

.trimmed-wrapper span:nth-child(7) {
  z-index: 1;
  border-radius: 50%;
}

.lastSpace {
  margin-top: 0.28em;
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
  line-height: 2.5em;
}

.is-size-6-sokutore {
  line-height: 1.8em;
}
</style>
