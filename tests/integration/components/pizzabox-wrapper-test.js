import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('pizzabox-wrapper', 'Integration | Component | pizzabox wrapper', {
  integration: true
});

test('it renders', function(assert) {
  this.set('shadersHash', {pizza1: 'cheese', pizza2: 'mushroom'});
  this.render(hbs`{{pizzabox-wrapper shadersHash=shadersHash}}`);
  assert.equal(this.$().text().trim(), 'pizza1');
});
