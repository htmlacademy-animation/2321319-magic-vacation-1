import * as THREE from "three";

const vertexShader = require(`./shaders/custom-vertex-shader.glsl`);
const fragmentShader = require(`./shaders/custom-fragment-shader.glsl`);


export default class CustomMaterial extends THREE.RawShaderMaterial {
  constructor(map) {
    super({
      uniforms: {
        map: {
          value: map
        }
      },
      vertexShader,
      fragmentShader
    });
  }
}

