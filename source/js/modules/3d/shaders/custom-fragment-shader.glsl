#define PI 3.1415926538

precision mediump float;

uniform vec2 canvasSize;

uniform sampler2D map;

uniform float hue;

uniform bool hasBubbles;

struct Bubble {
    vec2 center;
    float radius;
};

uniform Bubble bubbles[3];

varying vec2 vUv;

const float BORDER_WIDTH = 0.0025;
const float STRENGTH = 0.5;
const vec4 BORDER_COLOR = vec4(1.0, 1.0, 1.0, 0.15);
const float GLARE_ANGLE_START = 2.0 * PI / 3.0;
const float GLARE_ANGLE_END = 5.0 * PI / 6.0;

vec4 getColorWithHue(vec4 texel, float hue) {
	vec3 color = texel.rgb;
	const vec3 k = vec3(0.57735, 0.57735, 0.57735);
	float cosAngle = cos(hue);
	float sinAngle = sin(hue);

	return vec4(cosAngle * color + (1.0 - cosAngle) * dot(k, color) * k + sinAngle * cross(k, color), texel.a);
	
}

vec2 getModifiedUV(vec2 actualUV, vec2 pointUV, float radius, float strength)
{
	vec2 vecToPoint = pointUV - actualUV;
	float distToPoint = length(vecToPoint);
	const float shift = 0.001;
	float magnificationCoef = (1.0 - distToPoint / radius) * strength;
	magnificationCoef *= step(distToPoint, radius);
	
	return actualUV + (magnificationCoef * vecToPoint - shift);
	
}

void mixColor(vec4 color, inout vec4 texel) {
    texel = vec4(mix(texel.rgb, color.rgb, color.a), 1.0);
}

vec2 getPositionWithRatio(float x, float y, float canvasW, float canvasH) {
	float ratio = canvasSize.x / canvasSize.y;
	if (ratio < 1.0) {
		ratio = canvasSize.y / canvasSize.x;
		return vec2(x, ratio * y);
	}
	return vec2(ratio * x , y);
}

void drawBubble(Bubble bubble, inout vec4 texel) {
	vec2 uv = getPositionWithRatio(vUv.x, vUv.y, canvasSize.x, canvasSize.y);
	vec2 bubbleCenter = getPositionWithRatio(bubble.center.x, bubble.center.y, canvasSize.x, canvasSize.y);
	float glareRadius = 0.85 * bubble.radius;
	vec2 currentToBubbleCenter = uv - bubbleCenter;
    float distToBubbleCenter = length(currentToBubbleCenter);

	if (distToBubbleCenter < bubble.radius) {
		vec2 modifiedUV = getModifiedUV(
			vUv,
			bubble.center,
			bubble.radius,
			STRENGTH
		);
		texel = texture2D(map, modifiedUV);

		bool isOnGlareBorder = distToBubbleCenter <= glareRadius + BORDER_WIDTH && distToBubbleCenter > glareRadius;
		float angle = atan(currentToBubbleCenter.y, currentToBubbleCenter.x);
		bool isInSector = angle >= GLARE_ANGLE_START && angle <= GLARE_ANGLE_END;
		
		if (isOnGlareBorder && isInSector) {
			mixColor(BORDER_COLOR, texel);
		}

	} else if (distToBubbleCenter <= bubble.radius + BORDER_WIDTH) {
		mixColor(BORDER_COLOR, texel);
	}
}

void main() {
	vec4 texel = texture2D( map, vUv );

	if (hasBubbles) {
		for (int i = 0; i < 3; i++) {
        	drawBubble(bubbles[i], texel);
			
    	}
	}

	gl_FragColor = getColorWithHue(texel, hue);
}
