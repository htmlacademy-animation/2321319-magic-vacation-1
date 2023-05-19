import * as THREE from "three";

const vertexShader = require(`../shaders/custom-vertex-shader.glsl`);
const fragmentShader = require(`../shaders/custom-fragment-shader.glsl`);

export default class CustomMaterial extends THREE.RawShaderMaterial {
  constructor(canvasSize, map, hue, hasBubbles, bubbles) {
    let options = {
      canvasSize: {
        value: canvasSize,
      },
      map: {
        value: map,
      },
      hue: {
        value: hue,
      },
      hasBubbles: {
        value: hasBubbles,
      },
    };
    if (hasBubbles) {
      options.bubbles = {
        value: bubbles,
      };
    }
    super({ uniforms: options, vertexShader, fragmentShader });
  }
}
