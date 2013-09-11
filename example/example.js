var Accordion = require('../'),
    events = require('chi-events'),
    document = window.document;

function $(selector) {
    return document.querySelector(selector);
}

var myAccordion = new Accordion($('#my-accordion'));

events($('#select-more')).on('click', function() {
    myAccordion.select($('#more-section'));
});

events($('#collapse')).on('click', function() {
    myAccordion.select(null);
});
