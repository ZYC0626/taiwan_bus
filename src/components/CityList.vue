<template>
  <div class="cityList">
    <div class="row">
      <div class="col-lg-2 col-md-4 col-6 mb-3">
        <div class="cityItem"
        @click="busSearch(createParam('Taipei'))">
          <img src="@/assets/images/carbon_bus.svg" class="busLogo" alt="bus logo">
          <div class="title">台北市</div>
          <div class="title_en">Taipei</div>
        </div>
      </div>
      <div class="col-lg-2 col-md-4 col-6 mb-3">
        <div class="cityItem cityItem-color-1"
        @click="busSearch(createParam('NewTaipei'))">
          <img src="@/assets/images/carbon_bus.svg" class="busLogo" alt="bus logo">
          <div class="title">新北市</div>
          <div class="title_en">NewTaipei</div>
        </div>
      </div>
      <div class="col-lg-2 col-md-4 col-6 mb-3">
        <div class="cityItem cityItem-color-2"
        @click="busSearch(createParam('Taoyuan'))">
          <img src="@/assets/images/carbon_bus.svg" class="busLogo" alt="bus logo">
          <div class="title">桃園市</div>
          <div class="title_en">Taoyuan</div>
        </div>
      </div>
      <div class="col-lg-2 col-md-4 col-6 mb-3">
        <div class="cityItem cityItem-color-3"
        @click="busSearch(createParam('Taichung'))">
          <img src="@/assets/images/carbon_bus.svg" class="busLogo" alt="bus logo">
          <div class="title">臺中市</div>
          <div class="title_en">Taichung</div>
        </div>
      </div>
      <div class="col-lg-2 col-md-4 col-6 mb-3">
        <div class="cityItem cityItem-color-4"
        @click="busSearch(createParam('Tainan'))">
          <img src="@/assets/images/carbon_bus.svg" class="busLogo" alt="bus logo">
          <div class="title">臺南市</div>
          <div class="title_en">Tainan</div>
        </div>
      </div>
      <div class="col-lg-2 col-md-4 col-6 mb-3">
        <div class="cityItem cityItem-color-5"
        @click="busSearch(createParam('Kaohsiung'))">
          <img src="@/assets/images/carbon_bus.svg" class="busLogo" alt="bus logo">
          <div class="title">高雄市</div>
          <div class="title_en">Kaohsiung</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
    }
  },
  methods: {
    busSearch (city) {
      this.$router.push(`/BusSearch/${city}`)
    },
    createParam (city) {
      const param = {
        city: city
      }
      // return JSON.stringify(param)
      return encodeURIComponent(JSON.stringify(param))
    }
  }
}
</script>
