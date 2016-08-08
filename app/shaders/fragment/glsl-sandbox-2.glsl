// http://glslsandbox.com/e#34197.0
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform float time;

varying vec2 vModelPosition;

void main() {
  vec2 uPos = vModelPosition;

  uPos.x -= 0.5;
  uPos.y -= 0.0;

	vec3 color = vec3(0.0);
	float vertColor = 0.0;
	for( float i = 0.0; i < 15.0; ++i )
	{
		float t = time * (0.9);

		uPos.y += sin( uPos.x*i + t+i/2.0 ) * 0.1;
		float fTemp = abs(1.0 / uPos.y / 100.0);
		vertColor += fTemp;
		color += vec3( fTemp*(10.0-i)/10.0, fTemp*i/10.0, pow(fTemp,1.5)*1.5 );
	}

	vec4 color_final = vec4(color, 1.0);
	gl_FragColor = color_final;
}
