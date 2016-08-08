attribute vec2 aPosition;
varying vec4 vPosition;
varying vec2 vModelPosition;
uniform mat4 model;

void main() {
  gl_Position = model * vec4(aPosition, 0, 1);
  vModelPosition = aPosition;
	vPosition = gl_Position;
}
