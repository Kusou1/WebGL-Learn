import * as Cesium from "cesium";
export default class CenterPosition {
  constructor(viewer) {
    var divDom = document.createElement("div");
    divDom.style.position = "fixed";
    divDom.style.bottom = "0%";
    divDom.style.right = "0%";
    divDom.className = "positionDiv";
    //     background: rgba(0, 0, 0, 0.5);
    //   color: #fff;
    //   width: 200px;
    //   height: 40px;
    //   line-height: 40px;
    //   text-align: center;
    //   font-size: 12px;
    divDom.style.width = "200px";
    divDom.style.height = "40px";
    divDom.style.lineHeight = "40px";
    divDom.style.textAlign = "center";
    divDom.style.fontSize = "12px";
    divDom.style.background = "rgba(0, 0, 0, 0.5)";
    divDom.style.color = "#fff";

    document.body.appendChild(divDom);

    window.addEventListener("mousemove", () => {
      let { lon, lat } = this.getCenterPosition(viewer);
      // console.log(lon, lat);
      divDom.innerHTML = `经度：${lon.toFixed(2)}  纬度：${lat.toFixed(2)}`;
    });
  }
  getCenterPosition(viewer) {
    let centerResult = viewer.camera.pickEllipsoid(
      new Cesium.Cartesian2(
        viewer.canvas.clientWidth / 2,
        viewer.canvas.clientHeight / 2
      )
    );
    // console.log(centerResult);
    let curPosition =
      Cesium.Ellipsoid.WGS84.cartesianToCartographic(centerResult);
    let curLongitude = (curPosition.longitude * 180) / Math.PI;
    let curLatitude = (curPosition.latitude * 180) / Math.PI;
    return {
      lon: curLongitude,
      lat: curLatitude,
    };
  }
}
