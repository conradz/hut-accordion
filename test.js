'use strict';

var tape = require('tape'),
    Accordion = require('./'),
    classes = require('chi-classes'),
    events = require('chi-events'),
    create = require('chi-create'),
    body = window.document.body;

function createStructure() {
    return create('div', { 'class': 'hut-accordion' },
        create('div', { 'class': 'accordion-section section-1' },
            create('header', { 'class': 'accordion-header header-1' },
                create('h3', 'Header 1')
            ),
            create('section', { 'class': 'accordion-content' },
                create('p', 'Section 1 content')
            )
        ),
        create('div', { 'class': 'accordion-section section-2' },
            create('header', { 'class': 'accordion-header header-2' },
                create('h3', 'Header 2')
            ),
            create('section', { 'class': 'accordion-content' },
                create('p', 'Section 2 content')
            )
        )
    );
}

function test(name, func) {
    tape(name, function(t) {
        var dom = createStructure();
        body.appendChild(dom);
        func(t, dom);
        body.removeChild(dom);
    });
}

test('create accordion', function(t, el) {
    var a = new Accordion(el);

    t.equal(a.element, el);
    t.equal(a.selected, null);
    t.end();
});

test('select accordion section', function(t, el) {
    var section = el.querySelector('.section-2'),
        a = new Accordion(el);
    a.select(section);

    t.equal(a.selected, section);
    t.ok(classes(section).has('accordion-selected'));
    t.end();
});

test('selecting section closes other sections', function(t, el) {
    var section1 = el.querySelector('.section-1'),
        section2 = el.querySelector('.section-2'),
        a = new Accordion(el);
    a.select(section1);
    a.select(section2);

    t.ok(classes(section2).has('accordion-selected'));
    t.notOk(classes(section1).has('accordion-selected'));
    t.equal(a.selected, section2);
    t.end();
});

test('switching section adds the accordion-removing class', function(t, el) {
    var section1 = el.querySelector('.section-1'),
        section2 = el.querySelector('.section-2'),
        a = new Accordion(el);
        
    a.select(section1);
    t.notOk(classes(el).has('accordion-removing'));
    
    a.select(section2);
    t.ok(classes(el).has('accordion-removing'));
    
    a.select(null);
    a.select(section1);
    t.notOk(classes(el).has('accordion-removing'));
    
    t.end();
});

test('clicking section header toggles section', function(t, el) {
    var section = el.querySelector('.section-1'),
        header = el.querySelector('.header-1'),
        a = new Accordion(el);
        
    events(header).trigger('click');
    t.equal(a.selected, section);
    
    events(header).trigger('click');
    t.equal(a.selected, null);
    
    t.end();
});

test('selecting section triggers the select event', function(t, el) {
    var selected = null,
        section = el.querySelector('.section-1'),
        a = new Accordion(el);
    a.on('select', function(s) { selected = s; });

    a.select(section);
    t.equal(selected, section);

    a.select(null);
    t.equal(selected, null);

    t.end();
});

test('toggle opens a section if it is not currently selected', function(t, el) {
    var section = el.querySelector('.section-1'),
        a = new Accordion(el);
    a.toggle(section);
    
    t.equal(a.selected, section);
    t.end();
});

test('toggle closes a section if it is currently selected', function(t, el) {
    var section = el.querySelector('.section-1'),
        a = new Accordion(el);
    a.select(section);
    a.toggle(section);
    
    t.equal(a.selected, null);
    t.end();
});
