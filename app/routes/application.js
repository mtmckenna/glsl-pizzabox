import Ember from 'ember';
import strings from 'glsl-pizzabox/ember-stringify';

export default Ember.Route.extend({
  model() {
    return strings;
  }
});
