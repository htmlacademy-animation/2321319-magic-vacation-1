import * as THREE from "three";
import { SvgShape } from "../../../general/consts";
import DefaultScene from "./default-scene";

export default class IntroScene extends DefaultScene {
  initObjects() {
    super.initObjects();
    this.initTestObjects();
  }

  initTestObjects() {
    let object = this.objectLoader.extrudeObject(SvgShape.FLAMINGO.id);
    this.setPosition(object, [-180, 200, 50], [1, 1, 1], [0, 0, THREE.Math.degToRad(180)]);
    this.sceneGroup.add(object);

    object = this.objectLoader.extrudeObject(SvgShape.FLOWER.id, {depth: 4});
    this.setPosition(object, [290, 10, 100], [0.5, 0.5, 1], [0, 0, THREE.Math.degToRad(180)]);
    this.sceneGroup.add(object);

    object = this.objectLoader.extrudeObject(SvgShape.KEYHOLE.id, {depth: 20});
    this.setPosition(object, [70, 70, 50], [0.09, 0.09, 1], [0, 0, THREE.Math.degToRad(180)]);
    this.sceneGroup.add(object);

    object = this.objectLoader.extrudeObject(SvgShape.LEAF.id);
    this.setPosition(object, [200, 200, 50], [1, 1, 1], [0, THREE.Math.degToRad(180), THREE.Math.degToRad(180)]);
    this.sceneGroup.add(object);

    object = this.objectLoader.extrudeObject(SvgShape.LEAF.id, {depth: 3, bevelThickness: 3, bevelSize: 3});
    this.setPosition(object, [150, 150, 50], [1, 1, 1], [0, THREE.Math.degToRad(180), THREE.Math.degToRad(180)]);
    this.sceneGroup.add(object);

    object = this.objectLoader.extrudeObject(SvgShape.QUESTION.id);
    this.setPosition(object, [20, -150, 50], [1, 1, 1], [0, THREE.Math.degToRad(180), THREE.Math.degToRad(180)]);
    this.sceneGroup.add(object);

    object = this.objectLoader.extrudeObject(SvgShape.SNOWFLAKE.id);
    this.setPosition(object, [-190, -40, 50], [1, 1, 1], [0, 0, THREE.Math.degToRad(180)]);
    this.sceneGroup.add(object);
  }
}
