<template>
    <div id="bigScreen">
        <div class="header">3D城市</div>
        <div class="main">
            <div class="left">
                <div class="cityEvent" v-for="(item, key) in props.dataInfo">
                    <h3>
                        <span>{{ item.name }}</span>
                    </h3>
                    <h1>
                        <img src="../assets/bg/bar.svg" class="icon" />
                        <span
                            >{{ toFixInt(item.number) }}（{{
                                item.unit
                            }}）</span
                        >
                    </h1>
                    <div class="footerBoder"></div>
                </div>
            </div>
            <div class="right">
                <div class="cityEvent list">
                    <h3>
                        <span>事件列表</span>
                    </h3>
                    <ul>
                        <li
                            v-for="(item, i) in props.eventList"
                            :class="{ active: currentActive == i }"
                            @click="toggleEvent(i)"
                            :key="i"
                        >
                            <h1>
                                <div>
                                    <img class="icon" :src="imgs[item.name]" />
                                    <span> {{ item.name }} </span>
                                </div>
                                <span class="time"> {{ item.time }} </span>
                            </h1>
                            <p>{{ item.type }}</p>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import eventHub from "@/utils/eventHub";
import { ref } from "vue";
const props = defineProps(["dataInfo", "eventList"]);
const imgs = {
    电力: require("@/assets/bg/dianli.svg"),
    火警: require("@/assets/bg/fire.svg"),
    治安: require("@/assets/bg/jingcha.svg"),
};

const toFixInt = (num) => {
    return num.toFixed(0);
};

const currentActive = ref(null);
eventHub.on("spriteClick", (data) => {
    // console.log(data);
    currentActive.value = data.i;
});

const toggleEvent = (i) => {
    currentActive.value = i;
    eventHub.emit("eventToggle", i);
};
</script>

<style scoped>
#bigScreen {
    width: 100vw;
    height: 100vh;
    position: fixed;
    z-index: 100;

    left: 0;
    top: 0;
    pointer-events: none;
    display: flex;
    flex-direction: column;
}

.header {
    /* width: 1920px;
        height: 100px; */

    width: 19.2rem;
    height: 1rem;
    background-image: url(@/assets/bg/title.png);
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    text-align: center;
    color: rgb(226, 226, 255);
    font-size: 0.4rem;
}

.main {
    flex: 1;
    width: 19.2rem;
    display: flex;
    justify-content: space-between;
}

.left {
    width: 4rem;
    /* background-color: rgb(255,255,255,0.5); */
    background-image: url(@/assets/bg/line_img.png);
    background-repeat: no-repeat;
    background-size: contain;
    background-position: right center;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0.4rem 0;
}

.right {
    width: 4rem;
    /* background-color: rgb(255,255,255,0.5); */
    background-image: url(@/assets/bg/line_img.png);
    background-repeat: no-repeat;
    background-size: contain;
    background-position: left center;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0.4rem 0;
}

.cityEvent {
    position: relative;
    width: 3.5rem;
    /* height: 3rem; */
    margin-bottom: 0.5rem;
    background-image: url(@/assets/bg/bg_img03.png);
    background-repeat: repeat;
}

.cityEvent::before {
    width: 0.4rem;
    height: 0.4rem;
    position: absolute;
    left: 0;
    top: 0;
    border-top: 4px solid rgb(34, 133, 247);
    border-left: 4px solid rgb(34, 133, 247);
    content: "";
    display: block;
}

.cityEvent::after {
    width: 0.4rem;
    height: 0.4rem;
    position: absolute;
    right: 0;
    top: 0;
    border-top: 4px solid rgb(34, 133, 247);
    border-right: 4px solid rgb(34, 133, 247);
    content: "";
    display: block;
}
.footerBorder {
    position: absolute;
    bottom: 0;
    bottom: 0;
    width: 3.5rem;
    height: 0.4rem;
}
.footerBorder::before {
    width: 0.4rem;
    height: 0.4rem;
    position: absolute;
    left: 0;
    top: 0;
    border-bottom: 4px solid rgb(34, 133, 247);
    border-left: 4px solid rgb(34, 133, 247);
    content: "";
    display: block;
}

.footerBorder::after {
    width: 0.4rem;
    height: 0.4rem;
    position: absolute;
    right: 0;
    top: 0;
    border-bottom: 4px solid rgb(34, 133, 247);
    border-right: 4px solid rgb(34, 133, 247);
    content: "";
    display: block;
}

.icon {
    width: 40px;
    height: 40px;
}

h1 {
    color: #fff;
    display: flex;
    align-items: center;
    padding: 0 0.3rem 0.3rem;
    justify-content: space-between;
    font-size: 0.3rem;
}
h3 {
    color: #fff;
    display: flex;
    align-items: center;
    padding: 0.3rem 0.3rem;
}

h1 > div {
    display: flex;
    align-items: center;
}
h1 span.time {
    font-size: 0.2rem;
    font-weight: normal;
}

.cityEvent li > p {
    color: #eee;
    padding: 0rem 0.3rem 0.3rem;
}
.list h1 {
    padding: 0.1rem 0.3rem;
}
.cityEvent.list ul {
    pointer-events: auto;
    cursor: pointer;
}

.cityEvent li.active h1 {
    color: red;
}
.cityEvent li.active p {
    color: red;
}

ul,
li {
    list-style: none;
}
</style>
