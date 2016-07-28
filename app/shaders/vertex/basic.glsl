attribute vec2 aPosition;
varying vec4 v_Position;

void main() {
  gl_Position = vec4(aPosition, 0, 1);
	v_Position = gl_Position;
}
