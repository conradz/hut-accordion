'use strict';

var Emitter = require('emitter-component'),
    events = require('chi-events'),
    classes = require('chi-classes'),
    inheritPrototype = require('mout/lang/inheritPrototype');

module.exports = Accordion;

function Accordion(element) {
    Emitter.call(this);

    this.element = element;
    this.selected = null;
    this._sections = [];

    var self = this;
    events(element)
        .children('.accordion-header')
        .on('click', function(e) {
            e.preventDefault();

            var section = this.parentNode;
            self.toggle(section);
        });
}

inheritPrototype(Accordion, Emitter);

Accordion.prototype.toggle = function(section) {
    if (this.selected === section) {
        section = null;
    }

    this.select(section);
};

Accordion.prototype.select = function(section) {
    if (this.selected === section) {
        return;
    }

    if (this.selected !== null) {
        var current = this.selected;
        classes(current).remove('accordion-selected');
        classes(this.element).add('accordion-removing');
    } else {
        classes(this.element).remove('accordion-removing');
    }

    if (section) {
        classes(section).add('accordion-selected');
        this.selected = section;
    } else {
        this.selected = null;
    }

    this.emit('select', this.selected);
};
