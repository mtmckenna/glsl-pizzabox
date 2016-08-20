import Ember from 'ember';
import GlMatrix from 'npm:gl-matrix';
import {
  compileShader,
  linkShader,
  cacheUniformLocation
} from '../helpers/gl-helpers';

const GRAY = { r: 0.75, g: 0.75, b: 0.75 };
const UNIFORM_NAMES = [
  'time',
  'mouse',
  'resolution',
  'modelMatrix',
  'viewMatrix',
  'projectionMatrix'
];

// https://github.com/mrdoob/glsl-sandbox
export default Ember.Component.extend({
  classNames: ['canvas-wrapper'],
  tagName: 'canvas',

  init() {
    this._super(...arguments);
    this.configureViewMatrix();
    this.configureProjectionMatrix();
  },

  configureViewMatrix() {
    let viewMatrix = this.get('viewMatrix');
    GlMatrix.mat4.lookAt(viewMatrix, [0, 0, 0], [0, 0, 0], [0, 1, 0]);
  },

  configureProjectionMatrix() {
    let projectionMatrix = this.get('projectionMatrix');
    GlMatrix.mat4.ortho(projectionMatrix, -1, 1, -1, 1, 2, -2);
  },

  time() {
    return (Date.now() - this.get('startTime')) / 1000.0;
  },

  startTime: Date.now(),

  shouldRotate: false,

  dragPosition: null,

  mousePosition: {
    x: 0, y: 0
  },

  modelMatrix: GlMatrix.mat4.create(),

  viewMatrix: GlMatrix.mat4.create(),

  projectionMatrix: GlMatrix.mat4.create(),

  programFromCompiledShaders(gl, vertexShader, fragmentShader) {
    var compiledVertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexShader);
    var compiledFragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShader);
    return linkShader(gl, compiledVertexShader, compiledFragmentShader);
  },

  currentProgram: Ember.computed('fragmentShader', function() {
    let gl = this.get('gl');
    let vertexShader = this.get('vertexShader');
    let fragmentShader = this.get('fragmentShader');
    let program = this.programFromCompiledShaders(gl, vertexShader, fragmentShader);

    UNIFORM_NAMES.forEach(function(uniformName) {
      cacheUniformLocation(gl, program, uniformName);
    });

    return program;
  }),

  gl: Ember.computed(function() {
    let canvas = this.get('element');
    var context;

    if (canvas) {
      context = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    }

    return context;
  }),

  didInsertElement() {
    Ember.run.scheduleOnce('afterRender', () => {
      if (this.get('gl')) {
        this.performInitialWebGlSetup();
      }
    });
  },

  performInitialWebGlSetup() {
    this.addEventListeners();
    this.resizeCanvas();
    this.configureCanvas();
    this.animate();
  },

  willDestroyElement() {
    this.removeEventListeners();
  },

  configureCanvas() {
    let gl = this.get('gl');
    if (gl) { this.clearGl(gl); }
  },

  clearGl(gl) {
    gl.clearColor(GRAY.r, GRAY.g, GRAY.b, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  },

  setUniformsOnGl(gl, program) {
    let canvas = this.get('element');
    let mouse = this.get('mousePosition');
    let time = this.time();
    gl.uniform1f(program.uniformsCache['time'], time);
    gl.uniform2f(program.uniformsCache['mouse'], mouse.x, mouse.y);
    gl.uniform2f(program.uniformsCache['resolution'], canvas.width, canvas.height );
    gl.uniformMatrix4fv(program.uniformsCache['modelMatrix'], false, this.get('modelMatrix'));
    gl.uniformMatrix4fv(program.uniformsCache['viewMatrix'], false, this.get('viewMatrix'));
    gl.uniformMatrix4fv(program.uniformsCache['projectionMatrix'], false, this.get('projectionMatrix'));
  },

  setVerticesOnGl(gl, program) {
    var positionLocation = gl.getAttribLocation(program, 'position');
    var buffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1.0, -1.0,
      1.0, -1.0,
      -1.0,  1.0,
      -1.0,  1.0,
      1.0, -1.0,
      1.0,  1.0
    ]),
    gl.STATIC_DRAW);

    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
  },

  animate() {
    if (!this.get('gl')) { return; }
    this.renderWebGl();
    this.set('animationFrame', window.requestAnimationFrame(this.animate.bind(this)));
  },

  renderWebGl() {
    let gl = this.get('gl');
    let program = this.get('currentProgram');
    gl.useProgram(program);
    this.clearGl(gl);
    this.setUniformsOnGl(gl, program);
    this.setVerticesOnGl(gl, program);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  },

  configureEventListeners() {
    this.set('resizeCanvas', this._resizeCanvas.bind(this));
    this.set('mouseMoved', this._mouseMoved.bind(this));
    this.set('mouseDown', this._mouseDown.bind(this));
    this.set('mouseUp', this._mouseUp.bind(this));
  },

  handleSurfaceRotation(event) {
    let shouldRotate = this.get('shouldRotate');
    if (!shouldRotate) { return; }

    let dragPosition = this.get('dragPosition');
    if (!dragPosition) { dragPosition = this.normalizedCoordinates(event); }
    let newPosition = this.normalizedCoordinates(event);
    let x = newPosition.x - dragPosition.x;
    let y = newPosition.y - dragPosition.y;
    this.set('dragPosition', newPosition);

    this.rotateSurface(x, y);
  },

  rotateSurface(x, y) {
    let model = this.get('modelMatrix');
    GlMatrix.mat4.rotateX(model, model, -y);
    GlMatrix.mat4.rotateY(model, model, -x);
  },

  addEventListeners() {
    let canvas = this.get('element');
    this.configureEventListeners();
    window.addEventListener('resize', this.resizeCanvas, false);
    window.addEventListener('mousemove', this.mouseMoved, false);
    canvas.addEventListener('mousedown', this.mouseDown, false);
    canvas.addEventListener('mouseup', this.mouseUp, false);
  },

  removeEventListeners() {
    let canvas = this.get('element');
    window.removeEventListener('resize', this.resizeCanvas, false);
    window.removeEventListener('mousemove', this.mouseMoved, false);
    canvas.removeEventListener('mousedown', this.mouseDown, false);
    canvas.removeEventListener('mouseup', this.mouseUp, false);
  },

  normalizedCoordinates(event) {
    return {
      x: event.clientX / window.innerWidth,
      y: 1 - event.clientY / window.innerHeight
    };
  },

  _resizeCanvas() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const canvas = this.get('element');
    let gl = this.get('gl');

    canvas.width = width;
    canvas.height = height;
    gl.viewport(0, 0, canvas.width, canvas.height);
  },

  _mouseMoved(event) {
    this.set('mousePosition', this.normalizedCoordinates(event));
    this.handleSurfaceRotation(event);
  },

  _mouseDown() {
    this.set('shouldRotate', true);
  },

  _mouseUp() {
    this.set('shouldRotate', false);
    this.set('dragPosition', null);
  }
});

