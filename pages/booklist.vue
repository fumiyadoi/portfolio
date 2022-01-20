<template>
  <div class="columns is-mobile is-centered" style="width: 100%; margin: 0;">
    <div class="column is-4-tablet is-11-mobile wrapper-top">
      <div class="columns is-mobile is-multiline">
        <div class="column is-12 mt-2 has-text-weight-semibold" style="color: #404a72;">オリジナル教材</div>
        <div class="column is-12"><input type="text" v-model="searchUserWord" placeholder="オリジナル教材を検索"></div>
        <div v-if="this.userList.length > 0" class="column is-12">
          <div class="columns is-mobile is-centered" style="margin: 0;">
            <div class="column is-12 bookbox" style="max-height: 120px; border: 1px solid #dbdbdb; border-radius: 4px; overflow-x: scroll;">
              <div v-for="(booktitle, index) in userList" :key="booktitle">
                <button @click="goEdit(index)" class="canedit is-size-7" style="color: #404a72;">{{booktitle}}</button>
                <hr v-if="index != userList.length - 1">
              </div>
            </div>
          </div>
        </div>
        <div v-else class="column is-12 has-text-centered">教材がありません</div>
        <div class="column is-12 mt-4 has-text-weight-semibold" style="color: #404a72;">共通教材</div>
        <div class="column is-12"><input type="text" v-model="searchCommonWord" placeholder="共通教材を検索"></div>
        <div v-if="this.commonList.length > 0" class="column is-12">
          <div class="columns is-mobile is-centered" style="margin: 0;">
            <div class="column is-12 bookbox" style="max-height: 120px; border: 1px solid #dbdbdb; border-radius: 4px; overflow-x: scroll;">
              <div v-for="(booktitle, index) in commonList" :key="booktitle">
                <button class="notedit is-size-7" style="color: #404a72;">{{booktitle}}</button>
                <hr v-if="index != commonList.length - 1">
              </div>
            </div>
          </div>
        </div>
        <div v-else class="column is-12 has-text-centered">教材がありません</div>
        <div class="column is-12 mt-3 mb-2">
          <div class="columns is-centered is-mobile" style="margin: 0;">
            <div class="column is-12" style="padding: 0;">
              <button @click="goAdd" class="button add-button">新しい教材を追加</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'defaultList',
  data () {
    return {
      searchUserWord: '',
      searchCommonWord: '',
      userList: [],
      commonList: []
    }
  },
  computed: {
    userBaseList: function () {
      return this.$store.state.data.userBookList
    },
    commonBaseList: function () {
      return this.$store.state.data.bookList
    }
  },
  async mounted () {
    const Ref = this.$store.state.data.backIdentifier
    this.$nuxt.$emit('updateRef', Ref)/* navbarの戻るボタンの遷移先の受け渡し */
    this.$store.commit('data/falseFlag')
    this.userList = this.userBaseList
    this.commonList = this.commonBaseList
  },
  watch: {
    searchUserWord: function (newVal, oldVal) {
      this.searchUserBook()
    },
    searchCommonWord: function (newVal, oldVal) {
      this.searchCommonBook()
    }
  },
  methods: {
    searchUserBook () {
      if (this.searchUserWord !== '') {
        this.userList = []
        for (let i = 0; i < this.userBaseList.length; i++) {
          const title = this.userBaseList[i]
          const searchword = this.searchUserWord
          if (title.indexOf(searchword) !== -1) {
            this.userList.push(this.userBaseList[i])
          }
        }
      } else {
        this.userList = this.userBaseList
      }
    },
    searchCommonBook () {
      if (this.searchCommonWord !== '') {
        this.commonList = []
        for (let i = 0; i < this.commonBaseList.length; i++) {
          const title = this.commonBaseList[i]
          const searchword = this.searchCommonWord
          if (title.indexOf(searchword) !== -1) {
            this.commonList.push(this.commonBaseList[i])
          }
        }
      } else {
        this.commonList = this.commonBaseList
      }
    },
    goAdd () {
      this.$router.push('bookedit')
    },
    goEdit (index) {
      const indexTmp = index + this.$store.state.data.bookList.length
      this.$store.commit('data/changeBookIndex', indexTmp)
      this.$store.commit('data/trueFlag')
      this.$router.push('bookedit')
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

.canedit {
  width: 100%;
  height: 32px;
  font-size: 1em;
  transition: all 0.3;
  padding: 6px 16px;
  display: flex;
  border: none;
  background: none;
  justify-content: space-between;
  vertical-align: center;
  cursor: pointer;
}

.canedit::after {
  content: '';
  width: 8px;
  height: 8px;
  border-bottom: solid 2px #404a72;
  border-right: solid 2px #404a72;
  -ms-transform: rotate(-45deg);
  -webkit-transform: rotate(-45deg);
  transform: rotate(-45deg);
  margin: 6px 0;
}

.edit-button:hover {
  cursor: pointer;
}

.notedit {
  width: 100%;
  height: 32px;
  font-size: 1em;
  transition: all 0.3;
  padding: 6px 16px;
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
  padding: 0;
  background: white;
}

.add-button {
  width: 100%;
  height: 40px;
  border-radius: 8px;
  border: 1px solid #3362a8;
  color: #3362a8;
  background: white;
}

@media screen and (min-width: 769px) {
  .wrapper-top {
    background: white;
  }
}
</style>
