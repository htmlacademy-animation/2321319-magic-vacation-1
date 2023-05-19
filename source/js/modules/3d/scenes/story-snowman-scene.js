import * as THREE from "three";
import { ThemeColor } from "../../../general/consts";
import { SceneObjects } from "../objects/scene-objects-config";
import DefaultScene from "./default-scene";

export default class SnowmanScene extends DefaultScene {
  constructor(objectLoader) {
    super(objectLoader);
    this.sceneId = ThemeColor.LIGHT_BLUE;
  }
}
