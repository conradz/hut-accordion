var EventEmitter = require('events').EventEmitter,
    events = require('chi-events'),
    classes = require('chi-classes');

function Accordion(element) {
    EventEmitter.call(this);

    this.element = element;
    this.selected = null;

    var headers = element.querySelectorAll(
            '.accordion-section > .accordion-header'),
        self = this;
    events(headers).on('click', function() {
        self.select(this.parentNode);
    });
}

Accordion.prototype = Object.create(EventEmitter.prototype);
Accordion.prototype.constructor = Accordion;

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

module.exports = Accordion;
