import Ember from 'ember';

export default Ember.Component.extend({
  currentFragmentShaderName: Ember.computed(function() {
    return Object.keys(this.get('shadersHash').fragment)[0];
  }),

  currentVertexShaderName: Ember.computed(function() {
    return Object.keys(this.get('shadersHash').vertex)[0];
  }),

  currentFragmentShader: Ember.computed('currentFragmentShaderName', function() {
    let shadersHash = this.get('shadersHash');
    let shaderName = this.get('currentFragmentShaderName');
    return shadersHash.fragment[shaderName];
  }),

  currentVertexShader: Ember.computed('currentVertexShaderName', function() {
    let shadersHash = this.get('shadersHash');
    let shaderName = this.get('currentVertexShaderName');
    return shadersHash.vertex[shaderName];
  }),

  fragmentShaderNames: Ember.computed(function() {
    return Object.keys(this.get('shadersHash').fragment);
  }),

  vertexShaderNames: Ember.computed(function() {
    return Object.keys(this.get('shadersHash').vertex);
  }),

  actions: {
    changeFragmentShader: function(shader) {
      this.set('currentFragmentShaderName', shader);
    }
  }
});
