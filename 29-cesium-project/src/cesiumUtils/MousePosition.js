import * as Cesium from 'cesium'
export default class MousePosition {
    constructor(viewer) {
        this.divDom = document.createElement("div");
        this.divDom.style.cssText = `
            position: fixed;
            bottom: 50px;
            right: 0;
            width: 200px;
            height: 50px;
            background: rgba(0, 0, 0, 0.5);
            color: #fff;
            font-size: 12px;
            line-height: 50px;
            text-align: center;
            z-index: 999;
        `
        document.body.appendChild(this.divDom)
        // 监听鼠标的移动事件
        const handle = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)

        handle.setInputAction((movement) => {
            // 获取鼠标的位置,获取经纬度坐标
            let cartesian = viewer.camera.pickEllipsoid(movement.endPosition, viewer.scene.globe.ellipsoid)
            if (cartesian) {
                // 获取经纬度
                let cartographic = Cesium.Cartographic.fromCartesian(cartesian)
                let longitudeString = Cesium.Math.toDegrees(cartographic.longitude)
                let latitudeString = Cesium.Math.toDegrees(cartographic.latitude)
                // const heightString = cartographic.height
                this.divDom.innerHTML = `经度：${longitudeString.toFixed(2)}  纬度：${latitudeString.toFixed(2)}`
            }
            // console.log(longitudeString, latitudeString);
            // 设置文字
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
    }
}
