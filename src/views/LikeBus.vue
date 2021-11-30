<template>
  <Loading :active="isLoading"
  :z-index="2000">
  </Loading>
  <div class="h-100 d-flex flex-column">
    <div class="bread-bar">
      <ol class="breadcrumb m-0 d-md-flex d-none">
        <li class="breadcrumb-item"><a href="#">首頁</a></li>
        <li class="breadcrumb-item active" aria-current="page">收藏站牌</li>
      </ol>
    </div>
    <div class="map-wrap">
      <div class="route-search-area active">
        <div class="route-search-header">
          <!-- <input type="search" class="form-control" id="stationName" placeholder="想去哪裡?"> -->
          <h4 class="fw-700 ms-1 mb-0">收藏站牌</h4>
        </div>
        <div class="route-search-body">
          <ul class="route-list" v-if="buslikes.length > 0">
            <li class="route-list-item" v-for="item in buslikes" :key="item.routeUID"
            @click="toRouteDetail(item)">
              <div class="d-flex justify-content-between">
                <div class="title">{{ item.routeName }}</div>
                <div class="icon">
                  <a href="#"
                  @click.prevent="updateLikes(item)">
                  <span class="material-icons love" v-if="buslikesId.includes(item.routeUID)">
                    favorite
                  </span>
                  <span class="material-icons" v-else>
                    favorite_border
                  </span>
                  </a>
                </div>
              </div>
              <div class="d-flex justify-content-between">
                <div class="od">{{ item.start }}-{{ item.end }}</div>
                <div class="city">{{ $filters.replaceCity(item.city) }}</div>
              </div>
            </li>
          </ul>
          <h5 class="fw-700 text-center" style="font-size: 18px; color:#888888;" v-else>目前還沒有收藏的站牌!<br>
          快用<span class="material-icons mx-2" style="font-size: 18px; color:#888888;">favorite_border</span>來收藏站牌吧</h5>
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
      buslikes: [],
      buslikesId: [],
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
    getLikes () {
      // console.log(localStorage.getItem('likelist'))
      const likeStr = localStorage.getItem('busLikes') ? localStorage.getItem('busLikes') : '[]'
      this.buslikes = JSON.parse(likeStr)
      this.buslikesId = this.buslikes.map(x => { return x.routeUID })
      console.log(this.buslikesId)
    },
    updateLikes (item) {
      if (this.buslikesId.includes(item.routeUID)) {
        this.buslikes.splice(this.buslikes.map(x => { return x.routeUID }).indexOf(item.routeUID), 1)
        this.buslikesId.splice(this.buslikesId.indexOf(item.routeUID), 1)
      } else {
        this.buslikes.push({
          routeUID: item.routeUID,
          routeName: item.routeName,
          start: item.start,
          end: item.end,
          city: item.city
        })
        this.buslikesId.push(item.routeUID)
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
    },
    toRouteDetail (item) {
      if (event.target.tagName !== 'SPAN') {
        console.log(item)
        const param = {
          city: item.city,
          route: item.routeName,
          routeUID: item.routeUID,
          direction: 0,
          LatLon: []
        }
        const qStr = JSON.stringify(param)
        this.$router.push(`/BusSearch/${qStr}`)
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
  }
}
</script>
