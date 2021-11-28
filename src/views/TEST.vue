<template>
  <div class="container py-4">
    <div class="row">
      <div class="col-4">
        <label for="cityOption" class="form-label mt-3">縣市選擇</label>
        <select class="form-select" id="cityOption"
        v-model="citySeleceted"
        @change="getRoute()">
          <option
          :value="item.City"
          v-for="item in cityList" :key="item.CityID"
          >{{ item.CityName }}</option>
        </select>
        <label for="routeNumber" class="form-label mt-3">輸入車牌</label>
        <input type="search" class="form-control" id="routeNumber" placeholder="請輸入站牌"
        v-model="routeKeyword"
        @keyup="getRoute()">
        <!-- <button type="button" class="btn btn-primary mt-3"
        @click="searchRoute()">search</button> -->
        <div class="search-result mt-3">
          <h3>站牌列表</h3>
          <ul class="p-0" style="list-style: none;">
            <li v-for="route in routeList" :key="route.RouteID"
            @click="getSelectedRoute(route.RouteName.Zh_tw, route.RouteUID)">
              <div class="p-2 border border-primary rounded-3 mb-1">
                <h6>{{ route.RouteName.Zh_tw }}</h6>
                <span>{{ route.DepartureStopNameZh }} > {{ route.DestinationStopNameZh }}</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="col-8">
        <div class="d-flex py-3">
          <button type="button" class="ms-auto btn btn-primary"
          @click="getStopOfRoute(selectRouteName, selectRouteUID)">refresh</button>
        </div>
        <ul class="nav nav-tabs" role="tablist">
          <li class="nav-item" role="presentation">
            <button class="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#go" type="button" role="tab" aria-controls="home" aria-selected="true">去</button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#back" type="button" role="tab" aria-controls="profile" aria-selected="false">返</button>
          </li>
        </ul>
        <div class="tab-content py-3" id="myTabContent">
          <div class="tab-pane fade show active" id="go" role="tabpanel">
            <ul class="p-0" style="list-style: none;">
              <li v-for="stop in stopOfRouteTo" :key="stop.StopUID">
                <div class="p-2 border border-primary rounded-3 mb-1">
                  <h6>{{ stop.StopName.Zh_tw }}</h6>
                  <div class="row">
                    <div class="col-6">
                      <span v-if="stop.StopStatus === 0">{{ stop.EstimateTime }}</span>
                      <span v-else-if="stop.StopStatus === 1">尚未發車</span>
                      <span v-else-if="stop.StopStatus === 2">交管不停靠</span>
                      <span v-else-if="stop.StopStatus === 3">末班車已過</span>
                      <span v-else>今日未營運</span>
                    </div>
                    <div class="col-6">
                      <span v-if="stop.PlateNumb">{{ stop.PlateNumb }}</span>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div class="tab-pane fade" id="back" role="tabpanel">
            <ul class="p-0" style="list-style: none;">
              <li v-for="stop in stopOfRouteBack" :key="stop.StopUID">
                <div class="p-2 border border-primary rounded-3 mb-1">
                  <h6>{{ stop.StopName.Zh_tw }}</h6>
                  <div class="row">
                    <div class="col-6">
                      <span v-if="stop.StopStatus === 0">{{ stop.EstimateTime }}</span>
                      <span v-else-if="stop.StopStatus === 1">尚未發車</span>
                      <span v-else-if="stop.StopStatus === 2">交管不停靠</span>
                      <span v-else-if="stop.StopStatus === 3">末班車已過</span>
                      <span v-else>今日未營運</span>
                    </div>
                    <div class="col-6">
                      <span v-if="stop.PlateNumb">{{ stop.PlateNumb }}</span>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      cityList: [],
      citySeleceted: '',
      routeKeyword: '',
      routeList: [],
      stopOfRouteTo: [],
      stopOfRouteBack: [],
      selectRouteName: '',
      selectRouteUID: ''
    }
  },
  methods: {
    getCity () {
      const url = 'https://gist.motc.gov.tw/gist_api/V3/Map/Basic/City?$format=JSON'
      this.axios.get(url,
        {
          headers: this.$getAuthorizationHeader()
        }
      )
        .then((response) => {
          // console.log(response.data)
          this.cityList = response.data
          this.citySeleceted = response.data[0].City
        })
        .catch((err) => {
          console.log(err)
        })
    },
    getRoute () {
      const url = `https://ptx.transportdata.tw/MOTC/v2/Bus/Route/City/${this.citySeleceted}/${this.routeKeyword}?$top=50&$format=JSON`
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
    getSelectedRoute (routeName, routeUID) {
      this.selectRouteName = routeName
      this.selectRouteUID = routeUID
      this.getStopOfRoute(this.selectRouteName, this.selectRouteUID)
    },
    getStopOfRoute (routeName, routeUID) {
      const url = `https://ptx.transportdata.tw/MOTC/v2/Bus/StopOfRoute/City/${this.citySeleceted}?$filter=RouteUID%20eq%20'${routeUID}'&$format=JSON`
      this.axios.get(url,
        {
          headers: this.$getAuthorizationHeader()
        }
      )
        .then((response) => {
          // console.log(response.data)

          response.data.forEach(x => {
            if (x.Direction === 0) {
              this.stopOfRouteTo = x.Stops
            } else if (x.Direction === 1) {
              this.stopOfRouteBack = x.Stops
            }
          })
          this.getEstimateTime(routeName, routeUID)
          // continue
        })
        .catch((err) => {
          console.log(err)
        })
    },
    getEstimateTime (routeName, routeUID) {
      const url = `https://ptx.transportdata.tw/MOTC/v2/Bus/EstimatedTimeOfArrival/City/${this.citySeleceted}/${routeName}?$filter=RouteUID%20in%20('${routeUID}')&$format=JSON`
      this.axios.get(url,
        {
          headers: this.$getAuthorizationHeader()
        }
      )
        .then((response) => {
          console.log(response.data)
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
      const url = `https://ptx.transportdata.tw/MOTC/v2/Bus/RealTimeNearStop/City/${this.citySeleceted}/${routeName}?$filter=RouteUID%20eq%20'${routeUID}'&$format=JSON`
      this.axios.get(url,
        {
          headers: this.$getAuthorizationHeader()
        }
      )
        .then((response) => {
          console.log(response.data)
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
        })
        .catch((err) => {
          console.log(err)
        })
    }
  },
  created () {
    this.getCity()
    // this.getRoute()
  }
}

</script>
