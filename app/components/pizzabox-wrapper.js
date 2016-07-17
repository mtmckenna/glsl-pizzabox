import Ember from 'ember';

export default Ember.Component.extend({
  currentShader: Ember.computed(function() {
    return Object.keys(this.get('shadersHash'))[0];
  }),

  shaders: Ember.computed(function() {
    return Object.keys(this.get('shadersHash'));
  }),

  actions: {
    changeShader: function(shader) {
      this.set('currentShader', shader);
    }
  }
});
