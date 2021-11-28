<template>
  <div class="h-100 d-flex flex-column">
    <div class="bread-bar d-flex justify-content-between">
      <ol class="breadcrumb m-0">
        <li class="breadcrumb-item"><a href="#">首頁</a></li>
        <li class="breadcrumb-item active" aria-current="page">附近站牌</li>
      </ol>
      <div class="mobile-control-bar  d-flex d-md-none">
        <div class="tool">
          <div class="map" :class="{ active: mobileTool === 'map' }"
          @click="showArea('map')">
            <i class="bi bi-pin-map me-1"></i>地圖
          </div>
          <div class="time" :class="{ active: mobileTool === 'time' }" v-if="EstimateNearList.length > 0"
          @click="showArea('time')">
            <i class="bi bi-clock me-1"></i>預估時間
          </div>
          <div class="route" :class="{ active: mobileTool === 'station' }"
          @click="showArea('station')">
            <i class="bi bi-map me-1"></i>站牌
          </div>
        </div>
      </div>
    </div>
    <div class="map-wrap">
      <div class="near-station-area active">
        <div class="near-station-header">
          <!-- <input type="search" class="form-control" id="stationName" placeholder="想去哪裡?"> -->
        </div>
        <div class="near-station-body">
          <ul class="near-station-list">
            <li class="near-station-list-item" v-for="item in nearStationList" :key="item.StationID"
            @click="getNearStaionDetail(item)"
            :class="{ active : item.StationUID === selectStationUID }">
              <div class="info">
                <div class="tilte">{{ item.StationName.Zh_tw }}</div>
                <div class="stops">{{ item.Stops.length }} 個站牌</div>
              </div>
              <div class="distance">
                <span class="material-icons">
                location_on
                </span>
                {{ item.distanceFromLocation }}m
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="estimate-near-area">
        <a href="#" class="return"
        @click.prevent="backToNearStationList()">
        <span class="material-icons">chevron_left</span>
        返回搜尋</a>
        <div class="estimate-near-header">
          <div class="title">
            {{ selectStationName }}
          </div>
        </div>
        <div class="estimate-near-body">
          <ul class="estimate-near-list">
            <li class="estimate-near-list-item" v-for="item in EstimateNearList" :key="item.StopUID">
              <!-- <div class="time">{{ $filters.toMinute(item.EstimateTime) }} 分</div> -->
              <div class="time" :class="{ active : item.EstimateTime <= 180 , 'disconnect': item.StopStatus !== 0}">
                <span v-if="item.StopStatus === 0">
                  <span v-if="item.EstimateTime <= 180 && item.PlateNumb">進站中</span>
                  <span v-else-if="item.EstimateTime <= 180">即將進站</span>
                  <span v-else>{{  $filters.toMinute(item.EstimateTime) }}分</span>
                </span>
                <span v-else-if="item.StopStatus === 1">尚未發車</span>
                <span v-else-if="item.StopStatus === 2">交管不停靠</span>
                <span v-else-if="item.StopStatus === 3">末班車已過</span>
                <span v-else>今日未營運</span>
              </div>
              <div class="info">
                <div class="title">{{ item.RouteName.Zh_tw }}</div>
                <div class="way" v-if="item.Direction === 0">往 {{ item.DestinationStopNameZh }}</div>
                <div class="way" v-else>往 {{ item.DepartureStopNameZh  }}</div>
              </div>
              <div class="icon ms-auto">
                <a><span class="material-icons">
                favorite_border
                </span></a>
                {{ item.City }}
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
// import Wkt from 'wicket'
let openStreetMap = {}

