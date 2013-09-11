# hut-accordion

[![NPM](https://nodei.co/npm/hut-accordion.png?compact=true)](https://nodei.co/npm/hut-accordion/)

[![Build Status](https://drone.io/github.com/conradz/hut-accordion/status.png)](https://drone.io/github.com/conradz/hut-accordion/latest)
[![Dependency Status](https://gemnasium.com/conradz/hut-accordion.png)](https://gemnasium.com/conradz/hut-accordion)

HTML UI Toolkit accordion component

Check out the [example](http://conradz.github.io/hut-accordion)!

An accordion where only one section can be opened at a time from multiple
sections.

## Example

Use the following HTML and JS to create an accordion. When a header is clicked,
it will be opened. If that section is currently opened, it will be closed.

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

## JS Reference

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
