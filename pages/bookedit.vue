<template>
  <div class="columns is-mobile is-centered" style="width: 100%; margin: 0;">
    <div class="column is-4-tablet is-11-mobile wrapper-top">
      <div class="columns is-mobile is-multiline">
        <div class="column is-12 has-text-weight-semibold mt-3" style="color: #404a72;">タイトル</div>
        <div class="column is-12">
          <div class="columns is-mobile is-centered">
            <div class="column is-12">
              <input class="input is-size-7" type="text" placeholder="タイトルを入力してください" style="border-radius: 8px;" v-model="bookTitle">
            </div>
          </div>
        </div>
        <div class="column is-12 has-text-weight-semibold" style="color: #404a72;">本文</div>
        <div class="column is-12">
          <div class="columns is-mobile is-centered">
            <div class="column is-12">
              <textarea class="textarea is-size-7" rows="10" placeholder="本文を入力してください" style="border-radius: 8px;" v-model="bookBody"></textarea>
            </div>
          </div>
        </div>
        <div class="column is-12 mt-2">
          <div class="columns is-centered is-mobile">
            <div class="column is-12">
              <button @click="updateBook" class="button update-button">更新</button>
            </div>
          </div>
        </div>
        <div class="column is-12 mb-5">
          <div class="columns is-centered is-mobile">
            <div class="column is-12">
              <button @click="checkBack" class="button back-button modoru">戻る</button>
            </div>
          </div>
        </div>
        <div v-if="isEdit" class="column is-12 mb-5">
          <div class="columns is-centered is-mobile">
            <div class="column is-12">
              <button @click="checkDelete" class="button back-button Warn">削除</button>
            </div>
          </div>
        </div>
        <div class="modal" id="modal" v-bind:class="modal_class">
          <div class="modal-background" id="modal-background"></div>
          <div class="modal-content has-background-white" id="modal-content-top" style="border-radius: 8px;">
            <div class="column is-12">
              <div class="columns is-mobile is-vcentered" id="modalnav">
                <div class="column is-2"></div>
                <div v-if="isBack" class="column is-8 has-text-weight-semibold has-text-centered" style="color: #404a72;">確認</div>
                <div v-else class="column is-8 has-text-weight-semibold has-text-centered" style="color: #404a72;">教材の削除</div>
                <div class="column is-2 has-text-weight-semibold has-text-right" style="font-size: 1.5em; color: #404a72;"><span @click="onSelectModal" id="close">×</span></div>
              </div>
            </div>
            <hr>
            <div v-if="isBack" class="column is-12 has-text-weight-semibold has-text-centered">入力内容の変更が保存されませんが戻りますか？</div>
            <div v-else class="column is-12 has-text-weight-semibold has-text-centered">「{{bookTitle}}」を削除しますか？</div>
            <div class="column is-12">
              <div class="columns is-mobile is-vcentered is-multiline">
                <div class="column is-6">
                  <button v-if="isBack" @click="onSelectModal" class="button back-button is-size-7">いいえ</button>
                  <button v-else @click="onSelectModal" class="button back-button is-size-7">キャンセル</button>
                </div>
                <div class="column is-6">
                  <button v-if="isBack" @click="goBack" class="button back-button Warn is-size-7">はい</button>
                  <button v-else @click="goDelete" class="button back-button Warn is-size-7">削除</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'defaultEdit',
  data () {
    return {
      Ref: 'booklist', /* ここにnavberの戻るボタンの遷移先を入れください（by fumiya 2021.12.5） */
      Title: '教材の編集', /* ここにnavberのタイトルを入れください（by fumiya 2021.12.5） */
      isBack: true,
      bookTitleInitial: '',
      bookTitle: '',
      bookBodyInitial: '',
      bookBody: '',
      modal_class: '',
      isEdit: this.$store.state.data.flag,
      isChanged: false
    }
  },
  async mounted () {
    /* navbarに入れる値を受け渡します */
    this.$nuxt.$emit('updateRef', this.Ref)/* navbarの戻るボタンの遷移先の受け渡し */
    this.$nuxt.$emit('updateTitle', this.Title)/* navbarのタイトルの受け渡し */
    /* ここからは文章追加か編集の判断を行います */
    if (this.isEdit) {
      const indexSub = this.$store.state.data.bookIndex - this.$store.state.data.bookList.length
      this.bookTitleInitial = this.$store.state.data.userBookList[indexSub]
      this.bookTitle = this.$store.state.data.userBookList[indexSub]
      this.bookBodyInitial = this.$store.state.data.userBookContent[indexSub]
      this.bookBody = this.$store.state.data.userBookContent[indexSub]
    }
  },
  watch: {
    bookTitle: function (newVal, oldVal) {
      if (this.bookTitle === this.bookTitleInitial && this.bookBody === this.bookBodyInitial) {
        this.isChanged = false
        this.$nuxt.$emit('checkChange', false)
      } else {
        this.isChanged = true
        this.$nuxt.$emit('checkChange', true)
      }
    },
    bookBody: function (newVal, oldVal) {
      if (this.bookTitle === this.bookTitleInitial && this.bookBody === this.bookBodyInitial) {
        this.isChanged = false
        this.$nuxt.$emit('checkChange', false)
      } else {
        this.isChanged = true
        this.$nuxt.$emit('checkChange', true)
      }
    }
  },
  methods: {
    updateNavbar () {
      this.$nuxt.$emit('updateRef', this.Ref)/* navbarの戻るボタンの遷移先の受け渡し */
      this.$nuxt.$emit('updateTitle', this.Title)/* navbarのタイトルの受け渡し */
    },
    onSelectModal () {
      if (this.modal_class === 'is-active') {
        this.modal_class = ''
      } else {
        this.modal_class = 'is-active'
      }
    },
    checkBack () {
      if (this.isChanged) {
        this.isBack = true
        this.onSelectModal()
      } else {
        this.goBack()
      }
    },
    checkDelete () {
      this.isBack = false
      this.onSelectModal()
    },
    updateBook () {
      if (this.isEdit) {
        this.$store.commit('data/updateBookList', this.bookTitle)
        this.$store.commit('data/updateBookContent', this.bookBody)
      } else {
        this.$store.commit('data/addBookList', this.bookTitle)
        this.$store.commit('data/addBookContent', this.bookBody)
        this.$store.commit('data/addBook')
      }
      this.$router.push('booklist')
    },
    goBack () {
      this.$router.push('booklist')
    },
    goDelete () {
      this.$router.push('booklist')
      this.$store.commit('data/deleteBookList')
      this.$store.commit('data/deleteBookContent')
      this.$store.commit('data/changeBookIndex', 0)
    }
  }
}
</script>

