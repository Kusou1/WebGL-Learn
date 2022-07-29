<template>
  <router-view />
</template>

<style lang="less">
* {
  margin: 0;
  padding: 0;
}
html {
  // 100vw == 1920px
  // x == 100px
  font-size: calc(100vw / 19.2);
}
body {
  font-size: 16px;
}

// 1rem = 100px
// 19.2rem = 1920px
</style>
