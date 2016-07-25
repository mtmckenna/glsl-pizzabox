import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import strings from 'glsl-pizzabox/ember-stringify';

moduleForComponent('pizzabox-wrapper', 'Integration | Component | pizzabox wrapper', {
  integration: true
});

test('it renders', function(assert) {
  this.set('shadersHash', strings);
  this.render(hbs`{{pizzabox-wrapper shadersHash=shadersHash}}`);
  assert.equal(this.$().text().trim(), 'glsl-sandbox-2.glsl');
});
