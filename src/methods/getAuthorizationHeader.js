// import axios from 'axios'
import JsSHA from 'jssha'

const AppID = process.env.VUE_APP_API_ID // 填入自身的TDX AppID
const AppKey = process.env.VUE_APP_API_KEY

export default function getAuthorizationHeader (num) {
  const GMTString = new Date().toGMTString()
  const ShaObj = new JsSHA('SHA-1', 'TEXT')
  ShaObj.setHMACKey(AppKey, 'TEXT')
  ShaObj.update('x-date: ' + GMTString)
  const HMAC = ShaObj.getHMAC('B64')
  const Authorization = 'hmac username="' + AppID + '", algorithm="hmac-sha1", headers="x-date", signature="' + HMAC + '"'
  return { Authorization: Authorization, 'X-Date': GMTString }
}
