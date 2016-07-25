import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import strings from 'glsl-pizzabox/ember-stringify';

moduleForComponent('canvas-wrapper', 'Integration | Component | canvas wrapper', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.set('currentVertexShader', strings['vertex']['basic.glsl']);
  this.set('currentFragmentShader', strings['fragment']['green.glsl']);

  this.render(hbs`{{canvas-wrapper fragmentShader=currentFragmentShader vertexShader=currentVertexShader}}`);

  assert.equal(this.$().text().trim(), '');
});
