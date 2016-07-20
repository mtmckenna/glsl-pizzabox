import Ember from 'ember';
import { compileShader,
	linkShader,
	cacheUniformLocation,
} from '../helpers/gl-helpers';

const pink = { r: 1.0, g: 0.75, b: 0.80 };

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

	currentProgram: Ember.computed('fragmentShader', function() {
		let gl = this.get('gl');
    var compiledVertexShader = compileShader(gl, gl.VERTEX_SHADER, this.get('vertexShader'));
    var compiledFragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, this.get('fragmentShader'));
		var program = linkShader(gl, compiledVertexShader, compiledFragmentShader);

		cacheUniformLocation(gl, program, 'time');
		cacheUniformLocation(gl, program, 'mouse');
		cacheUniformLocation(gl, program, 'resolution');
		cacheUniformLocation(gl, program, 'backbuffer');

		return program;
	}),

	gl: Ember.computed('element', function() {
		let canvas = this.get('element');
		return canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
	}),

  didInsertElement() {
		Ember.run.scheduleOnce('afterRender', () => {
      this.addEventListeners();
			this.resizeCanvas();
      this.configureCanvas();
			this.animate();
		});
	},

	willDestroyElement() {
		this.removeEventListeners();
	},

	configureCanvas() {
		let gl = this.get('gl');

		if (gl) {
			gl.clearColor(pink.r, pink.g, pink.b, 1.0);
			gl.enable(gl.DEPTH_TEST);
			gl.depthFunc(gl.LEQUAL);
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		} else {
			throw new Error("Nuts! Looks like your browser doesn't support WebGL.");
		}
	},

	animate() {
		this.renderWebGl();
		this.set('animationFrame', window.requestAnimationFrame(this.animate.bind(this)));
	},

	renderWebGl() {
		let canvas = this.get('element');
		let gl = this.get('gl');
		let program = this.get('currentProgram');
		let mouse = this.get('mousePosition');
		gl.useProgram(program);
		gl.clearColor(pink.r, pink.g, pink.b, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT);
		gl.useProgram(program);

    gl.uniform1f(program.uniformsCache['time'], this.time());
    gl.uniform2f(program.uniformsCache['mouse'], mouse.x, mouse.y);
		gl.uniform2f(program.uniformsCache['resolution'], canvas.width, canvas.height );
		gl.uniform1i(program.uniformsCache['backbuffer'], 0);

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
		let gl = canvas.getContext('webgl');
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

