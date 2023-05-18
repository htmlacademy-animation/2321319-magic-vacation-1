import * as THREE from "three";
import { Screen } from "../../../general/consts";
import DefaultScene from "./default-scene";

export default class IntroScene extends DefaultScene {
  constructor(objectLoader) {
    super(objectLoader);
    this.sceneId = Screen.TOP;
  }
}
