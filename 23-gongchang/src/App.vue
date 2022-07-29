<template>
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </nav>
  <router-view />
</template>

<style lang="less">
* {
  margin: 0;
  padding: 0;
}
ul,
li {
  list-style: none;
}

html {
  font-size: calc(100vw / 19.2);
}

body {
  font-size: 16px;
}

.cssrender {
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  pointer-events: none;
}

.elementTag {
  position: relative;
  left: -30px;
  top: 20px;
}
.elementTag::before {
  content: "";
  display: block;
  position: absolute;
  width: 100px;
  height: 1px;
  background: rgb(127 177 255 / 75%);
  bottom: 0;
  right: -100px;
  transform-origin: 0 0;
  transform: rotate(30deg);
}
.elementTag::after {
  content: "";
  display: block;
  position: absolute;
  width: 20px;
  height: 20px;
  background: rgb(127 177 255 / 75%);
  bottom: -65px;
  right: -105px;
  border-radius: 50%;
}

.elementContent {
  background-color: rgb(20 143 221 / 68%);
  box-shadow: 0px 0px 12px rgb(0 128 255 / 75%);
  border: 1px solid rgb(127 177 255 / 75%);
  padding: 20px;

  color: #efefef;
}

.elementContent h1 {
  font-size: 20px;
  font-weight: bold;
  margin: 15px 0;
  color: #efefef;
}
</style>
