<template>
  <div class="h-100 d-flex flex-column">
    <div class="bread-bar">
      <ol class="breadcrumb m-0 d-md-flex d-none">
        <li class="breadcrumb-item"><a href="#">首頁</a></li>
        <li class="breadcrumb-item active" aria-current="page">
          <span v-if="city">{{ $filters.replaceCity(city) }}</span>
        </li>
      </ol>
      <div class="mobile-control-bar  d-flex d-md-none">
        <div class="city">
          <span class="material-icons">
          location_on
          </span>
          <span v-if="city">{{ $filters.replaceCity(city) }}</span>
        </div>
        <div class="tool">
          <div class="map" :class="{ active: mobileTool === 'map' }"
          @click="showArea('map')">
            <i class="bi bi-pin-map me-1"></i>地圖
          </div>
          <div class="time" :class="{ active: mobileTool === 'time' }" v-if="stopOfRouteBack.length > 0 && stopOfRouteTo.length > 0"
          @click="showArea('time')">
            <i class="bi bi-clock me-1"></i>時刻表
          </div>
          <div class="route" :class="{ active: mobileTool === 'route' }"
          @click="showArea('route')">
            <i class="bi bi-map me-1"></i>路線
          </div>
        </div>
      </div>
    </div>
    <div class="map-wrap">
      <div class="route-search-area active">
        <div class="route-search-header">
          <input type="search" class="form-control" id="routeNumber" placeholder="請輸入公車路線"
          v-model="routeKeyword"
          >
        </div>
        <div class="route-search-body">
          <ul class="route-list">
            <li class="route-list-item" v-for="item in routeList" :key="item.RouteUID"
            @click="toRouteDetailClick(item)">
              <div class="d-flex justify-content-between">
                <div class="title">{{ item.RouteName.Zh_tw }}</div>
                <div class="icon">
                  <a href="#"
                  @click.prevent="updateLikes(item)">
                    <span class="material-icons love" v-if="buslikesId.includes(item.RouteUID)">
                    favorite
                    </span>
                    <span class="material-icons" v-else>
                    favorite_border
                    </span>
                  </a>
                </div>
              </div>
              <div class="d-flex justify-content-between">
                <div class="od">{{ item.DepartureStopNameZh }}-{{ item.DestinationStopNameZh }}</div>
                <div class="city"><span v-if="city">{{ $filters.replaceCity(city) }}</span></div>
              </div>
            </li>
          </ul>
        </div>
        <SearchKeyboard :city="city" v-on:emit-input="updateInput"></SearchKeyboard>
      </div>
      <div class="route-stop-area">
        <a href="#" class="return"
        @click.prevent="backToRouteSeachList()">
        <span class="material-icons">chevron_left</span>
        返回搜尋
        </a>
        <div class="refresh-bar">
          <div class="time">{{ refreshTime }} 秒後更新</div>
          <a href="#" class="refresh ms-auto"
          @click.prevent="getStopOfRoute()">
          <span class="material-icons">autorenew</span>
          立即更新
          </a>
      </div>
        <div class="route-stop-header">
          <div class="route-name">
          <a href="#"
          @click.prevent="shareLink()">
          <span class="material-icons">
          link
          </span>
          </a>
          {{ selectRoute }}
          <a href="#"
          @click.prevent="updateLikes_(selectRoute, selectRouteUID, stopOfRouteBack[stopOfRouteBack.length - 1].StopName.Zh_tw, stopOfRouteTo[stopOfRouteTo.length - 1].StopName.Zh_tw, city)">
          <span class="material-icons love" v-if="buslikesId.includes(selectRouteUID)">
            favorite
          </span>
          <span class="material-icons" v-else>
            favorite_border
          </span>
          </a>
          </div>
        </div>
        <ul class="nav nav-tabs" role="tablist">
            <li class="nav-item od-nav" role="presentation">
              <button class="nav-link" :class="{ active: toOrBack === 'to'}" id="go-tab" data-bs-toggle="tab" data-bs-target="#go" type="button"
              @click="changeToOrBack('to')">
                <div class="fw-700 truncateText" v-if="stopOfRouteTo.length > 0">往 {{ stopOfRouteTo[stopOfRouteTo.length - 1].StopName.Zh_tw }}</div>
              </button>
            </li>
            <li class="nav-item od-nav" role="presentation">
              <button class="nav-link" :class="{ active: toOrBack === 'back'}" id="back-tab" data-bs-toggle="tab" data-bs-target="#back" type="button"
              @click="changeToOrBack('back')">
                <div class="fw-700 truncateText" v-if="stopOfRouteBack.length > 0">往 {{ stopOfRouteBack[stopOfRouteBack.length - 1].StopName.Zh_tw }}</div>
              </button>
            </li>
        </ul>
        <div class="route-stop-content">
          <div class="tab-content py-3" id="routeTabContent">
              <div class="tab-pane fade show active" id="go" role="tabpanel" v-if="stopOfRouteTo.length > 0">
                <ul class="route-stop-list">
                  <li class="route-stop-item" v-for="stop in stopOfRouteTo" :key="stop.StopUID"
                  @click="panToPosition(stop.StopPosition.PositionLat, stop.StopPosition.PositionLon)">
                    <div class="time" :class="{ active : stop.EstimateTime <= 180 , 'disconnect': stop.StopStatus !== 0}">
                      <span v-if="stop.StopStatus === 0">
                        <span v-if="stop.EstimateTime <= 180 && stop.PlateNumb">進站中</span>
                        <span v-else-if="stop.EstimateTime <= 180">即將進站</span>
                        <span v-else>{{  $filters.toMinute(stop.EstimateTime) }}分</span>
                      </span>
                      <span v-else-if="stop.StopStatus === 1">尚未發車</span>
                      <span v-else-if="stop.StopStatus === 2">交管不停靠</span>
                      <span v-else-if="stop.StopStatus === 3">末班車已過</span>
                      <span v-else>今日未營運</span>
                    </div>
                    <div class="stop-name">{{ stop.StopName.Zh_tw }}</div>
                    <div class="plate-numb">
                      <span v-if="stop.PlateNumb">{{ stop.PlateNumb }}</span>
                    </div>
                    <div class="status-dot" :class="{ 'bus-on' : stop.PlateNumb }"></div>
                  </li>
                </ul>
              </div>
              <div class="tab-pane fade" id="back" role="tabpanel" v-if="stopOfRouteBack.length > 0">
                <ul class="route-stop-list">
                  <li class="route-stop-item" v-for="stop in stopOfRouteBack" :key="stop.StopUID"
                  @click="panToPosition(stop.StopPosition.PositionLat, stop.StopPosition.PositionLon)">
                    <div class="time" :class="{ active : stop.EstimateTime <= 180, 'disconnect': stop.StopStatus !== 0}">
                      <span v-if="stop.StopStatus === 0">
                        <span v-if="stop.EstimateTime <= 180 && stop.PlateNumb">進站中</span>
                        <span v-else-if="stop.EstimateTime <= 180">即將進站</span>
                        <span v-else>{{  $filters.toMinute(stop.EstimateTime) }}分</span>
                      </span>
                      <span v-else-if="stop.StopStatus === 1">尚未發車</span>
                      <span v-else-if="stop.StopStatus === 2">交管不停靠</span>
                      <span v-else-if="stop.StopStatus === 3">末班車已過</span>
                      <span v-else>今日未營運</span>
                    </div>
                    <div class="stop-name" :class="{ active : stop.PlateNumb, 'disconnect': stop.StopStatus !== 0}">{{ stop.StopName.Zh_tw }}</div>
                    <div class="plate-numb">
                      <span v-if="stop.PlateNumb">{{ stop.PlateNumb }}</span>
                    </div>
                    <div class="status-dot" :class="{ 'bus-on' : stop.PlateNumb , 'bus-close' : stop.EstimateTime <= 180 }"></div>
                  </li>
                </ul>
              </div>
          </div>
        </div>
      </div>
      <div class="gps-icon" @click="locateGPS()">
        <img src="@/assets/images/gps.svg" class="icon-filter" alt="gps-icon">
      </div>
      <div class="map" id="map"></div>
    </div>
  </div>
