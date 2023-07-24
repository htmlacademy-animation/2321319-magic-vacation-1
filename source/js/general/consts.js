export const SCREEN_HIDDEN_CLASS = `screen--hidden`;

export const ThemeColor = {
  LIGHT_PURPLE: `light-purple`,
  BLUE: `blue`,
  LIGHT_BLUE: `light-blue`,
  PURPLE: `purple`,
};

export const Screen = {
  TOP: 0,
  STORY: 1,
  PRIZES: 2,
  RULES: 3,
  GAME: 4,
  RESULT: 5,
  RESULT2: 6,
  RESULT3: 7,
};

export const AnimationType = {
  _2D: 0,
  _3D: 1,
};

export const ObjectType = {
  IMAGE: 0,
  SVG: 1,
  OBJECT: 2
};

export const ObjectLoadType = {
  OBJ: 0,
  GLTF: 1,
};

export const AnimatedPrimitives = {
  CHANDELIER: `CHANDELIER`,
};

export const SvgShape = {
  FLAMINGO: {
    id: `FLAMINGO`,
    path: `img/module-6/svg-forms/flamingo.svg`,
  },
  SNOWFLAKE: {
    id: `SNOWFLAKE`,
    path: `img/module-6/svg-forms/snowflake.svg`,
  },
  QUESTION: {
    id: `QUESTION`,
    path: `img/module-6/svg-forms/question.svg`,
  },
  FLOWER: {
    id: `FLOWER`,
    path: `img/module-6/svg-forms/flower.svg`,
  },
  KEYHOLE: {
    id: `KEYHOLE`,
    path: `img/module-6/svg-forms/keyhole.svg`,
  },
  LEAF: {
    id: `LEAF`,
    path: `img/module-6/svg-forms/leaf.svg`,
  },
};

export const Objects = {
  AIRPLANE: {
    id: `AIRPLANE`,
    type: ObjectLoadType.OBJ,
    path: `3d/module-6/scene-0-objects/airplane.obj`,
  },
  SUITCASE: {
    id: `SUITCASE`,
    type: ObjectLoadType.GLTF,
    path: `3d/module-6/scene-0-objects/suitcase.gltf`,
  },
  WATERMELON: {
    id: `WATERMELON`,
    type: ObjectLoadType.GLTF,
    path: `3d/module-6/scene-0-objects/watermelon.gltf`,
  },
  WALLS: {
    id: `WALLS`,
    type: ObjectLoadType.OBJ,
    path: `3d/module-6/rooms-scenes/common/WallCornerUnit.obj`,
  },
  ROOM_1_STATIC: {
    id: `ROOM_1_STATIC`,
    type: ObjectLoadType.GLTF,
    path: `3d/module-6/rooms-scenes/scenesStatic/scene1-static-output-1.gltf`,
  },
  ROOM_2_STATIC: {
    id: `ROOM_2_STATIC`,
    type: ObjectLoadType.GLTF,
    path: `3d/module-6/rooms-scenes/scenesStatic/scene2-static-output-1.gltf`,
  },
  ROOM_3_STATIC: {
    id: `ROOM_3_STATIC`,
    type: ObjectLoadType.GLTF,
    path: `3d/module-6/rooms-scenes/scenesStatic/scene3-static-output-1.gltf`,
  },
  ROOM_4_STATIC: {
    id: `ROOM_4_STATIC`,
    type: ObjectLoadType.GLTF,
    path: `3d/module-6/rooms-scenes/scenesStatic/scene4-static-output-1.gltf`,
  },
  DOG: {
    id: `DOG`,
    type: ObjectLoadType.GLTF,
    path: `3d/module-6/rooms-scenes/objects/dog.gltf`,
  },
  COMPASS: {
    id: `COMPASS`,
    type: ObjectLoadType.GLTF,
    path: `3d/module-6/rooms-scenes/objects/compass.gltf`,
  },
  SONYA: {
    id: `SONYA`,
    type: ObjectLoadType.GLTF,
    path: `3d/module-6/rooms-scenes/objects/sonya.gltf`,
  },
};

