import * as THREE from "three";

export class ExtrudeHelper {
  constructor(objectMap) {
    this.objectMap = objectMap;
    this.baseSettings = {
      steps: 4,
      depth: 8,
      bevelSize: 2,
      bevelThickness: 2,
      bevelOffset: 0,
      bevelSegments: 5,
    };
  }

  extrudeObject(objectName, settings, material) {
    const paths =
      (this.objectMap[objectName] && this.objectMap[objectName].object) || [];
    const group = new THREE.Group();

    for (const path of paths) {
      const shapes = path.toShapes();

      for (const shape of shapes) {
        const geometry = new THREE.ExtrudeGeometry(shape, {
          ...this.baseSettings,
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


export function rotateAboutPoint(obj, point, axis, theta, pointIsWorld = false) {
  if (pointIsWorld) {
    obj.parent.localToWorld(obj.position); // compensate for world coordinate
  }

  obj.position.sub(point); // remove the offset
  obj.position.applyAxisAngle(axis, theta); // rotate the POSITION
  obj.position.add(point); // re-add the offset

  if (pointIsWorld) {
    obj.parent.worldToLocal(obj.position); // undo world coordinates compensation
  }

  obj.rotateOnAxis(axis, theta); // rotate the OBJECT
}
