'use strict';

var Accordion = require('../'),
    events = require('chi-events'),
    create = require('chi-create'),
    document = window.document,
    counter = 1;

function $(selector) {
    return document.querySelector(selector);
}

var element = $('#my-accordion'),
    accordion = new Accordion(element);

events($('#select-more')).on('click', function() {
    accordion.select($('#more-section'));
});

events($('#collapse')).on('click', function() {
    accordion.select(null);
});

events($('#add-section')).on('click', function() {
    var num = counter++,
        section = create('div', { 'class': 'accordion-section' },
            create('header', { 'class': 'accordion-header' },
                create('h3', 'Section ' + num)),
            create('section', { 'class': 'accordion-content' },
                create('p', 'Section ' + num + ' content.')));

    accordion.add(section);
});

events($('#remove-section')).on('click', function() {
    var sections = element.children;
    if (sections.length === 0) {
        return;
    }

    accordion.remove(sections[sections.length - 1]);
});