export const MaterialType = {
  SOFT: {
    id: `SOFT`,
    metalness: 0.15,
    roughness: 0.7,
    matcapImg: `./img/module-7/matcaps/Soft-Mat.png`
  },
  BASIC: {
    id: `BASIC`,
    metalness: 0.3,
    roughness: 0.6,
    matcapImg: `./img/module-7/matcaps/Basic-Mat.png`
  },
  STRONG: {
    id: `STRONG`,
    metalness: 0.15,
    roughness: 0.58,
    matcapImg: `./img/module-7/matcaps/Strong-Mat-SnowColor.png`
  },
  CUSTOM: {
    id: `CUSTOM`,
  },
};

export const ObjectColor = {
  BLUE: {id: `BLUE`, value: `rgb(51, 113, 235)`},
  BRIGHT_BLUE: {id: `BRIGHT_BLUE`, value: `rgb(47, 58, 201)`},
  LIGHT_BLUE: {id: `LIGHT_BLUE`, value: `rgb(150, 176, 243)`},
  DARK_BLUE: {id: `DARK_BLUE`, value: `rgb(12, 49, 112)`},
  SKY_LIGHT_BLUE: {id: `SKY_LIGHT_BLUE`, value: `rgb(161, 200, 240)`},
  MOUNTAIN_BLUE: {id: `MOUNTAIN_BLUE`, value: `rgb(101, 152, 219)`},
  DOMINANT_RED: {id: `DOMINANT_RED`, value: `rgb(255, 32, 66)`},
  LIGHT_DOMINANT_RED: {id: `LIGHT_DOMINANT_RED`, value: `rgb(255, 105, 120)`},
  SHADOWED_DOMIANT_RED: {id: `SHADOWED_DOMIANT_RED`, value: `rgb(124, 26, 48)`},
  PURPLE: {id: `PURPLE`, value: `rgb(163, 118, 235)`},
  BRIGHT_PURPLE: {id: `BRIGHT_PURPLE`, value: `rgb(118, 76, 225)`},
  LIGHT_PURPLE: {id: `LIGHT_PURPLE`, value: `rgb(194, 153, 225)`},
  ADDITIONAL_PURPLE: {id: `ADDITIONAL_PURPLE`, value: `rgb(119, 85, 189)`},
  DARK_PURPLE: {id: `DARK_PURPLE`, value: `rgb(76, 49, 121)`},
  SHADOWED_PURPLE: {id: `SHADOWED_PURPLE`, value: `rgb(75, 50, 116)`},
  SHADOWED_BRIGHT_PURPLE: {id: `SHADOWED_BRIGHT_PURPLE`, value: `rgb(56, 37, 108)`},
  SHADOWED_LIGHT_PURPLE: {id: `SHADOWED_LIGHT_PURPLE`, value: `rgb(77, 53, 106)`},
  SHADOWED_ADDITIONAL_PURPLE: {id: `SHADOWED_ADDITIONAL_PURPLE`, value: `rgb(55, 38, 89)`},
  SHADOWED_DARK_PURPLE: {id: `SHADOWED_DARK_PURPLE`, value: `rgb(49, 42, 71)`},
  GREY: {id: `GREY`, value: `rgb(118, 125, 143)`},
  METAL_GREY: {id: `METAL_GREY`, value: `rgb(126, 141, 164)`},
  ORANGE: {id: `ORANGE`, value: `rgb(230, 80, 0)`},
  GREEN: {id: `GREEN`, value: `rgb(0, 210, 134)`},
  WHITE: {id: `WHITE`, value: `rgb(255, 255, 255)`},
  SNOW_COLOR: {id: `SNOW_COLOR`, value: `rgb(182, 206, 240)`},
};
