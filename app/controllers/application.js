import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: {
    fragmentShaderName: 'fragment-shader'
  },

  actions: {
    changeFragmentShader: function(newShaderName) {
      this.set('fragmentShaderName', newShaderName);
    }
  }
});