</template>
<script>
import $L from 'leaflet'
import Wkt from 'wicket'
import SearchKeyboard from '@/components/SearchKeyboard.vue'

let openStreetMap = {}

const walkBusIcon = new $L.Icon({
  iconUrl: require('@/assets/images/walkbus.svg'),
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -20]
})
const stationInIcon = new $L.Icon({
  iconUrl: require('@/assets/images/busStop_in.svg'),
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  popupAnchor: [0, -14]
})
const stationIcon = new $L.Icon({
  iconUrl: require('@/assets/images/busStop.svg'),
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12]
})
const positionIcon = new $L.Icon({
  iconUrl: require('@/assets/images/position.svg'),
  iconSize: [49, 49],
  iconAnchor: [24, 24],
  popupAnchor: [0, -24]
})

// function removeMapMarker () {
//   // console.log(typeof openStreetMap)
//   openStreetMap.eachLayer((layer) => {
//     if (layer instanceof $L.Marker) {
//       openStreetMap.removeLayer(layer)
//     }
//     if (layer.toGeoJSON) {
//       openStreetMap.removeLayer(layer)
//     }
//   })
// }
export default {
  components: {
    SearchKeyboard
  },
  data () {
    return {
      city: '',
      routeList: [],
      routeKeyword: '',
      stopOfRouteTo: [],
      stopOfRouteBack: [],
      selectRoute: '',
      selectRouteUID: '',
      selectLatlon: [],
      toOrBack: 'to',
      routeGeometry: [],
      routeLayer: null,
      locationMarkerID: '',
      walkBusMarker: [],
      stopMarker: [],
      mobileTool: 'route',
      timer: null,
      refreshTime: 0,
      buslikes: [],
      buslikesId: [],
      prevRoute: null
    }
  },
  methods: {
    updateInput (str) {
      // console.log('out', str)
      this.routeKeyword = str
    },
    getRoute () {
      const url = `https://ptx.transportdata.tw/MOTC/v2/Bus/Route/City/${this.city}/${this.routeKeyword}?$top=50&$format=JSON`
      this.axios.get(url,
        {
          headers: this.$getAuthorizationHeader()
        }
      )
        .then((response) => {
          // console.log(response.data)
          this.routeList = response.data
        })
        .catch((err) => {
          console.log(err)
        })
    },
    toRouteDetailClick (item) {
      if (event.target.tagName !== 'SPAN') {
        this.toRouteDetail(item.RouteName.Zh_tw, item.RouteUID)
        this.fitBounds()
      }
    },
    toRouteDetail (routeName, routeUID) {
      // console.log('test', event.target.tagName)
      document.querySelector('.route-search-area').classList.remove('active')
      document.querySelector('.route-stop-area').classList.add('active')
      this.selectRoute = routeName
      this.selectRouteUID = routeUID
      this.mobileTool = 'time'
      this.getStopOfRoute()
    },
    backToRouteSeachList () {
      // console.log(this.prevRoute)
      if (this.prevRoute) {
        if (this.prevRoute.name !== 'nearStation' && this.prevRoute.name !== 'busSearch' && this.prevRoute.name !== 'likeBus' && this.prevRoute.name !== 'stopSearch') {
          document.querySelector('.route-search-area').classList.add('active')
          document.querySelector('.route-stop-area').classList.remove('active')
        } else {
          this.$router.go(-1)
        }
      } else {
        document.querySelector('.route-search-area').classList.add('active')
        document.querySelector('.route-stop-area').classList.remove('active')
      }
    },
    getStopOfRoute () {
      if (this.timer) clearInterval(this.timer)
      this.timeCountDown(21)
      const url = `https://ptx.transportdata.tw/MOTC/v2/Bus/StopOfRoute/City/${this.city}?$filter=RouteUID%20eq%20'${this.selectRouteUID}'&$format=JSON`
      this.axios.get(url,
        {
          headers: this.$getAuthorizationHeader()
        }
      )
        .then((response) => {
          response.data.forEach(x => {
            if (x.Direction === 0) {
              this.stopOfRouteTo = x.Stops
            } else if (x.Direction === 1) {
              this.stopOfRouteBack = x.Stops
            }
          })
          this.getEstimateTime(this.selectRoute, this.selectRouteUID)
          // continue
        })
        .catch((err) => {
          console.log(err)
        })
    },
    getEstimateTime (routeName, routeUID) {
      const url = `https://ptx.transportdata.tw/MOTC/v2/Bus/EstimatedTimeOfArrival/City/${this.city}/${routeName}?$filter=RouteUID%20in%20('${routeUID}')&$format=JSON`
      this.axios.get(url,
        {
          headers: this.$getAuthorizationHeader()
        }
      )
        .then((response) => {
          // console.log(response.data)
          response.data.forEach((x) => {
            if (x.Direction === 0) {
              this.stopOfRouteTo.forEach((route) => {
                if (x.StopUID === route.StopUID) {
                  route.EstimateTime = x.EstimateTime
                  route.StopStatus = x.StopStatus
                }
              })
            }
            if (x.Direction === 1) {
              this.stopOfRouteBack.forEach((route) => {
                if (x.StopUID === route.StopUID) {
                  route.EstimateTime = x.EstimateTime
                  route.StopStatus = x.StopStatus
                }
              })
            }
          })
          // continue
          this.getPlateNum(routeName, routeUID)
        })
        .catch((err) => {
          console.log(err)
        })
    },
    getPlateNum (routeName, routeUID) {
      const url = `https://ptx.transportdata.tw/MOTC/v2/Bus/RealTimeNearStop/City/${this.city}/${routeName}?$filter=RouteUID%20eq%20'${routeUID}'&$format=JSON`
      this.axios.get(url,
        {
          headers: this.$getAuthorizationHeader()
        }
      )
        .then((response) => {
          // console.log(response.data)
          response.data.forEach((bus) => {
            if (bus.Direction === 0) {
              this.stopOfRouteTo.forEach((route) => {
                if (bus.StopUID === route.StopUID) {
                  route.PlateNumb = bus.PlateNumb
                  // console.log(bus.PlateNumb)
                }
              })
            }
            if (bus.Direction === 1) {
              this.stopOfRouteBack.forEach((route) => {
                if (bus.StopUID === route.StopUID) {
                  route.PlateNumb = bus.PlateNumb
                  // console.log(bus.PlateNumb)
                }
              })
            }
          })
          // continue
          this.getRouteGeometry(routeName, routeUID)
        })
        .catch((err) => {
          console.log(err)
        })
    },
    getRouteGeometry (routeName, routeUID) {
      const url = `https://ptx.transportdata.tw/MOTC/v2/Bus/Shape/City/${this.city}/${routeName}?$filter=RouteUID%20eq%20'${routeUID}'&$format=JSON`
      this.axios.get(url,
        {
          headers: this.$getAuthorizationHeader()
        }
      )
        .then((response) => {
          // console.log(response.data)
          this.routeGeometry = response.data
          // continue
          openStreetMap.eachLayer((layer) => {
            if (layer._leaflet_id !== this.locationMarkerID) {
              if (layer instanceof $L.Marker) {
                openStreetMap.removeLayer(layer)
              }
              if (layer instanceof $L.Popup) {
                openStreetMap.removeLayer(layer)
              }
              if (layer.toGeoJSON) {
                openStreetMap.removeLayer(layer)
              }
            }
          })
          this.addRouteLayer()
        })
        .catch((err) => {
          console.log(err)
        })
    },
    addRouteLayer () {
      const geoStyle = {
        color: '#345E8A',
        weight: 4
      }
      let layer = null
      this.routeGeometry.forEach((route) => {
        const wicket = new Wkt.Wkt()
        wicket.read(route.Geometry)
        const geoJsonFeature = wicket.toJson()
        try {
          layer = $L.geoJSON(geoJsonFeature, { style: geoStyle }).addTo(openStreetMap)
          layer.addData(geoJsonFeature)
          this.routeLayer = layer
          this.addRouteMarker()
        } catch (e) {
          console.log(e)
        }
      })
    },
    changeToOrBack (way) {
      this.toOrBack = way
      this.addRouteMarker()
    },
    addRouteMarker () {
      let tempData = []
      if (this.toOrBack === 'to') {
        tempData = JSON.parse(JSON.stringify(this.stopOfRouteTo))
      } else {
        tempData = JSON.parse(JSON.stringify(this.stopOfRouteBack))
      }
      openStreetMap.eachLayer((layer) => {
        if (layer._leaflet_id !== this.locationMarkerID) {
          if (layer instanceof $L.Marker) {
            openStreetMap.removeLayer(layer)
          }
          if (layer instanceof $L.Popup) {
            openStreetMap.removeLayer(layer)
          }
        }
      })
      const zoomLevel = openStreetMap.getZoom()
      if (zoomLevel > 15) {
        this.zoomLevelAddMarker()
      } else {
        tempData.forEach((x, index) => {
          if (x.PlateNumb) {
            const marker = $L.marker([x.StopPosition.PositionLat, x.StopPosition.PositionLon], { icon: walkBusIcon })
            marker.addTo(openStreetMap)
          } else if (index === 0 || index === tempData.length - 1) {
            const marker = $L.marker([x.StopPosition.PositionLat, x.StopPosition.PositionLon], { icon: stationIcon })
            marker.addTo(openStreetMap)
          }
        })
      }
      // openStreetMap.setView([tempData[0].StopPosition.PositionLat, tempData[0].StopPosition.PositionLon], 14)
    },
    zoomLevelAddMarker () {
      if (this.stopOfRouteTo.length > 0 && this.stopOfRouteBack.length > 0) {
        const zoomLevel = openStreetMap.getZoom()
        // console.log(zoomLevel)
        if (zoomLevel <= 15) {
          this.addRouteMarker()
        } else {
          let tempData = []
          if (this.toOrBack === 'to') {
            tempData = JSON.parse(JSON.stringify(this.stopOfRouteTo))
          } else {
            tempData = JSON.parse(JSON.stringify(this.stopOfRouteBack))
          }
          openStreetMap.eachLayer((layer) => {
            if (layer._leaflet_id !== this.locationMarkerID) {
              if (layer instanceof $L.Marker) {
                openStreetMap.removeLayer(layer)
              }
              if (layer instanceof $L.Popup) {
                openStreetMap.removeLayer(layer)
              }
            }
          })
          tempData.forEach((x, index) => {
            const popupContent = this.createPopupContent(x)
            const popup = $L.popup({
              autoPan: false,
              className: popupContent.status,
              offset: [0, -12]
            })
            popup.setLatLng($L.latLng(x.StopPosition.PositionLat, x.StopPosition.PositionLon))
            popup.setContent(popupContent.str)
            openStreetMap.addLayer(popup)
            if (popupContent.status === 'popupWarning') {
              const marker = $L.marker([x.StopPosition.PositionLat, x.StopPosition.PositionLon], { icon: stationInIcon })
                .bindPopup(popup)
              // .on('click', markerOnClick)
              marker.addTo(openStreetMap)
            } else {
              const marker = $L.marker([x.StopPosition.PositionLat, x.StopPosition.PositionLon], { icon: stationIcon })
                .bindPopup(popup)
              // .on('click', markerOnClick)
              marker.addTo(openStreetMap)
            }
          })
        }
      }
    },
    createPopupContent (x) {
      let status = ''
      let statusCode = 'popupPrimary'
      if (x.StopStatus === 0) {
        if (x.EstimateTime <= 180 && x.PlateNumb) {
          status = '進站中'
          statusCode = 'popupWarning'
        } else if (x.EstimateTime <= 180) {
          status = '即將進站'
          statusCode = 'popupWarning'
        } else {
          status = this.$filters.toMinute(x.EstimateTime) + ' 分'
        }
      } else if (x.StopStatus === 1) {
        status = '尚未發車'
        statusCode = 'popupSecondary'
      } else if (x.StopStatus === 2) {
        status = '交管不停靠'
        statusCode = 'popupSecondary'
      } else if (x.StopStatus === 3) {
        status = '末班車已過'
        statusCode = 'popupSecondary'
      }
      const busImg = require('@/assets/images/carbon_bus_w.svg')
      const busIcon = x.PlateNumb ? `<img src="${busImg}" height="25" alt="icon">` : ''
      const str = `
      <div class="stop-popup">
        ${busIcon}
        <div class="name">${x.StopName.Zh_tw}</div>
        <div class="time">${status} </div>
      </div>
      `
      return {
        str: str,
        status: statusCode
      }
    },
    panToPosition (Lat, Lng) {
      // console.log(Lat, Lng)
      openStreetMap.setView([Lat, Lng], 18)
      this.selectLatlon = [Lat, Lng]
      // console.log(window.innerWidth)
      if (window.innerWidth < 768) {
        this.showArea('map')
      }
    },
    locateGPS () {
      // 定位
      navigator.geolocation.getCurrentPosition(position => {
        openStreetMap.eachLayer((layer) => {
          if (layer._leaflet_id === this.locationMarkerID) {
            openStreetMap.removeLayer(layer)
          }
        })
        const locate = [position.coords.latitude, position.coords.longitude]
        openStreetMap.setView(locate, 15)
        document.querySelector('.gps-icon').classList.add('active')
        const marker = $L.marker([position.coords.latitude, position.coords.longitude], { icon: positionIcon })
        marker.addTo(openStreetMap)
        this.locationMarkerID = marker._leaflet_id
      })
    },
    showArea (area) {
      if (area === 'map') {
        this.mobileTool = 'map'
        document.querySelector('.route-search-area').classList.remove('active')
        document.querySelector('.route-stop-area').classList.remove('active')
      } else if (area === 'route') {
        this.mobileTool = 'route'
        document.querySelector('.route-search-area').classList.add('active')
        document.querySelector('.route-stop-area').classList.remove('active')
      } else if (area === 'time') {
        this.mobileTool = 'time'
        document.querySelector('.route-search-area').classList.remove('active')
        document.querySelector('.route-stop-area').classList.add('active')
      }
    },
    getParam () {
      const pstr = '' + this.$route.params.queryString
      const pjson = JSON.parse(pstr)
      this.city = pjson.city
      if (pjson.route && pjson.routeUID) {
        this.selectRoute = pjson.route
        this.selectRouteUID = pjson.routeUID
        this.toOrBack = pjson.direction === 0 ? 'to' : 'back'
        this.toRouteDetail(this.selectRoute, this.selectRouteUID)
        if (pjson.LatLon.length > 0) {
          this.panToPosition(pjson.LatLon[0], pjson.LatLon[1])
        } else {
          this.fitBounds()
        }
        // console.log(pjson.LatLon[0], pjson.LatLon[1])
      }
      // console.log(pjson)
    },
    fitBounds () {
      setTimeout(() => {
        console.log('setTimeOut')
        openStreetMap.fitBounds(this.routeLayer.getBounds())
      }, 500)
    },
    timeCountDown (time) {
      let timeRemaining = time
      this.timer = setInterval(() => {
        if (timeRemaining > 0) {
          timeRemaining--
          // console.log(timeRemaining)
          this.refreshTime = timeRemaining
        } else {
          clearInterval(this.timer)
          this.getStopOfRoute()
        }
      }, 1000)
    },
    getLikes () {
      // console.log(localStorage.getItem('likelist'))
      const likeStr = localStorage.getItem('busLikes') ? localStorage.getItem('busLikes') : '[]'
      this.buslikes = JSON.parse(likeStr)
      this.buslikesId = this.buslikes.map(x => { return x.routeUID })
    },
    updateLikes_ (routeName, routeUID, startStop, endStop, city) {
      const res = {
        data: {
          data: {},
          message: '收藏',
          success: true
        }
      }
      if (this.buslikesId.includes(routeUID)) {
        this.buslikes.splice(this.buslikes.map(x => { return x.routeUID }).indexOf(routeUID), 1)
        this.buslikesId.splice(this.buslikesId.indexOf(routeUID), 1)
        this.$httpMessageState(res, '移除收藏')
      } else {
        this.buslikes.push({
          routeUID: routeUID,
          routeName: routeName,
          start: startStop,
          end: endStop,
          city: city
        })
        this.buslikesId.push(routeUID)
        this.$httpMessageState(res, '加入收藏')
      }
    },
    updateLikes (router) {
      const res = {
        data: {
          data: {},
          message: '收藏',
          success: true
        }
      }
      if (this.buslikesId.includes(router.RouteUID)) {
        this.buslikes.splice(this.buslikes.map(x => { return x.routeUID }).indexOf(router.RouteUID), 1)
        this.buslikesId.splice(this.buslikesId.indexOf(router.RouteUID), 1)
        this.$httpMessageState(res, '移除收藏')
      } else {
        this.buslikes.push({
          routeUID: router.RouteUID,
          routeName: router.RouteName.Zh_tw,
          start: router.DepartureStopNameZh,
          end: router.DestinationStopNameZh,
          city: this.city
        })
        this.buslikesId.push(router.RouteUID)
        this.$httpMessageState(res, '加入收藏')
      }
    },
    saveLocalStorage (data) {
      const datastr = JSON.stringify(data)
      try {
        localStorage.setItem('busLikes', datastr)
      } catch (e) {
        return false
      }
    },
    shareLink () {
      let urlStr = ''
      urlStr += document.URL.split('#')[0]
      const param = {
        city: this.city,
        route: this.selectRoute,
        routeUID: this.selectRouteUID,
        direction: this.toOrBack === 'to' ? 0 : 1,
        LatLon: this.selectLatlon
      }
      const qStr = JSON.stringify(param)
      urlStr += '#/BusSearch/' + qStr
      // console.log(urlStr)
      // copy
      const dummy = document.createElement('input')
      document.body.appendChild(dummy)
      dummy.value = urlStr
      dummy.select()
      dummy.setSelectionRange(0, 99999)
      document.execCommand('copy')
      document.body.removeChild(dummy)
      const res = {
        data: {
          data: {},
          message: '分享連結',
          success: true
        }
      }
      this.$httpMessageState(res, '複製分享連結')
    }
  },
  watch: {
    routeKeyword () {
      this.getRoute()
    },
    buslikes: {
      handler (n, o) {
        this.saveLocalStorage(this.buslikes)
      },
      deep: true
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.prevRoute = from
    })
  },
  mounted () {
    // this.city = this.$route.params.city
    // quick start
    openStreetMap = $L.map('map', {
      zoomControl: false,
      center: [23.51357237187571, 120.21110434230025],
      zoom: 8,
      tap: false
    })
    $L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(openStreetMap)

    // resset zoom position
    $L.control.zoom({
      position: 'bottomright'
    }).addTo(openStreetMap)
    openStreetMap.on('moveend', function () {
      document.querySelector('.gps-icon').classList.remove('active')
    })
    const func = this.zoomLevelAddMarker
    openStreetMap.on('zoomend', function () {
      func()
    })
    this.getParam()
    this.getLikes()
  },
  unmounted () {
    if (this.timer) clearInterval(this.timer)
  }
}
</script>
