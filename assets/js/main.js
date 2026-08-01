(function () {
  'use strict';

  var MOBILE_BREAKPOINT = 768;

  // Mirrors Squarespace's dynamic text sizing formula for image cards:
  // fontSize = vwMultiplier × containerTextWidth
  // Verified against live site at 1440px: title 42.7px, subtitle 17.1px.
  var DYNAMIC_TEXT_RULES = [
    ['.image-title-wrapper',    0.12],
    ['.image-subtitle-wrapper', 0.048],
    ['.image-button-wrapper',   0.036]
  ];

  function initDynamicText() {
    document.querySelectorAll('.image-block-outer-wrapper').forEach(function (block) {
      DYNAMIC_TEXT_RULES.forEach(function (rule) {
        var selector = rule[0];
        var multiplier = rule[1];
        var wrapper = block.querySelector(selector);
        if (!wrapper) { return; }
        var dynEl = wrapper.querySelector('.sqs-dynamic-text');
        if (!dynEl) { return; }

        var width = dynEl.clientWidth;
        if (!width) { return; }

        var fontSize = (multiplier * width).toFixed(2) + 'px';
        // setProperty with 'important' overrides site.css !important declarations
        dynEl.style.setProperty('font-size', fontSize, 'important');
        dynEl.querySelectorAll('p').forEach(function (p) {
          p.style.setProperty('font-size', fontSize, 'important');
        });
      });
      block.classList.add('sqs-text-ready');
    });
  }

  function updateNavMode() {
    if (window.innerWidth < MOBILE_BREAKPOINT) {
      document.body.classList.add('force-mobile-nav');
    } else {
      document.body.classList.remove('force-mobile-nav', 'mobile-nav-open');
    }
  }

  function init() {
    initDynamicText();
    updateNavMode();

    var resizeTimeout;
    window.addEventListener('resize', function () {
      updateNavMode();
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(initDynamicText, 150);
    });

    document.querySelectorAll('.mobile-nav-toggle').forEach(function (toggle) {
      toggle.addEventListener('click', function () {
        document.body.classList.toggle('mobile-nav-open');
      });
    });

    var overlay = document.querySelector('.body-overlay');
    if (overlay) {
      overlay.addEventListener('click', function () {
        document.body.classList.remove('mobile-nav-open');
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());
