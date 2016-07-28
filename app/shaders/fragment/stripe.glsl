precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

varying vec4 v_Position;

void main(void) {
  vec2 position = (gl_FragCoord.xy / resolution.xy);
  float color = 0.0;

  if (v_Position.y < -0.8 || v_Position.y > -0.75) {
    gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);
  } else {
    gl_FragColor = vec4(0.0, 1.0, 0.0, 0.0);
  }
}
