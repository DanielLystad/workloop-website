/**
 * WorkLoop Copy Loader
 *
 * Loads text content from site-copy.json and injects it into HTML elements
 * using data-copy attributes. This centralises all website copy in one file
 * for easy management and updates.
 *
 * Usage:
 *   <h1 data-copy="home.hero.title">Fallback text</h1>
 *   <p data-copy="home.hero.subtitle">Fallback text</p>
 *
 * Supports:
 *   data-copy          → sets innerHTML
 *   data-copy-text     → sets textContent (no HTML)
 *   data-copy-attr     → sets an attribute, e.g. data-copy-attr="placeholder:home.form.placeholder"
 *   data-copy-meta     → sets meta tag content, e.g. <meta data-copy-meta="home.meta.description">
 */
(function () {
  'use strict';

  var COPY_URL = '/copy/site-copy.json';
  var _copyData = null;
  var _loaded = false;
  var _callbacks = [];

  /**
   * Resolve a dot-notation path against an object.
   * e.g. resolve(obj, "home.hero.title") → obj.home.hero.title
   */
  function resolve(obj, path) {
    if (!obj || !path) return undefined;
    var parts = path.split('.');
    var current = obj;
    for (var i = 0; i < parts.length; i++) {
      if (current === undefined || current === null) return undefined;
      current = current[parts[i]];
    }
    return current;
  }

  /**
   * Apply copy data to all elements with data-copy attributes on the page.
   */
  function applyAll(data) {
    // data-copy → innerHTML
    var els = document.querySelectorAll('[data-copy]');
    for (var i = 0; i < els.length; i++) {
      var key = els[i].getAttribute('data-copy');
      var val = resolve(data, key);
      if (val !== undefined && val !== null) {
        els[i].innerHTML = String(val);
      }
    }

    // data-copy-text → textContent (safe, no HTML injection)
    var textEls = document.querySelectorAll('[data-copy-text]');
    for (var j = 0; j < textEls.length; j++) {
      var tKey = textEls[j].getAttribute('data-copy-text');
      var tVal = resolve(data, tKey);
      if (tVal !== undefined && tVal !== null) {
        textEls[j].textContent = String(tVal);
      }
    }

    // data-copy-attr → set attribute value
    // Format: "attrName:copy.path" e.g. "placeholder:global.formPlaceholders.email"
    var attrEls = document.querySelectorAll('[data-copy-attr]');
    for (var k = 0; k < attrEls.length; k++) {
      var spec = attrEls[k].getAttribute('data-copy-attr');
      var colonIdx = spec.indexOf(':');
      if (colonIdx === -1) continue;
      var attrName = spec.substring(0, colonIdx);
      var aKey = spec.substring(colonIdx + 1);
      var aVal = resolve(data, aKey);
      if (aVal !== undefined && aVal !== null) {
        attrEls[k].setAttribute(attrName, String(aVal));
      }
    }

    // data-copy-meta → set <meta> content attribute
    var metaEls = document.querySelectorAll('[data-copy-meta]');
    for (var m = 0; m < metaEls.length; m++) {
      var mKey = metaEls[m].getAttribute('data-copy-meta');
      var mVal = resolve(data, mKey);
      if (mVal !== undefined && mVal !== null) {
        metaEls[m].setAttribute('content', String(mVal));
      }
    }
  }

  /**
   * Load site-copy.json and apply to page.
   */
  function loadCopy() {
    if (_loaded && _copyData) {
      applyAll(_copyData);
      return;
    }

    fetch(COPY_URL)
      .then(function (res) { return res.json(); })
      .then(function (data) {
        _copyData = data;
        _loaded = true;

        // Make copy data globally accessible for JS that needs it
        window.__SITE_COPY = data;

        applyAll(data);

        // Fire any registered callbacks
        for (var i = 0; i < _callbacks.length; i++) {
          _callbacks[i](data);
        }
        _callbacks = [];
      })
      .catch(function (err) {
        console.warn('[CopyLoader] Failed to load site-copy.json:', err);
        // Fallback: text already in HTML will remain visible
      });
  }

  /**
   * Public API: register a callback for when copy data is ready.
   * If already loaded, fires immediately.
   */
  function onCopyReady(callback) {
    if (_loaded && _copyData) {
      callback(_copyData);
    } else {
      _callbacks.push(callback);
    }
  }

  /**
   * Public API: get a copy value by dot-path.
   * Returns undefined if not yet loaded or path not found.
   */
  function getCopy(path) {
    return resolve(_copyData, path);
  }

  // Expose public API
  window.CopyLoader = {
    onReady: onCopyReady,
    get: getCopy,
    resolve: resolve,
    reload: loadCopy
  };

  // Auto-load on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadCopy);
  } else {
    loadCopy();
  }
})();
