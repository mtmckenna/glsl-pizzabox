// https://nickdesaulniers.github.io/RawWebGL/#/40
export function compileShader (gl, type, shaderSrc) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, shaderSrc);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader));
  }

  return shader;
}

// https://nickdesaulniers.github.io/RawWebGL/#/41
export function linkShader (gl, vertexShader, fragmentShader) {
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program));
  }

  return program;
}

// https://nickdesaulniers.github.io/RawWebGL/#/51
export function initBuffer (gl, data, elemPerVertex, attribute) {
  var buffer = gl.createBuffer();
  if (!buffer) throw new Error('Failed to create buffer.');
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  gl.vertexAttribPointer(attribute, elemPerVertex, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(attribute);
}

// http://mrdoob.com/projects/glsl_sandbox/
export	function cacheUniformLocation(gl, program, label) {
	if (!program.uniformsCache) {
		program.uniformsCache = {};
	}

	program.uniformsCache[label] = gl.getUniformLocation(program, label);
}
