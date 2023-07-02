import * as THREE from "three";
import {
  AnimatedPrimitives,
  SvgShape,
  ThemeColor,
  Screen,
  ObjectColor,
  MaterialType,
  Objects,
} from "../../../general/consts";
import { getLathePointsBy } from "./helpers";
import RoadMaterial from "../materials/road-material";
import CarpetMaterial from "../materials/carpet-material";

export const SceneObjects = {
  [Screen.TOP]: {
    backgroundImage: `img/module-5/scenes-textures/scene-0.png`,
    position: [23, 920, 3270],
    scale: [1, 1, 1],
    rotation: [0, 0, 0],
    primitives: [
      {
        id: `plane`,
        position: [0, 0, 1],
        scale: [1, 1, 1],
        rotation: [0, 0, 0],
        children: [
          {
            id: `planeMain`,
            primitiveType: `PlaneGeometry`,
            primitiveSettings: [500, 500],
            position: [0, 0, 0],
            scale: [1, 1, 1],
            rotation: [0, 0, 0],
            materialType: MaterialType.BASIC.id,
            materialProps: {
              color: ObjectColor.PURPLE.id,
              transparent: true
            }
          },
        ],
      },
      {
        id: AnimatedPrimitives.CHANDELIER,
        position: [5, -20, 25],
        scale: [0, 0, 0],
        rotation: [10, 0, -60],
        children: [
          {
            id: `chandelierLathe`,
            primitiveType: `LatheGeometry`,
            primitiveSettings: [
              getLathePointsBy(80, 40, 2).map((el) => new THREE.Vector2(...el)),
              35,
              0,
              2 * Math.PI
            ],
            position: [0, 0, 0],
            scale: [1, 1, 1],
            rotation: [0, 0, 18],
            materialType: MaterialType.SOFT.id,
            materialProps: {
              color: ObjectColor.BRIGHT_PURPLE.id,
            }
          },
          {
            id: `chandelierBody`,
            primitiveType: `SphereGeometry`,
            primitiveSettings: [60, 80, 80],
            position: [0, 0, 0],
            scale: [1, 1, 1],
            rotation: [0, 0, 0],
            materialType: MaterialType.SOFT.id,
            materialProps: {
              color: ObjectColor.DOMINANT_RED.id,
            }
          },
        ]
      }
    ],
    svgShapes: [
      {
        id: SvgShape.FLAMINGO.id,
        position: [-50, 30, 20],
        scale: [0, 0, 0],
        rotation: [-10, 60, 205],
        extrudeSettings: { depth: 12, bevelOffset: -2 },
        materialType: MaterialType.SOFT.id,
        materialProps: {
          color: ObjectColor.LIGHT_DOMINANT_RED.id,
        }
      },
      {
        id: SvgShape.SNOWFLAKE.id,
        position: [-40, -20, 20],
        scale: [0, 0, 0],
        rotation: [-20, 70, 200],
        extrudeSettings: { depth: 11, bevelOffset: -2 },
        materialType: MaterialType.BASIC.id,
        materialProps: {
          color: ObjectColor.BLUE.id,
        }
      },
      {
        id: SvgShape.QUESTION.id,
        position: [10, -60, 20],
        scale: [0, 0, 0],
        rotation: [-45, 180, 210],
        extrudeSettings: { depth: 14, bevelOffset: -2 },
        materialType: MaterialType.BASIC.id,
        materialProps: {
          color: ObjectColor.BLUE.id,
        }
      },
      {
        id: SvgShape.KEYHOLE.id,
        position: [1000, 1000, 0],
        scale: [1.02, 1.02, 1.02],
        rotation: [0, 0, 180],
        extrudeSettings: { depth: 20, bevelOffset: -2 },
        materialType: MaterialType.SOFT.id,
        materialProps: {
          color: ObjectColor.DARK_PURPLE.id,
        }
      },
      {
        id: SvgShape.LEAF.id,
        position: [7, 40, 20],
        scale: [0, 0, 0],
        rotation: [5, 90, 245],
        extrudeSettings: { depth: 14, bevelOffset: -2 },
        materialType: MaterialType.BASIC.id,
        materialProps: {
          color: ObjectColor.GREEN.id,
        }
      },
    ],
    objects: [
      {
        id: Objects.AIRPLANE.id,
        position: [0, 0, 0],
        scale: [0, 0, 0],
        rotation: [5, 0, 10],
        materialType: MaterialType.BASIC.id,
        materialProps: {
          color: ObjectColor.WHITE.id,
        },
        isRiggingObject: true
      },
      {
        id: Objects.WATERMELON.id,
        position: [-60, -70, 20],
        scale: [0, 0, 0],
        rotation: [15, -10, 210],
      },
      {
        id: Objects.SUITCASE.id,
        position: [0, 0, 0],
        scale: [0, 0, 0],
        rotation: [30, 0, 0],
        isRiggingObject: true
      },
    ],
  },
  [ThemeColor.LIGHT_PURPLE]: {
    backgroundImage: `./img/module-5/scenes-textures/scene-1.png`,
    position: [0, 400, 0],
    scale: [1, 1, 1],
    rotation: [0, 0, 0],
    primitives: [
      {
        id: AnimatedPrimitives.CHANDELIER,
        position: [30, 130, 600],
        scale: [0.9, 0.9, 0.9],
        rotation: [0, 0, 0],
        children: [
          {
            id: `chandelierLathe`,
            primitiveType: `LatheGeometry`,
            primitiveSettings: [
              getLathePointsBy(80, 40, 2).map((el) => new THREE.Vector2(...el)),
              35,
              0,
              2 * Math.PI
            ],
            position: [0, 0, 0],
            scale: [1, 1, 1],
            rotation: [0, 0, 18],
            materialType: MaterialType.SOFT.id,
            materialProps: {
              color: ObjectColor.BRIGHT_PURPLE.id,
            }
          },
          {
            id: `chandelierBody`,
            primitiveType: `SphereGeometry`,
            primitiveSettings: [60, 80, 80],
            position: [0, 0, 0],
            scale: [1, 1, 1],
            rotation: [0, 0, 0],
            materialType: MaterialType.SOFT.id,
            materialProps: {
              color: ObjectColor.DOMINANT_RED.id,
            }
          },
          {
            id: `chandelierThread`,
            primitiveType: `CylinderGeometry`,
            primitiveSettings: [1, 1, 1000],
            position: [0, 560, 0],
            scale: [1, 1, 1],
            rotation: [0, 0, 0],
            materialType: MaterialType.SOFT.id,
            materialProps: {
              color: ObjectColor.METAL_GREY.id,
            }
          },
          {
            id: `chandelierHanging`,
            primitiveType: `SphereGeometry`,
            primitiveSettings: [10, 80, 80],
            position: [0, 120, 0],
            scale: [1, 1, 1],
            rotation: [0, 0, 0],
            materialType: MaterialType.SOFT.id,
            materialProps: {
              color: ObjectColor.BRIGHT_PURPLE.id,
            }
          },
        ],
      },
      {
        id: `carpet`,
        position: [0, -495, 80],
        scale: [0.9, 0.9, 0.9],
        rotation: [0, -55, 0],
        children: [
          {
            id: `carpetLathe`,
            primitiveType: `LatheGeometry`,
            primitiveSettings: [
              getLathePointsBy(763, 180, 3).map((el) => new THREE.Vector2(...el)),
              12,
              THREE.Math.degToRad(16),
              THREE.Math.degToRad(74)
            ],
            position: [0, 0, 0],
            scale: [1, 1, 1],
            rotation: [0, 0, 0],
            materialType: MaterialType.CUSTOM.id,
            materialProps: {
              materialConstructor: CarpetMaterial,
              mainColor: ObjectColor.LIGHT_PURPLE.id,
              secondaryColor: ObjectColor.ADDITIONAL_PURPLE.id,
              textureFrequency: 3.5
            }
          }
        ],
      },
      {
        id: `floor`,
        position: [0, 0, 0],
        scale: [1, 1, 1],
        rotation: [0, 0, 0],
        children: [
          {
            id: `floorBody`,
            primitiveType: `CircleGeometry`,
            primitiveSettings: [1350, 60, 0, Math.PI / 2],
            position: [0, -500, 0],
            scale: [1, 1, 1],
            rotation: [90, 0, 45],
            materialType: MaterialType.SOFT.id,
            materialProps: {
              color: ObjectColor.DARK_PURPLE.id,
              side: THREE.DoubleSide
            }
          }
        ]
      }
    ],
    svgShapes: [
      {
        id: SvgShape.FLOWER.id,
        position: [-240, -108, 340],
        scale: [0.6, 0.6, 0.6],
        rotation: [180, -45, 0],
        extrudeSettings: { depth: 4, bevelOffset: -2 },
        materialType: MaterialType.BASIC.id,
        materialProps: {
          color: ObjectColor.DARK_PURPLE.id,
          side: THREE.DoubleSide,
        }
      },
    ],
    objects: [
      {
        id: Objects.WALLS.id,
        position: [0, -500, 0],
        scale: [1, 1, 1],
        rotation: [0, -45, 0],
        materialType: MaterialType.SOFT.id,
        materialProps: {
          color: ObjectColor.PURPLE.id,
          side: THREE.DoubleSide
        }
      },
      {
        id: Objects.ROOM_1_STATIC.id,
        position: [-5, -495, 5],
        scale: [1, 1, 1],
        rotation: [0, -45, 0]
      },
      {
        id: Objects.DOG.id,
        position: [50, -490, 620],
        scale: [1, 1, 1],
        rotation: [0, 20, 0],
      },
      {
        id: Objects.SUITCASE.id,
        position: [-336, -400, 756],
        scale: [0, 0, 0],
        rotation: [0, 0, 0],
      },
    ],
  },
  [ThemeColor.BLUE]: {
    backgroundImage: `./img/module-5/scenes-textures/scene-2.png`,
    position: [0, 400, 0],
    scale: [1, 1, 1],
    rotation: [0, 90, 0],
    svgShapes: [
      {
        id: SvgShape.LEAF.id,
        name: `${SvgShape.LEAF.id}-1`,
        position: [-230, -180, 350],
        scale: [2.5, 2.5, 2.5],
        rotation: [0, 225, 190],
        extrudeSettings: {
          depth: 2.6,
          bevelThickness: 3,
          bevelSize: 3,
          bevelOffset: -3,
        },
        materialType: MaterialType.BASIC.id,
        materialProps: {
          color: ObjectColor.GREEN.id,
        },
        hasGroupTransform: true,
        groupTransformSettings: {
          objectPosition: [-80, -100, 0],
          objectScale: [1, 1, 1],
          objectRotation: [0, 0, 0],
          groupPosition: [80, 100, 0],
          groupScale: [1, 1, 1],
          groupRotation: [0, 0, 0]
        }
      },
      {
        id: SvgShape.LEAF.id,
        name: `${SvgShape.LEAF.id}-2`,
        position: [-300, -340, 400],
        scale: [1.5, 1.5, 1.5],
        rotation: [0, 225, 170],
        extrudeSettings: {
          depth: 1.5,
          bevelThickness: 3,
          bevelSize: 3,
          bevelOffset: -3,
        },
        materialType: MaterialType.BASIC.id,
        materialProps: {
          color: ObjectColor.GREEN.id,
        },
        hasGroupTransform: true,
        groupTransformSettings: {
          objectPosition: [-80, -100, 0],
          objectScale: [1, 1, 1],
          objectRotation: [0, 0, 0],
          groupPosition: [80, 100, 0],
          groupScale: [1, 1, 1],
          groupRotation: [0, 0, 0]
        }
      },
    ],
    objects: [
      {
        id: Objects.WALLS.id,
        position: [0, -500, 5],
        scale: [1, 1, 1],
        rotation: [0, -45, 0],
        materialType: MaterialType.BASIC.id,
        materialProps: {
          color: ObjectColor.BLUE.id,
          side: THREE.DoubleSide,
        },
      },
      {
        id: Objects.ROOM_2_STATIC.id,
        position: [0, -498, 10],
        scale: [1, 1, 1],
        rotation: [0, -45, 0],
      },
    ],
    primitives: [
      {
        id: `pyramid`,
        position: [-50, -350, 400],
        scale: [1.5, 1.0, 1.5],
        rotation: [0, 0, 0],
        children: [
          {
            id: `pyramidBody`,
            primitiveType: `CylinderGeometry`,
            primitiveSettings: [0, 125, 280, 4, 1],
            position: [0, 0, 0],
            scale: [1, 1, 1],
            rotation: [0, 0, 0],
            materialType: MaterialType.SOFT.id,
            materialProps: {
              color: ObjectColor.BLUE.id,
            },
          },
        ],
      },
      {
        id: `flashlight`,
        position: [380, -435, 570],
        scale: [1, 1, 1],
        rotation: [0, 30, 0],
        children: [
          {
            id: `bottomPartBody`,
            primitiveType: `CylinderGeometry`,
            primitiveSettings: [16, 16, 120, 80, 1],
            position: [0, 0, 0],
            scale: [1, 1, 1],
            rotation: [0, 0, 0],
            materialType: MaterialType.SOFT.id,
            materialProps: {
              color: ObjectColor.BLUE.id,
            },
          },
          {
            id: `bottomPartTop`,
            primitiveType: `SphereGeometry`,
            primitiveSettings: [16, 80, 80],
            position: [0, 60, 0],
            scale: [1, 1, 1],
            rotation: [0, 0, 0],
            materialType: MaterialType.SOFT.id,
            materialProps: {
              color: ObjectColor.BLUE.id,
            },
          },
          {
            id: `centerPart`,
            primitiveType: `CylinderGeometry`,
            primitiveSettings: [7, 7, 230, 80, 1],
            position: [0, 183, 0],
            scale: [1, 1, 1],
            rotation: [0, 0, 0],
            materialType: MaterialType.SOFT.id,
            materialProps: {
              color: ObjectColor.BLUE.id,
            },
          },
          {
            id: `topPartBottom`,
            primitiveType: `BoxGeometry`,
            primitiveSettings: [37, 4, 37],
            position: [0, 298, 0],
            scale: [1, 1, 1],
            rotation: [0, 0, 0],
            materialType: MaterialType.SOFT.id,
            materialProps: {
              color: ObjectColor.BLUE.id,
            },
          },
          {
            id: `topPartCenter`,
            primitiveType: `CylinderGeometry`,
            primitiveSettings: [21, 17, 60, 4, 1],
            position: [0, 330, 0],
            scale: [1, 1, 1],
            rotation: [0, 45, 0],
            materialType: MaterialType.SOFT.id,
            materialProps: {
              color: ObjectColor.LIGHT_BLUE.id,
            },
          },
          {
            id: `topPartTop`,
            primitiveType: `CylinderGeometry`,
            primitiveSettings: [22.5, 28.5, 6, 4, 1],
            position: [0, 363, 0],
            scale: [1, 1, 1],
            rotation: [0, 45, 0],
            materialType: MaterialType.SOFT.id,
            materialProps: {
              color: ObjectColor.BLUE.id,
            },
          },
        ],
      },
      {
        id: `floor`,
        position: [0, 0, 0],
        scale: [1, 1, 1],
        rotation: [0, 0, 0],
        children: [
          {
            id: `floorBody`,
            primitiveType: `CircleGeometry`,
            primitiveSettings: [1350, 60, 0, Math.PI / 2],
            position: [0, -500, 0],
            scale: [1, 1, 1],
            rotation: [90, 0, 45],
            materialType: MaterialType.SOFT.id,
            materialProps: {
              color: ObjectColor.BRIGHT_BLUE.id,
              side: THREE.DoubleSide,
            },
          },
        ],
      },
    ]
  },
  [ThemeColor.LIGHT_BLUE]: {
    backgroundImage: `./img/module-5/scenes-textures/scene-3.png`,
    position: [0, 400, 0],
    scale: [1, 1, 1],
    rotation: [0, 180, 0],
    primitives: [
      {
        id: `snowman`,
        position: [-130, -445, 400],
        scale: [1, 1, 1],
        rotation: [0, -40, 0],
        children: [
          {
            id: `snowBottom`,
            primitiveType: `SphereGeometry`,
            primitiveSettings: [75, 80, 80],
            position: [0, 65, 0],
            scale: [1, 1, 1],
            rotation: [0, 0, 0],
            materialType: MaterialType.STRONG.id,
            materialProps: {
              color: ObjectColor.SNOW_COLOR.id,
            },
          },
          {
            id: `snowTop`,
            primitiveType: `SphereGeometry`,
            primitiveSettings: [44, 80, 80],
            position: [0, 173, 0],
            scale: [1, 1, 1],
            rotation: [0, 0, 0],
            materialType: MaterialType.STRONG.id,
            materialProps: {
              color: ObjectColor.SNOW_COLOR.id,
            },
          },
          {
            id: `carrot`,
            primitiveType: `ConeGeometry`,
            primitiveSettings: [18, 75, 80],
            position: [45, 173, 0],
            scale: [1, 1, 1],
            rotation: [0, 0, -90],
            materialType: MaterialType.SOFT.id,
            materialProps: {
              color: ObjectColor.ORANGE.id,
            },
          },
        ],
      },
      {
        id: `road`,
        position: [0, -292, 20],
        scale: [1, 1, 1],
        rotation: [0, 45, 180],
        children: [
          {
            id: `roadLathe`,
            primitiveType: `LatheGeometry`,
            primitiveSettings: [
              getLathePointsBy(732, 160, 3).map(
                (el) => new THREE.Vector2(...el)
              ),
              12,
              THREE.Math.degToRad(0),
              THREE.Math.degToRad(90),
            ],
            position: [0, 200, 0],
            scale: [1, 1, 1],
            rotation: [0, 0, 0],
            materialType: MaterialType.CUSTOM.id,
            materialProps: {
              materialConstructor: RoadMaterial,
              mainColor: ObjectColor.GREY.id,
              secondaryColor: ObjectColor.WHITE.id,
              textureFrequency: 4.0,
            },
          },
        ],
      },
      {
        id: `floor`,
        position: [0, 0, 0],
        scale: [1, 1, 1],
        rotation: [0, 0, 0],
        children: [
          {
            id: `floorBody`,
            primitiveType: `CircleGeometry`,
            primitiveSettings: [1350, 60, 0, Math.PI / 2],
            position: [0, -500, 0],
            scale: [1, 1, 1],
            rotation: [90, 0, 45],
            materialType: MaterialType.SOFT.id,
            materialProps: {
              color: ObjectColor.MOUNTAIN_BLUE.id,
              side: THREE.DoubleSide,
            },
          },
        ],
      },
    ],
    svgShapes: [],
    objects: [
      {
        id: Objects.WALLS.id,
        position: [0, -500, 0],
        scale: [1, 1, 1],
        rotation: [0, -45, 0],
        materialType: MaterialType.SOFT.id,
        materialProps: {
          color: ObjectColor.SKY_LIGHT_BLUE.id,
          side: THREE.DoubleSide,
        },
      },
      {
        id: Objects.ROOM_3_STATIC.id,
        position: [0, -495, 5],
        scale: [1, 1, 1],
        rotation: [0, -45, 0],
      },
      {
        id: Objects.COMPASS.id,
        position: [-20, -495, 80],
        scale: [1, 1, 1],
        rotation: [0, -40, 0],
      },
    ]
  },
  [ThemeColor.PURPLE]: {
    backgroundImage: `./img/module-5/scenes-textures/scene-4.png`,
    position: [0, 400, 0],
    scale: [1, 1, 1],
    rotation: [0, 270, 0],
    primitives: [
      {
        id: `chandelier`,
        position: [30, 130, 600],
        scale: [0.9, 0.9, 0.9],
        rotation: [0, 0, 0],
        children: [
          {
            id: `chandelierLathe`,
            primitiveType: `LatheGeometry`,
            primitiveSettings: [
              getLathePointsBy(80, 40, 2).map((el) => new THREE.Vector2(...el)),
              35,
              0,
              2 * Math.PI,
            ],
            position: [0, 0, 0],
            scale: [1, 1, 1],
            rotation: [0, 0, 18],
            materialType: MaterialType.SOFT.id,
            materialProps: {
              color: ObjectColor.SHADOWED_BRIGHT_PURPLE.id,
            },
          },
          {
            id: `chandelierBody`,
            primitiveType: `SphereGeometry`,
            primitiveSettings: [60, 80, 80],
            position: [0, 0, 0],
            scale: [1, 1, 1],
            rotation: [0, 0, 0],
            materialType: MaterialType.SOFT.id,
            materialProps: {
              color: ObjectColor.SHADOWED_DOMIANT_RED.id,
            },
          },
          {
            id: `chandelierThread`,
            primitiveType: `CylinderGeometry`,
            primitiveSettings: [1, 1, 1000],
            position: [0, 560, 0],
            scale: [1, 1, 1],
            rotation: [0, 0, 0],
            materialType: MaterialType.SOFT.id,
            materialProps: {
              color: ObjectColor.METAL_GREY.id,
            },
          },
          {
            id: `chandelierHanging`,
            primitiveType: `SphereGeometry`,
            primitiveSettings: [10, 80, 80],
            position: [0, 120, 0],
            scale: [1, 1, 1],
            rotation: [0, 0, 0],
            materialType: MaterialType.SOFT.id,
            materialProps: {
              color: ObjectColor.SHADOWED_BRIGHT_PURPLE.id,
            },
          },
        ],
      },
      {
        id: `carpet`,
        position: [0, -495, 80],
        scale: [0.9, 0.9, 0.9],
        rotation: [0, -55, 0],
        children: [
          {
            id: `carpetLathe`,
            primitiveType: `LatheGeometry`,
            primitiveSettings: [
              getLathePointsBy(763, 180, 3).map(
                (el) => new THREE.Vector2(...el)
              ),
              12,
              THREE.Math.degToRad(16),
              THREE.Math.degToRad(74),
            ],
            position: [0, 0, 0],
            scale: [1, 1, 1],
            rotation: [0, 0, 0],
            materialType: MaterialType.CUSTOM.id,
            materialProps: {
              materialConstructor: CarpetMaterial,
              mainColor: ObjectColor.SHADOWED_LIGHT_PURPLE.id,
              secondaryColor: ObjectColor.SHADOWED_ADDITIONAL_PURPLE.id,
              textureFrequency: 3.5,
            },
          },
        ],
      },
      {
        id: `floor`,
        position: [0, 0, 0],
        scale: [1, 1, 1],
        rotation: [0, 0, 0],
        children: [
          {
            id: `floorBody`,
            primitiveType: `CircleGeometry`,
            primitiveSettings: [1350, 60, 0, Math.PI / 2],
            position: [0, -500, 0],
            scale: [1, 1, 1],
            rotation: [90, 0, 45],
            materialType: MaterialType.SOFT.id,
            materialProps: {
              color: ObjectColor.SHADOWED_DARK_PURPLE.id,
              side: THREE.DoubleSide,
            },
          },
        ],
      },
    ],
    svgShapes: [
      {
        id: SvgShape.FLOWER.id,
        position: [-240, -108, 340],
        scale: [0.6, 0.6, 0.6],
        rotation: [180, -45, 0],
        extrudeSettings: { depth: 4, bevelOffset: -2 },
        materialType: MaterialType.BASIC.id,
        materialProps: {
          color: ObjectColor.SHADOWED_DARK_PURPLE.id,
          side: THREE.DoubleSide,
        }
      },
    ],
    objects: [
      {
        id: Objects.WALLS.id,
        position: [0, -500, 0],
        scale: [1, 1, 1],
        rotation: [0, -45, 0],
        materialType: MaterialType.BASIC.id,
        materialProps: {
          color: ObjectColor.SHADOWED_PURPLE.id,
          side: THREE.DoubleSide,
        },
      },
      {
        id: Objects.ROOM_4_STATIC.id,
        position: [-5, -495, 5],
        scale: [1, 1, 1],
        rotation: [0, -45, 0]
      },
      {
        id: Objects.SONYA.id,
        position: [100, -400, 400],
        scale: [1, 1, 1],
        rotation: [0, -40, 0],
      },
    ],
  },
};