<style>
.edit-button {
  width: 100%;
  height: 40px;
  font-size: 1em;
  transition: all 0.3;
  padding: 7px 16px;
  display: flex;
  border: none;
  background: none;
  justify-content: space-between;
  vertical-align: center;
}

.edit-button::after {
  content: '';
  width: 8px;
  height: 8px;
  border-bottom: solid 2px #404a72;
  border-right: solid 2px #404a72;
  -ms-transform: rotate(-45deg);
  -webkit-transform: rotate(-45deg);
  transform: rotate(-45deg);
  margin: auto 0;
}

.edit-button:hover {
  cursor: pointer;
}

.book-button {
  width: 100%;
  height: 40px;
  font-size: 1em;
  transition: all 0.3;
  padding: 7px 16px;
  display: flex;
  border: none;
  background: none;
  justify-content: space-between;
  vertical-align: center;
}

hr {
  margin: 0;
}

.bookbox {
  background: white;
}

.back-button {
  width: 100%;
  height: 40px;
  border-radius: 8px;
  background: white;
}

.modoru {
  border: 1px solid #3362a8;
  color: #3362a8;
}

.Warn {
  border: 1px solid red;
  color: red;
}

.update-button {
  width: 100%;
  height: 40px;
  border-radius: 8px;
  border: none;
  background: #f18d1d;
  color: white;
}

.update-button:hover {
  color: white;
}

#close:hover {
  cursor: pointer;
}

#modal-content-top {
  width: 90%;
}

@media screen and (min-width: 769px) {
  .wrapper-top {
    background: white;
  }

  #modal-content-top {
    width: 50%;
  }
}
</style>