const stationIcon = new $L.Icon({
  iconUrl: require('@/assets/images/busStop.svg'),
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12]
})
const stationSelectIcon = new $L.Icon({
  iconUrl: require('@/assets/images/bus_stop_select.svg'),
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

export default {
  data () {
    return {
      locationMarkerID: '',
      nearStationList: [],
      stationMarkers: [],
      lastSelectLatLon: [0, 0],
      EstimateNearList: [],
      selectStationName: '',
      selectStationUID: '',
      mobileTool: 'station'
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
        // console.log(locate)
        openStreetMap.setView(locate, 15)
        document.querySelector('.gps-icon').classList.add('active')
        const marker = $L.marker([position.coords.latitude, position.coords.longitude], { icon: positionIcon })
        marker.addTo(openStreetMap)
        this.locationMarkerID = marker._leaflet_id
        this.getNearbyStation(position.coords.latitude, position.coords.longitude)
      })
    },
    getNearbyStation (Lat, Lon) {
      const url = 'https://ptx.transportdata.tw/MOTC/v2/Bus/Station/NearBy?$spatialFilter=nearby(25.0544128%2C%20121.454592%2C%201000)&$format=JSON'
      // https://ptx.transportdata.tw/MOTC/v2/Bus/EstimatedTimeOfArrival/City/Taipei/PassThrough/Station/3505?$top=30&$format=JSON
      this.axios.get(url,
        {
          headers: this.$getAuthorizationHeader()
        }
      )
        .then((response) => {
          // console.log(response.data)
          this.nearStationList = response.data
          this.nearStationList.forEach((x) => {
            const distance = openStreetMap.distance([Lat, Lon], [x.StationPosition.PositionLat, x.StationPosition.PositionLon])
            x.distanceFromLocation = Math.floor(distance)
          })
          this.nearStationList.sort((a, b) => {
            return a.distanceFromLocation - b.distanceFromLocation
          })
          this.addNearStationMarker()
        })
        .catch((err) => {
          console.log(err)
        })
    },
    addNearStationMarker () {
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
      this.nearStationList.forEach((x, index) => {
        const popupContent = this.createPopupContent(x)
        const popup = $L.popup({
          autoPan: false,
          className: popupContent.status,
          offset: [0, -5]
        })
        popup.setLatLng($L.latLng(x.StationPosition.PositionLat, x.StationPosition.PositionLon))
        popup.setContent(popupContent.str)
        const marker = $L.marker([x.StationPosition.PositionLat, x.StationPosition.PositionLon], { icon: stationIcon })
          .bindPopup(popup)
        marker.addTo(openStreetMap)
        // console.log()
        // for select
        x.markerID = marker._leaflet_id
        this.stationMarkers.push(marker)
      })
    },
    getNearStaionDetail (item) {
      // console.log(Lat, Lng)
      openStreetMap.setView([item.StationPosition.PositionLat, item.StationPosition.PositionLon], 18)
      this.stationMarkers.forEach((x) => {
        if (x._latlng.lat === this.lastSelectLatLon[0] && x._latlng.lng === this.lastSelectLatLon[1]) {
          x.setIcon(stationIcon)
        }
      })
      this.stationMarkers.forEach((x) => {
        if (x._latlng.lat === item.StationPosition.PositionLat && x._latlng.lng === item.StationPosition.PositionLon) {
          x.setIcon(stationSelectIcon)
          this.lastSelectLatLon = [x._latlng.lat, x._latlng.lng]
        }
      })
      openStreetMap.eachLayer((layer) => {
        if (layer._leaflet_id !== this.locationMarkerID) {
          if (layer instanceof $L.Popup) {
            openStreetMap.removeLayer(layer)
          }
        }
      })
      const popupContent = this.createPopupContent(item)
      const popup = $L.popup({
        autoPan: false,
        className: 'popupSelect',
        offset: [0, -5]
      })
      popup.setLatLng($L.latLng(item.StationPosition.PositionLat, item.StationPosition.PositionLon))
      popup.setContent(popupContent.str)
      openStreetMap.addLayer(popup)

      this.getEstimatedTimeOfArrival(item)
      document.querySelector('.near-station-area').classList.remove('active')
      document.querySelector('.estimate-near-area').classList.add('active')
      if (window.innerWidth < 768) {
        // this.showArea('map')
      }
    },
    zoomLevelAddMarker () {
      const zoomLevel = openStreetMap.getZoom()
      // console.log(zoomLevel)
      if (zoomLevel <= 16) {
        this.addNearStationMarker()
      } else {
        openStreetMap.eachLayer((layer) => {
          if (layer._leaflet_id !== this.locationMarkerID) {
            if (layer instanceof $L.Popup) {
              openStreetMap.removeLayer(layer)
            }
          }
        })
        this.nearStationList.forEach((x, index) => {
          const popupContent = this.createPopupContent(x)
          const popup = $L.popup({
            autoPan: false,
            className: popupContent.status,
            offset: [0, -5]
          })
          popup.setLatLng($L.latLng(x.StationPosition.PositionLat, x.StationPosition.PositionLon))
          popup.setContent(popupContent.str)
          openStreetMap.addLayer(popup)
        })
      }
    },
    createPopupContent (x) {
      const statusCode = 'popupPrimary'
      const str = `
      <div class="stop-popup">
        <div class="name">${x.StationName.Zh_tw}</div>
      </div>
      `
      return {
        str: str,
        status: statusCode
      }
    },
    getEstimatedTimeOfArrival (item) {
      this.EstimateNearList = []
      const url = `https://ptx.transportdata.tw/MOTC/v2/Bus/EstimatedTimeOfArrival/NearBy?$spatialFilter=nearby(${item.StationPosition.PositionLat}%2C%20${item.StationPosition.PositionLon}%2C%201000)&$format=JSON`
      this.axios.get(url,
        {
          headers: this.$getAuthorizationHeader()
        }
      )
        .then((response) => {
          // console.log(response.data)
          item.Stops.forEach((stop) => {
            response.data.forEach((x) => {
              if (stop.StopUID === x.StopUID) {
                // console.log(x.RouteName.Zh_tw)
                this.EstimateNearList.push(x)
              }
            })
          })
          // console.log(this.EstimateNearList)
          this.getRouteInfo(item)
        })
        .catch((err) => {
          console.log(err)
        })
    },
    getRouteInfo (item) {
      const url = `https://ptx.transportdata.tw/MOTC/v2/Bus/Route/NearBy?$spatialFilter=nearby(${item.StationPosition.PositionLat}%2C%20${item.StationPosition.PositionLon}%2C%201000)&$format=JSON`
      this.axios.get(url,
        {
          headers: this.$getAuthorizationHeader()
        }
      )
        .then((response) => {
          // console.log(response.data)
          this.EstimateNearList.forEach((stop) => {
            response.data.forEach((x) => {
              if (stop.RouteUID === x.RouteUID) {
                // console.log(x.RouteName.Zh_tw)
                stop.DepartureStopNameZh = x.DepartureStopNameZh
                stop.DestinationStopNameZh = x.DestinationStopNameZh
                stop.City = x.City
              }
            })
          })
          this.EstimateNearList.sort((a, b) => {
            return a.RouteName.Zh_tw - b.RouteName.Zh_tw
          })
          console.log(this.EstimateNearList)
          this.selectStationName = item.StationName.Zh_tw
          this.selectStationUID = item.StationUID
        })
        .catch((err) => {
          console.log(err)
        })
    },
    backToNearStationList () {
      document.querySelector('.near-station-area').classList.add('active')
      document.querySelector('.estimate-near-area').classList.remove('active')
    },
    showArea (area) {
      if (area === 'map') {
        this.mobileTool = 'map'
        document.querySelector('.near-station-area').classList.remove('active')
        document.querySelector('.estimate-near-area').classList.remove('active')
      } else if (area === 'station') {
        this.mobileTool = 'station'
        document.querySelector('.near-station-area').classList.add('active')
        document.querySelector('.estimate-near-area').classList.remove('active')
      } else if (area === 'time') {
        this.mobileTool = 'time'
        document.querySelector('.near-station-area').classList.remove('active')
        document.querySelector('.estimate-near-area').classList.add('active')
      }
    }
  },
  mounted () {
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
    this.locateGPS()
  }
}
</script>
