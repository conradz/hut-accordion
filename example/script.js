var Accordion = require('../'),
    events = require('chi-events');

function $(selector) {
    return document.querySelector(selector);
}

var myAccordion = new Accordion($('#my-accordion'));

events($('#select-dogs')).on('click', function() {
    myAccordion.select($('#dog-section'));
});

events($('#collapse')).on('click', function() {
    myAccordion.select(null);
});