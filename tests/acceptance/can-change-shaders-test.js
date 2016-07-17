import { test } from 'qunit';
import moduleForAcceptance from 'glsl-pizzabox/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | can change shaders');

test('can change shaders', function(assert) {
  visit('/');

  andThen(function() {
    assert.equal(currentURL(), '/');
  });
});
