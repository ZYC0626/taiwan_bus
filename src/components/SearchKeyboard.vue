<template>
  <div class="route-search-keyboard">
    <div class="keyboard-content-taipei" v-if="city === 'Taipei' || city === 'NewTaipei'">
      <button class="btn keyboard-btn red" @click="inputPrefix('紅')">紅</button>
      <button class="btn keyboard-btn blue" @click="inputPrefix('藍')">藍</button>
      <button class="btn keyboard-btn" @click="inputNumber('1')">1</button>
      <button class="btn keyboard-btn" @click="inputNumber('2')">2</button>
      <button class="btn keyboard-btn" @click="inputNumber('3')">3</button>
      <button class="btn keyboard-btn green" @click="inputPrefix('綠')">綠</button>
      <button class="btn keyboard-btn brown" @click="inputPrefix('棕')">棕</button>
      <button class="btn keyboard-btn" @click="inputNumber('4')">4</button>
      <button class="btn keyboard-btn" @click="inputNumber('5')">5</button>
      <button class="btn keyboard-btn" @click="inputNumber('6')">6</button>
      <button class="btn keyboard-btn orange" @click="inputPrefix('橘')">橘</button>
      <button class="btn keyboard-btn yellow" @click="inputPrefix('黃')">黃</button>
      <button class="btn keyboard-btn" @click="inputNumber('7')">7</button>
      <button class="btn keyboard-btn" @click="inputNumber('8')">8</button>
      <button class="btn keyboard-btn" @click="inputNumber('9')">9</button>
      <button class="btn keyboard-btn secondary" @click="inputPrefix('F')">F</button>
      <button class="btn keyboard-btn secondary" @click="inputPrefix('小')">小</button>
      <button class="btn keyboard-btn other" @click="showMoreArea()">其他</button>
      <button class="btn keyboard-btn" @click="inputNumber('0')">0</button>
      <button class="btn keyboard-btn" @click="clearInput()">清除</button>
      <div class="keyboard-moreArea">
        <button class="btn keyboard-btn other" @click="showMoreArea()">返回</button>
        <button class="btn keyboard-btn secondary" @click="inputPrefix('幹線')">幹線</button>
        <button class="btn keyboard-btn secondary" @click="inputPrefix('跳蛙')">跳蛙</button>
        <button class="btn keyboard-btn secondary" @click="inputPrefix('南軟')">南軟</button>
        <button class="btn keyboard-btn secondary" @click="inputPrefix('內科')">內科</button>
        <button class="btn keyboard-btn secondary" @click="inputPrefix('市民')">市民</button>
        <button class="btn keyboard-btn secondary" @click="inputPrefix('花季')">花季</button>
        <button class="btn keyboard-btn secondary" @click="inputPrefix('貓空')">貓空</button>
      </div>
    </div>
    <div class="keyboard-content-taipei" v-else-if="city === 'Tainan'">
      <button class="btn keyboard-btn red" @click="inputPrefix('紅')">紅</button>
      <button class="btn keyboard-btn blue" @click="inputPrefix('藍')">藍</button>
      <button class="btn keyboard-btn" @click="inputNumber('1')">1</button>
      <button class="btn keyboard-btn" @click="inputNumber('2')">2</button>
      <button class="btn keyboard-btn" @click="inputNumber('3')">3</button>
      <button class="btn keyboard-btn green" @click="inputPrefix('綠')">綠</button>
      <button class="btn keyboard-btn brown" @click="inputPrefix('棕')">棕</button>
      <button class="btn keyboard-btn" @click="inputNumber('4')">4</button>
      <button class="btn keyboard-btn" @click="inputNumber('5')">5</button>
      <button class="btn keyboard-btn" @click="inputNumber('6')">6</button>
      <button class="btn keyboard-btn orange" @click="inputPrefix('橘')">橘</button>
      <button class="btn keyboard-btn yellow" @click="inputPrefix('黃')">黃</button>
      <button class="btn keyboard-btn" @click="inputNumber('7')">7</button>
      <button class="btn keyboard-btn" @click="inputNumber('8')">8</button>
      <button class="btn keyboard-btn" @click="inputNumber('9')">9</button>
      <button class="btn keyboard-btn secondary" @click="inputPrefix('H')">H</button>
      <button class="btn keyboard-btn secondary" @click="inputPrefix('雙層')">雙層</button>
      <button class="btn keyboard-btn secondary" @click="inputPrefix('幹線')">幹線</button>
      <button class="btn keyboard-btn" @click="inputNumber('0')">0</button>
      <button class="btn keyboard-btn" @click="clearInput()">清除</button>
    </div>
    <div class="keyboard-content-taipei" v-else-if="city === 'Kaohsiung'">
      <button class="btn keyboard-btn red" @click="inputPrefix('紅')">紅</button>
      <button class="btn keyboard-btn secondary" @click="inputPrefix('JOY')">JOY</button>
      <button class="btn keyboard-btn" @click="inputNumber('1')">1</button>
      <button class="btn keyboard-btn" @click="inputNumber('2')">2</button>
      <button class="btn keyboard-btn" @click="inputNumber('3')">3</button>
      <button class="btn keyboard-btn orange" @click="inputPrefix('橘')">橘</button>
      <button class="btn keyboard-btn secondary" @click="inputPrefix('幹線')">幹線</button>
      <button class="btn keyboard-btn" @click="inputNumber('4')">4</button>
      <button class="btn keyboard-btn" @click="inputNumber('5')">5</button>
      <button class="btn keyboard-btn" @click="inputNumber('6')">6</button>
      <button class="btn keyboard-btn yellow" @click="inputPrefix('黃')">黃</button>
      <button class="btn keyboard-btn secondary" @click="inputPrefix('觀光')">觀光</button>
      <button class="btn keyboard-btn" @click="inputNumber('7')">7</button>
      <button class="btn keyboard-btn" @click="inputNumber('8')">8</button>
      <button class="btn keyboard-btn" @click="inputNumber('9')">9</button>
      <button class="btn keyboard-btn secondary" @click="inputPrefix('T')">T</button>
      <button class="btn keyboard-btn secondary" @click="inputPrefix('E')">E</button>
      <button class="btn keyboard-btn secondary" @click="showMoreArea()">其他</button>
      <button class="btn keyboard-btn" @click="inputNumber('0')">0</button>
      <button class="btn keyboard-btn" @click="clearInput()">清除</button>
      <div class="keyboard-moreArea">
        <button class="btn keyboard-btn other" @click="showMoreArea()">返回</button>
        <button class="btn keyboard-btn secondary" @click="inputPrefix('大湖')">大湖</button>
        <button class="btn keyboard-btn secondary" @click="inputPrefix('燕巢')">燕巢</button>
        <button class="btn keyboard-btn secondary" @click="inputPrefix('永安')">永安</button>
        <button class="btn keyboard-btn secondary" @click="inputPrefix('鼓山')">鼓山</button>
        <button class="btn keyboard-btn secondary" @click="inputPrefix('大寮')">大寮</button>
      </div>
    </div>
    <div class="keyboard-content" v-else>
      <button class="btn keyboard-btn" @click="inputNumber('1')">1</button>
      <button class="btn keyboard-btn" @click="inputNumber('2')">2</button>
      <button class="btn keyboard-btn" @click="inputNumber('3')">3</button>
      <button class="btn keyboard-btn" @click="inputNumber('4')">4</button>
      <button class="btn keyboard-btn" @click="inputNumber('5')">5</button>
      <button class="btn keyboard-btn" @click="inputNumber('6')">6</button>
      <button class="btn keyboard-btn" @click="inputNumber('7')">7</button>
      <button class="btn keyboard-btn" @click="inputNumber('8')">8</button>
      <button class="btn keyboard-btn" @click="inputNumber('9')">9</button>
      <button class="btn keyboard-btn other" @click="inputPrefix('專用道')" v-if="city === 'Taichung'">專用道</button>
      <button class="btn keyboard-btn other" @click="inputPrefix('L')" v-else>L</button>
      <button class="btn keyboard-btn" @click="inputNumber('0')">0</button>
      <button class="btn keyboard-btn" @click="clearInput()">清除</button>
    </div>
  </div>
</template>
<script>

export default {
  name: 'keyboard',
  props: [
    'city'
  ],
  data () {
    return {
      currentStr: ''
    }
  },
  methods: {
    inputNumber (value) {
      this.currentStr += value
    },
    inputPrefix (value) {
      this.currentStr = ''
      this.currentStr += value
    },
    clearInput () {
      this.currentStr = ''
    },
    showMoreArea () {
      document.querySelector('.keyboard-moreArea').classList.toggle('active')
    }
  },
  watch: {
    currentStr () {
      // console.log(this.currentStr)
      this.$emit('emit-input', this.currentStr)
    }
  },
  mounted () {
    console.log(this.city)
  },
  created () {
  }
}
</script>
