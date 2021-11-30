<template>
  <Loading :active="isLoading"
  :z-index="2000">
  </Loading>
  <div class="h-100 d-flex flex-column">
    <div class="bread-bar">
      <ol class="breadcrumb m-0">
        <li class="breadcrumb-item"><a href="#">首頁</a></li>
        <li class="breadcrumb-item active" aria-current="page">站點查詢</li>
      </ol>
    </div>
    <div class="map-wrap">
      <div class="route-search-area active">
        <div class="route-search-header">
          <select class="form-select mb-2" v-model="city"
          @change="getAllStationFromCity()">
            <option :value="city.City" v-for="city in cityList" :key="city.City">{{ city.CityName }}</option>
          </select>
          <input list="datalistOptions" class="form-control" id="stationName" placeholder="想去哪裡?"
          v-model="selectStationName"
          @change="getStationData()">
          <datalist id="datalistOptions">
            <option :value="option" v-for="(option, index) in optiondata" :key="index"></option>
          </datalist>
        </div>
        <div class="route-search-body">
          <ul class="route-list">
            <li class="route-list-item" v-for="item in selectRouteData" :key="item.RouteUID"
            @click="toRouteDetail(item)">
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
                <div class="city"><span v-if="item.City">{{ $filters.replaceCity(item.City) }}</span></div>
              </div>
            </li>
          </ul>
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
import cityList from '@/assets/CityList.json'
// import Wkt from 'wicket'
let openStreetMap = {}

// const stationIcon = new $L.Icon({
//   iconUrl: require('@/assets/images/busStop.svg'),
//   iconSize: [24, 24],
//   iconAnchor: [12, 12],
//   popupAnchor: [0, -12]
// })
const positionIcon = new $L.Icon({
  iconUrl: require('@/assets/images/position.svg'),
  iconSize: [49, 49],
  iconAnchor: [24, 24],
  popupAnchor: [0, -24]
})

export default {
  data () {
    return {
      isLoading: false,
      locationMarkerID: '',
      optiondata: [],
      selectStationName: '',
      selectStationData: [],
      selectStationRouteID: [],
      selectRouteData: [],
      buslikes: [],
      buslikesId: [],
      city: 'Taipei',
      cityList
    }
  },
  methods: {
    locateGPS () {
      // 定位
      navigator.geolocation.getCurrentPosition(position => {
        openStreetMap.eachLayer((layer) => {
          if (layer._leaflet_id === this.locationMarkerID) {
            openStreetMap.removeLayer(layer)
          }
        })
        const locate = [position.coords.latitude, position.coords.longitude]
        console.log(locate)
        openStreetMap.setView(locate, 15)
        document.querySelector('.gps-icon').classList.add('active')
        const marker = $L.marker([position.coords.latitude, position.coords.longitude], { icon: positionIcon })
        marker.addTo(openStreetMap)
        this.locationMarkerID = marker._leaflet_id
      })
    },
    getAllStationFromCity () {
      const url = `https://ptx.transportdata.tw/MOTC/v2/Bus/Station/City/${this.city}?$select=StationName&$format=JSON`
      this.axios.get(url,
        {
          headers: this.$getAuthorizationHeader()
        }
      )
        .then((response) => {
          // console.log(response.data)
          this.optiondata = response.data.map((x) => { return x.StationName.Zh_tw })
          this.optiondata = this.optiondata.filter((value, index, array) => array.indexOf(value) === index)
          this.getStationData()
        })
        .catch((err) => {
          console.log(err)
        })
    },
    getStationData () {
      const url = `https://ptx.transportdata.tw/MOTC/v2/Bus/Station/City/${this.city}?$filter=StationName%2FZh_tw%20eq%20'${this.selectStationName}'&$format=JSON`
      this.axios.get(url,
        {
          headers: this.$getAuthorizationHeader()
        }
      )
        .then((response) => {
          this.selectStationData = response.data
          const tempArr = []
          response.data.forEach((x) => {
            tempArr.push(x.Stops.map((x) => { return x.RouteUID }))
          })
          this.selectStationRouteID = [].concat(...tempArr)
          this.selectStationRouteID = this.selectStationRouteID.filter((value, index, array) => array.indexOf(value) === index)
          console.log(this.selectStationRouteID)
          this.getRouteData()
        })
        .catch((err) => {
          console.log(err)
        })
    },
    getRouteData () {
      // console.log(this.selectStationName)
      const url = `https://ptx.transportdata.tw/MOTC/v2/Bus/Route/City/${this.city}?$format=JSON`
      this.axios.get(url,
        {
          headers: this.$getAuthorizationHeader()
        }
      )
        .then((response) => {
          // console.log(response.data)
          this.selectRouteData = response.data.filter((x) => {
            if (this.selectStationRouteID.includes(x.RouteUID)) return x
          })
          console.log(this.selectRouteData)
        })
        .catch((err) => {
          console.log(err)
        })
    },
    toRouteDetail (item) {
      console.log(item)
      if (event.target.tagName !== 'SPAN') {
        const param = {
          city: item.City,
          route: item.RouteName.Zh_tw,
          routeUID: item.RouteUID,
          direction: 0,
          LatLon: [this.selectStationData[0].StationPosition.PositionLat, this.selectStationData[0].StationPosition.PositionLon]
        }
        const qStr = JSON.stringify(param)
        this.$router.push(`/BusSearch/${qStr}`)
      }
    },
    getLikes () {
      // console.log(localStorage.getItem('likelist'))
      const likeStr = localStorage.getItem('busLikes') ? localStorage.getItem('busLikes') : '[]'
      this.buslikes = JSON.parse(likeStr)
      this.buslikesId = this.buslikes.map(x => { return x.routeUID })
      console.log(this.buslikesId)
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
          city: router.City
        })
        this.buslikesId.push(router.RouteUID)
        this.$httpMessageState(res, '加入收藏')
      }
      // console.log(this.buslikes)
    },
    saveLocalStorage (data) {
      const datastr = JSON.stringify(data)
      try {
        localStorage.setItem('busLikes', datastr)
      } catch (e) {
        return false
      }
    }
  },
  watch: {
    buslikes: {
      handler (n, o) {
        this.saveLocalStorage(this.buslikes)
      },
      deep: true
    }
  },
  mounted () {
    // quick start
    openStreetMap = $L.map('map', {
      zoomControl: false,
      center: [25.0834397, 121.4570441],
      zoom: 13,
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
    this.locateGPS()
    this.getLikes()
    this.getAllStationFromCity()
  }
}
</script>
