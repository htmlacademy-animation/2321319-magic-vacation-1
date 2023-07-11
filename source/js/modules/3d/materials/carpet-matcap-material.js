import * as THREE from "three";

export default class CarpetMaterial extends THREE.MeshMatcapMaterial {
  constructor(
    mainColor,
    secondaryColor,
    textureFrequency,
    matcap
  ) {
    super({matcap, side: THREE.DoubleSide});
    this.mainColor = mainColor;
    this.secondaryColor = secondaryColor;
    this.textureFrequency = textureFrequency;
  }

  onBeforeCompile(shader) {
    shader.uniforms = {
      ...shader.uniforms,
      mainColor: new THREE.Uniform(this.mainColor),
      secondaryColor: new THREE.Uniform(this.secondaryColor),
      textureFrequency: new THREE.Uniform(this.textureFrequency)
    };

    shader.vertexShader = shader.vertexShader.replace(
      `#include <uv_pars_vertex>`,
      `varying vec2 vUv;`
    );

    shader.vertexShader = shader.vertexShader.replace(
      `#include <uv_vertex>`,
      `vUv = uv;`
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      `varying vec3 vViewPosition;`,
      `varying vec3 vViewPosition;
      varying vec2 vUv;
      uniform vec3 mainColor;
      uniform vec3 secondaryColor;
      uniform float textureFrequency;`
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      `#include <map_fragment>`,
      `vec4 texelColor = vec4(mainColor, 1.0);
      float part = 1.0 / textureFrequency;
      float maxBorder = ceil(vUv.x / part) * part;
      float dif = maxBorder - vUv.x;
      if (dif > 0.0 && dif <= part / 2.0) {
        texelColor = vec4(secondaryColor, 1.0);
      }
      texelColor = mapTexelToLinear( texelColor );
      diffuseColor *= texelColor;
      `
    );
  }
}
