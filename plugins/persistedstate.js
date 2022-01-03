import createPersistedState from 'vuex-persistedstate'

export default ({ store }) => {
  createPersistedState({
    key: 'sokudoku-dev'
  })(store)
}