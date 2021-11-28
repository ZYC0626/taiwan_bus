// import axios from 'axios'
import JsSHA from 'jssha'

const AppID = '0614cbff829f4c189593b90236ef7578'
const AppKey = 'CItZnkpy_c3YQbXXAZ2i21rrcxM'

export default function getAuthorizationHeader (num) {
  const GMTString = new Date().toGMTString()
  const ShaObj = new JsSHA('SHA-1', 'TEXT')
  ShaObj.setHMACKey(AppKey, 'TEXT')
  ShaObj.update('x-date: ' + GMTString)
  const HMAC = ShaObj.getHMAC('B64')
  const Authorization = 'hmac username="' + AppID + '", algorithm="hmac-sha1", headers="x-date", signature="' + HMAC + '"'
  return { Authorization: Authorization, 'X-Date': GMTString }
}
