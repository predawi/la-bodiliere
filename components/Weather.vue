<script setup>
// https://api.openweathermap.org/data/2.5/weather?lat=48.86&lon=2.33&appid=f73745784e795cd4021c77af6ee58498

const { data, pending, error, refresh } = await useFetch('https://api.openweathermap.org/data/2.5/weather?lat=49.92&lon=1.07&appid=f73745784e795cd4021c77af6ee58498')
const rawData = data._rawValue;
const weatherIcon = "https://openweathermap.org/img/wn/" + rawData.weather[0].icon + "@2x.png";
</script>

<template>
  <div class="mt-5 md:mt-0 md:ml-5 md:flex-1 min-w-60 md:max-w-60">
    <h2 class="mb-6 md:flex items-center md:text-xl">
      Météo
    </h2>

    <div class="w-full rounded-md border border-bodil-500 flex flex-col relative bg-white px-5">
      <div class="p-4 text-center">
        <div class="space-y-2">
          <h2 class="font-bold">{{ rawData.name }}</h2>
          <img :src=weatherIcon alt="" width="100" height="100" class="w-15 h-15 mx-auto">
          <div class="capitalize">{{ rawData.weather[0].description }}</div>
          <div class="flex items-center justify-center">
            <IconsTemp class="mr-2" /> Temp: {{ Math.round((rawData.main.temp - 273.15)) }}°c
          </div>
          <div class="flex items-center justify-center">
            <IconsTempFeel class="mr-2" /> Feel: {{ Math.round((rawData.main.feels_like - 273.15)) }}°c
          </div>
          <div class="flex items-center justify-center text-blue-800">
            <IconsDrop class="mr-2" /> Humidity {{ rawData.main.humidity }}%
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss"></style>