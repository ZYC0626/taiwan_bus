import cityList from '@/assets/CityList.json'

export function toMinute (second) {
  return Math.floor(second / 60)
}

export function replaceCity (city) {
  if (city) {
    // console.log(cityList[cityList.map((x) => x.City).indexOf(city)].CityName)
    return cityList[cityList.map((x) => x.City).indexOf(city)].CityName
  } else return ''
}
