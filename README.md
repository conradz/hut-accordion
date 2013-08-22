# hut-accordion

HTML UI Toolkit accordion component

A simple accordion where only one section can be opened at a time from multiple
sections.

## Example

[View the live example](http://conradz.github.io/hut-accordion)

With the following HTML:

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

Give it accordion behavior with the following JS:

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

### `#select([element])`

Selects a section. This will collapse any previously selected section. `element`
must be a `.accordion-section` element or else `null`. If `element` is `null` or
`undefined`, the currently selected section will be collapsed and no new section
will be selected.

### `Event: selected(element)`

Triggered when the selected section changes. `element` will be a
`.accordion-section` element or else `null` if no section is selected.

## Style Reference

The base CSS style only defines basic layout and formatting of the accordion.
You should add your own style when using it. Import the base style by using
[npm-css](https://github.com/shtylman/npm-css) and add `@import "hut-modal"` to
your stylesheet. Use the selectors defined below for your own styling.

### `.hut-accordion`

The root of each accordion component. This element contains all the sections in
the accordion.

### `.accordion-section`

An accordion section, which must be nested inside of the `.hut-accordion`
element.

### `.accordion-section.accordion-selected`

The `.accordion-selected` class is added to the `.accordion-section` element
when that section is currently the selected section.

### `.accordion-header`

The header element for a section. This is nested inside the `.accordion-section`
element.

### `.accordion-content`

The content element for a section. This section is normally hidden when not
selected. This is nested inside the `.accordion-section` element.