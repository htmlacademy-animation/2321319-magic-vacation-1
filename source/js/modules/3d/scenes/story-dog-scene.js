import * as THREE from "three";
import { SceneObjects } from "../objects/scene-objects-config";
import { ThemeColor } from "../../../general/consts";
import DefaultScene from "./default-scene";

export default class DogScene extends DefaultScene {
  constructor(objectLoader) {
    super(objectLoader);
    this.sceneId = ThemeColor.LIGHT_PURPLE;
  }
}
