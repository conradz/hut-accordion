'use strict';

var Emitter = require('emitter-component'),
    events = require('chi-events'),
    classes = require('chi-classes'),
    inheritPrototype = require('mout/lang/inheritPrototype'),
    find = require('mout/array/find'),
    forEach = require('mout/array/forEach'),
    remove = require('mout/array/remove');

module.exports = Accordion;

function Accordion(element) {
    Emitter.call(this);

    this.element = element;
    this.selected = null;
    this._sections = [];

    var sections = element.querySelectorAll('.accordion-section');
    forEach(sections, this._add, this);
}

inheritPrototype(Accordion, Emitter);

Accordion.prototype._add = function(el) {
    var self = this,
        header = el.querySelector('.accordion-header'),
        event = events(header).on('click', select);

    function select(e) {
        e.preventDefault();
        self.toggle(el);
    }

    this._sections.push({
        el: el,
        click: event
    });
};

Accordion.prototype.add = function(el) {
    this.element.appendChild(el);
    this._add(el);
};

Accordion.prototype.remove = function(el) {
    var section = find(
        this._sections,
        function(s) { return s.el === el; });
    if (!section) {
        return;
    }

    if (this.selected === el) {
        this.select(null);
    }
    section.click.remove();
    remove(this._sections, section);
    this.element.removeChild(el);
};

Accordion.prototype.clear = function() {
    var sections = this._sections.slice();

    forEach(sections,  function(section) {
        this.remove(section.el);
    }, this);
};

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
