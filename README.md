# pub-pager

* client-side router (visionmedia/page) plugin for pub-generator
* translates window.click events for intra-site links to generator.nav events
* generator.nav events are then handled by jqueryview to update the DOM

### Installation

pub-pager is included with pub-server.

Add `pub-pager` to the `generatorPlugins` key in your `pub-config`.

Clients transition to single-page-app mode, by calling `generator.initPager()`

```js
$.getScript(pubRef.relPath + '/pub/_generator.js');
window.onGeneratorLoaded = function(generator) { generator.initPager(); };
```

### How it works

- `pager.js` loads the `page` module which takes over click events and manages browser history. Any internal link to another page will trigger a generator `nav` event.

- `jqueryview.js` listens for generator 'nav', 'loaded', and 'updatedText' events and emits 'update-view' when content in the DOM has been replaced with newly generated HTML. This allows the same mechanism to be used for offline navigation as well as source changes in an editor.

### html template guidelines

When content is modified an attempt is made to determine whether the edit affects the layout, the page or fragment container, or just the  html rendered from markdown

In order to maximize responsiveness, the editor relies on data attributes on html tags to replace just the affected HTML


- `data-render-layout` = name of layout template - wrapper auto-inserted by {{{renderLayout}}})
- `data-render-page` = name of page template - wrapper div auto-inserted by  {{{renderPage}}}
- `data-render-html` = _href of fragment or page - wrapper div auto-inserted by {{{html}}}