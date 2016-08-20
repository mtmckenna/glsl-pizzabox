attribute vec2 position;
varying vec4 vPosition;
varying vec2 vModelPosition;
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

void main() {
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 0, 1);
  vModelPosition = position;
	vPosition = gl_Position;
}
