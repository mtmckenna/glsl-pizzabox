import Ember from 'ember';
import { compileShader,
  linkShader,
  cacheUniformLocation
} from '../helpers/gl-helpers';

const PINK = { r: 1.0, g: 0.75, b: 0.80 };
const UNIFORM_NAMES = ['time', 'mouse', 'resolution', 'backBuffer'];

// https://github.com/mrdoob/glsl-sandbox
export default Ember.Component.extend({
  classNames: ['canvas-wrapper'],
  tagName: 'canvas',

  init() {
    this._super(...arguments);
    this.set('startTime', Date.now());
  },

  time() {
    return (Date.now() - this.get('startTime')) / 1000.0;
  },

  mousePosition: {
    x: 0, y: 0
  },

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
    gl.clearColor(PINK.r, PINK.g, PINK.b, 1.0);
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
    gl.uniform1i(program.uniformsCache['backbuffer'], 0);
  },

  setVerticesOnGl(gl, program) {
    var positionLocation = gl.getAttribLocation(program, 'aPosition');
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
  },

  addEventListeners() {
    this.configureEventListeners();
    window.addEventListener('resize', this.resizeCanvas, false);
    window.addEventListener('mousemove', this.mouseMoved, false);
  },

  removeEventListeners() {
    const element = this.get('element');
    element.removeEventListener('resize', this.resizeCanvas, false);
    element.removeEventListener('mousemove', this.mouseMoved, false);
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
    let mouse = this.get('mousePosition');
    mouse.x = event.clientX / window.innerWidth;
    mouse.y = 1 - event.clientY / window.innerHeight;
  }
});

