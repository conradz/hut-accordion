var test = require('tape'),
    Accordion = require('./'),
    classes = require('chi-classes'),
    events = require('chi-events'),
    create = require('chi-create');

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

test('create accordion', function(t) {
    var el = createStructure(),
        a = new Accordion(el);

    t.equal(a.element, el);
    t.equal(a.selected, null);
    t.end();
});

test('select accordion section', function(t) {
    var el = createStructure(),
        section = el.querySelector('.section-2'),
        a = new Accordion(el);
    a.select(section);

    t.equal(a.selected, section);
    t.ok(classes(section).has('accordion-selected'));
    t.end();
});

test('selecting section closes other sections', function(t) {
    var el = createStructure(),
        section1 = el.querySelector('.section-1'),
        section2 = el.querySelector('.section-2'),
        a = new Accordion(el);
    a.select(section1);
    a.select(section2);

    t.ok(classes(section2).has('accordion-selected'));
    t.notOk(classes(section1).has('accordion-selected'));
    t.equal(a.selected, section2);
    t.end();
});

test('clicking section header selects section', function(t) {
    var el = createStructure(),
        section = el.querySelector('.section-1'),
        header = el.querySelector('.header-1'),
        a = new Accordion(el);
    events(header).trigger('click');

    t.equal(a.selected, section);
    t.end();
});

test('selecting section triggers the select event', function(t) {
    var el = createStructure(),
        selected = null,
        section = el.querySelector('.section-1'),
        a = new Accordion(el);
    a.on('select', function(s) { selected = s; });

    a.select(section);
    t.equal(selected, section);

    a.select(null);
    t.equal(selected, null);

    t.end();
})