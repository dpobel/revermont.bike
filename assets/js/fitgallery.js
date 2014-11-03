/* global domready */
(function (global, domReady, L) {
    "use strict";

    var RB = global.RB = global.RB || {},
        doc = global.document,
        container, width,
        elements;

    function init(conf) {
        container = doc.querySelector(conf.container);
        width = container.clientWidth;
        elements = doc.querySelectorAll(conf.elements);
        fitGallery();
    }

    function fitRow(offset, rowWidth, elements) {
        elements.forEach(function (element) {
            element.style.width = Math.round(element.offsetWidth - offset * element.offsetWidth/rowWidth) + 'px';
        });
    }

    function fitGallery() {
        var i, rowWidth = 0, rowElements = [];

        for (i = 0; i != elements.length; i++) {
            if ( rowElements.length === 0 ) {
                elements[i].classList.add('gallery-photo-first');
            }
            rowElements.push(elements[i]);
            rowWidth += elements[i].offsetWidth;
            if ( rowWidth > width ) {
                fitRow(rowWidth - width, rowWidth, rowElements);
                rowWidth = 0;
                rowElements = [];
            }
        }
    }

    RB.fitGallery = function (config) {
        domReady(function () {
            init(config);
        });
    };
})(window, domready);
