import Ember from 'ember';

const pink = { r: 1.0, g: 0.75, b: 0.80 };

// https://github.com/mrdoob/glsl-sandbox
export default Ember.Component.extend({
  classNames: ['canvas-wrapper'],
  tagName: 'canvas',

  didInsertElement() {
		Ember.run.scheduleOnce("afterRender", () => {
      this.addEventListeners();
			this.resizeCanvas();
      this.configureCanvas();
		});
	},

	willDestroyElement() {
		this.removeEventListeners();
	},

	configureCanvas() {
		let canvas = this.get('element');
		let gl = canvas.getContext('webgl');
		if (gl) {
			gl.clearColor(pink.r, pink.g, pink.b, 1.0);
			gl.enable(gl.DEPTH_TEST);
			gl.depthFunc(gl.LEQUAL);
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		}
	},

	configureEventListeners() {
		this.set('resizeCanvas', this._resizeCanvas.bind(this));
  },

  addEventListeners() {
    this.configureEventListeners();
    window.addEventListener('resize', this.resizeCanvas, false);
  },

  removeEventListeners() {
    const element = this.get('element');
    element.removeEventListener('resize', this.resizeCanvas, false);
  },

  _resizeCanvas() {
		const width = window.innerWidth;
		const height = window.innerHeight;
		const canvas = this.get('element');
		let gl = canvas.getContext('webgl');
		canvas.width = width;
		canvas.height = height;
		gl.viewport(0, 0, canvas.width, canvas.height);
  }
});

