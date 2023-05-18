import * as THREE from "three";

export default class ExtrudeHelper {
  constructor(objectMap) {
    this.objectMap = objectMap;
    this.baseSettings = {
        steps: 2,
        depth: 8,
        bevelSize: 2,
        bevelThickness: 2,
        bevelOffset: 0,
        bevelSegments: 8
      };
  }

  extrudeObject(objectName, settings) {
    const paths = this.objectMap[objectName] && this.objectMap[objectName].object || [];
    const group = new THREE.Group();

    for (const path of paths) {
      const material = new THREE.MeshStandardMaterial({
        color: path.color,
        side: THREE.DoubleSide,
      });

      const shapes = path.toShapes();

      for (const shape of shapes) {
        const geometry = new THREE.ExtrudeGeometry(shape, { ...this.baseSettings, ...settings });
        const mesh = new THREE.Mesh(geometry, material);
        group.add(mesh);
      }
    }

    return group;
  }
}