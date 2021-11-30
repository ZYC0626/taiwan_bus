<template>
  <Loading :active="isLoading"
  :z-index="2000">
  </Loading>
  <div class="h-100 d-flex flex-column">
    <div class="bread-bar">
      <ol class="breadcrumb m-0 d-md-flex d-none">
        <li class="breadcrumb-item"><a href="#">首頁</a></li>
        <li class="breadcrumb-item active" aria-current="page">附近站牌</li>
      </ol>
    </div>
    <div class="map-wrap">
      <div class="route-search-area active">
        <div class="route-search-header">
          <input type="search" class="form-control" id="stationName" placeholder="想去哪裡?">
        </div>
        <div class="route-search-body">
          <ul class="route-list">
            <!-- <li class="route-list-item" v-for="item in routeList" :key="item.RouteUID">
              <div class="d-flex justify-content-between">
                <div class="title">{{ item.RouteName.Zh_tw }}</div>
                <div class="icon">
                  <a href="#"><span class="material-icons">
                  favorite_border
                  </span></a>
                </div>
              </div>
              <div class="d-flex justify-content-between">
                <div class="od">{{ item.DepartureStopNameZh }}-{{ item.DestinationStopNameZh }}</div>
                <div class="city">{{ city }}</div>
              </div>
            </li> -->
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
      allCityStationList: [],
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
  }
}
</script>
