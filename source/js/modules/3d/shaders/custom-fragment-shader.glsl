precision mediump float;

uniform sampler2D map;

uniform float hue;

varying vec2 vUv;

vec4 getColorWithHue(vec4 texel, float hue) {
	vec3 color = texel.rgb;
	const vec3 k = vec3(0.57735, 0.57735, 0.57735);
	float cosAngle = cos(hue);
	float sinAngle = sin(hue);
	return vec4(cosAngle * color + (1.0 - cosAngle) * dot(k, color) * k + sinAngle * cross(k, color), texel.a);
	
}

void main() {

	vec4 texel = texture2D( map, vUv );

	gl_FragColor = getColorWithHue(texel, hue);

}
