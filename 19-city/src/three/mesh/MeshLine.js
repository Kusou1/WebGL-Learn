import * as THREE from 'three'
export default class MeshLine {
    constructor(geometry) {
        // EdgesGeometry拿到建筑的边缘
        const edges = new THREE.EdgesGeometry(geometry)
        this.material = new THREE.LineBasicMaterial({ color: 0xffffff })
        // 
        const line = new THREE.LineSegments(edges, this.material)
        this.geometry = edges
        this.mesh = line
    }
}
