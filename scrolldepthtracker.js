; // defensive programming: script may be concatenated with others

/*
 * ScrollDepthTracker | v0.1
 * Copyright (c) 2014 Ole Frank Jensen
 * Licensed under the MIT license
 */

var ScrollDepthTracker = (function() {

    "use strict";

    var lastScrollDepth = -1;
    var scrollDelay;
    var scrollTimeStart;
    var elementHeight;
    var viewBottom;

    /**
     * Object to hold default settings
     * @element: DOM element to track
     * @scrollDepthInterval: size of slices to measure content with
     * @eventHandler: function to handle event broadcasting
     */
    var settings = {
        element: document.querySelector(".article"),
        scrollDepthInterval: 20,
        eventHandler: broadcastEvent
    };

    /**
     * Central function for binding all event listeners
     */
    function bindDOMEvents() {

        // handle cross browser event listeners
        var addEventListener = function (element, type, handler) {
            if (element.addEventListener) {
                return element.addEventListener(type, handler, false)
            }
            else if (element.attachEvent) {
                return element.attachEvent("on" + type, handler)
            }
        };

        // add eventlisteners
        addEventListener(window, "scroll", onScrollHandler);

        // when user scrolls: calculate scroll depth
        // calculation happens after delay (150 ms)
        function onScrollHandler() {
            clearTimeout(scrollDelay);
            scrollDelay = setTimeout(function() {

                var sd = getScrollDepth();
                if (sd > lastScrollDepth) {
                    lastScrollDepth = sd;
                    settings.eventHandler(getScrollDepthEvent(lastScrollDepth));
                }

            }, 150);
        }

    }

    /**
     * Calculate scroll depth
     * Scroll depth can be in range 0-1
     * Scroll depth is limited to intervals defined in settings 
     * @return result: current scroll depth (number)
     */
    function getScrollDepth() {
        var result;
        var rect = settings.element.getBoundingClientRect();
        var elementTop = rect.top;
        elementHeight = rect.height;
        viewBottom = window.innerHeight;
        var slicePct = settings.scrollDepthInterval / 100;

        // if element is in view
        if (elementTop <= viewBottom) {
            result = (viewBottom - elementTop) / elementHeight;

            // store time for first scroll event
            if (scrollTimeStart === undefined) {
                scrollTimeStart = new Date();
            }

            // round down to nearest
            result = result > 1 ? 1 : ~~(result / slicePct) * slicePct;
        }

        return result;
    }

    /**
     * Generate scroll depth event string
     * Event string consists of scroll depths and time stamps
     * Example: "sd_20=1500"
     * Example: "sd_40=2500&sd_60=2500&sd_80=2500"
     * @param depth: current scroll depth
     * @return message: string describing scroll depth event
     */
    function getScrollDepthEvent(depth) {
        var result;
        var timeDiff = new Date().getTime() - scrollTimeStart.getTime();

        result = {
            scrolldepth: Math.round(depth * 100),
            timestamp: timeDiff,
            viewportHeight: viewBottom,
            elementHeight: elementHeight
        };

        return result;
    }

    /**
     * Send events
     * @param eventObj: event eventObj
     */
    function broadcastEvent(eventObj) {
        console.log("--- simulate event ---");
        console.log(eventObj);
    }

    /**
     * Merge user settings with default settings
     * User settings overwrite default settings where applied
     * @param userSettings: settings the user has specified
     */
    function mergeSettings(userSettings) {
        for (var key in userSettings) {
            settings[key] = userSettings[key];
        }
    }

    /**
     * Start tracking attention!
     * @param userSettings: settings the user has specified
     */
    function init(userSettings) {
        mergeSettings(userSettings);
        bindDOMEvents();
    }

    // define plugin interface
    return {
        init: init
    };

})();
