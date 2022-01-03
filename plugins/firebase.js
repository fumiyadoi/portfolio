import { initializeApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
const firebaseConfig = {
  apiKey: 'AIzaSyDI5YQdIhnz_s9ZQEcmHMsRIK244J_8p1I',
  authDomain: 'sokudoku-dev.firebaseapp.com',
  projectId: 'sokudoku-dev',
  storageBucket: 'sokudoku-dev.appspot.com',
  messagingSenderId: '548257994458',
  appId: '1:548257994458:web:857ef4852e282a86e8f7e3'
}
const apps = getApps()
let firebaseApp = []
if (!apps.length) {
  firebaseApp = initializeApp(firebaseConfig)
} else {
  firebaseApp = apps[0]
}
const db = getFirestore(firebaseApp, {})
export { db }
