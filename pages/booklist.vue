<template>
  <div class="columns is-mobile is-centered" style="width: 100%; margin: 0;">
    <div class="column is-4-tablet is-11-mobile wrapper-top">
      <div class="columns is-mobile is-multiline">
        <div class="column is-12 mt-5 has-text-weight-semibold" style="color: #404a72;">ユーザーオリジナル教材</div>
        <div v-if="anyBook" class="column is-12">
          <div class="columns is-mobile is-centered" style="margin: 0;">
            <div class="column is-12 bookbox" style="border: 2px solid whitesmoke; border-radius: 8px;">
              <div v-for="(userList, index) in userList" :key="userList">
                <hr v-if="index != 0">
                <button @click="goEdit(index)" class="edit-button" style="color: #404a72;">{{userList}}</button>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="column is-12 has-text-centered">まだ教材が登録されていません</div>
        <div class="column is-12 mt-5 has-text-weight-semibold" style="color: #404a72;">共通教材</div>
        <div class="column is-12 mt-2">
          <div class="columns is-mobile is-centered" style="margin: 0;">
            <div class="column is-12 bookbox" style="border: 2px solid whitesmoke; border-radius: 8px;">
              <div v-for="(commonList, index) in commonList" :key="commonList">
                <hr v-if="index != 0">
                <button class="book-button" style="color: #404a72;">{{commonList}}</button>
              </div>
            </div>
          </div>
        </div>
        <div class="column is-12 mt-3 mb-6">
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
      commonList: this.$store.state.data.bookList,
      userList: this.$store.state.data.userBookList,
      anyBook: false
    }
  },
  async mounted () {
    const Ref = this.$store.state.data.backIdentifier
    this.$nuxt.$emit('updateRef', Ref)/* navbarの戻るボタンの遷移先の受け渡し */
    this.$store.commit('data/falseFlag')
    if (this.userList.length > 0) {
      this.anyBook = true
    }
  },
  methods: {
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
