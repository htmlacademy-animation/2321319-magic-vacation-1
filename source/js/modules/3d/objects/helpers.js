import * as THREE from "three";

export class ExtrudeHelper {
  constructor(objectMap) {
    this._objectMap = objectMap;
    this._baseSettings = {
      steps: 4,
      depth: 8,
      bevelSize: 2,
      bevelThickness: 2,
      bevelOffset: 0,
      bevelSegments: 5,
    };
  }

  extrudeObject(objectName, settings, material) {
    const paths = (this._objectMap[objectName] && this._objectMap[objectName].object) || [];
    const group = new THREE.Group();

    for (const path of paths) {
      const shapes = path.toShapes();

      for (const shape of shapes) {
        const geometry = new THREE.ExtrudeGeometry(shape, {
          ...this._baseSettings,
          ...settings,
        });
        const mesh = new THREE.Mesh(geometry, material);
        group.add(mesh);
      }
    }

    return group;
  }
}

export function getLathePointsBy(offset, width, height) {
  return [
    [offset, 0],
    [offset + width, 0],
    [offset + width, height],
    [offset, height],
    [offset, 0],
  ];
}
