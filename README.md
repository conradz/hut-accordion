# hut-accordion

[![Build Status](https://drone.io/github.com/conradz/hut-accordion/status.png)](https://drone.io/github.com/conradz/hut-accordion/latest)
[![Dependency Status](https://david-dm.org/conradz/hut-accordion.png)](https://david-dm.org/conradz/hut-accordion)

[![Selenium Test Status](https://saucelabs.com/browser-matrix/hut-accordion.svg)](https://saucelabs.com/u/hut-accordion)

## intro

A simple HTML accordion module that creates an accordion that displays one
section of content at a time from a list of sections. It contains a minimum
amount of styling so that you can customize it to your needs. See the
[example](http://conradz.github.io/hut-accordion/) to see it in action.

## usage

 1. Install using [npm](https://npmjs.org/) - `npm install --save hut-accordion`
 2. Import styling using [rework-npm](https://github.com/conradz/rework-npm/) -
    `@import "hut-accordion";`
 3. Load JS using [browserify](https://github.com/substack/node-browserify/) -
    `var Accordion = require('hut-accordion');`

## code

```html
<div id="my-accordion" class="hut-accordion">
    <div class="accordion-section">
        <header class="accordion-header">
            <h3>Main</h3>
        </header>
        <section class="accordion-content">
            <p>Some content for main section.</p>
        </section>
    </div>
    <div class="accordion-section">
        <header class="accordion-header">
            <h3>Cats</h3>
        </header>
        <section class="accordion-content">
            <p>Some cute kittens...</p>
        </section>
    </div>
    <div id="dog-section" class="accordion-section">
        <header class="accordion-header">
            <h3>Dogs</h3>
        </header>
        <section class="accordion-content">
            <p>Some cute puppies...</p>
        </section>
    </div>
</div>
```

```js
var Accordion = require('hut-accordion');

var myAccordion = new Accordion(document.querySelector('#my-accordion'));

// Open the dogs section
myAccordion.select(document.querySelector('#dog-section'));

// Collapse the currently opened section
myAccordion.select(null);
```

## reference

### `new Accordion(element)`

Creates a new accordion and attaches the event handlers. When created, no
sections are selected.

### `#selected`

Contains the currently selected `.accordion-section` element, or `null` if no
section is selected.

### `#toggle(element)`

If the section indicated by `element` is currently selected, it will be closed.
Otherwise the section will be selected.

### `#select([element])`

Selects a section. This will collapse any previously selected section. `element`
must be a `.accordion-section` element or else `null`. If `element` is `null` or
`undefined`, the currently selected section will be collapsed and no new section
will be selected.

### `Event: selected(element)`

Triggered when the selected section changes. `element` will be a
`.accordion-section` element or else `null` if no section is selected.
