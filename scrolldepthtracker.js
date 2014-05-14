; // defensive programming: script may be concatenated with others

/*
 * ScrollDepthTracker | v0.1
 * Copyright (c) 2014 Ole Frank Jensen
 * Licensed under the MIT license
 */

var ScrollDepthTracker = (function() {

    "use strict";

    var scrollDepthIterator = 0;
    var scrollDepth = -1;
    var scrollDelay;
    var scrollTimeStart;

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

        // when user scrolls: calculate scroll depth
        // calculation happens after delay (150 ms)
        window.onscroll = function() {
            clearTimeout(scrollDelay);
            scrollDelay = setTimeout(function() {

                var sd = getScrollDepth();
                if (sd > scrollDepth) {
                    scrollDepth = sd;
                    settings.eventHandler(getScrollDepthEventMessage(scrollDepth));
                }

            }, 150);
        };

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
        var elementHeight = rect.height;
        var viewBottom = window.innerHeight;
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
    function getScrollDepthEventMessage(depth) {
        var messageTxt;
        var message;
        var slicePct = settings.scrollDepthInterval / 100;
        var depthTmp = 0;
        var timeDiff = new Date().getTime() - scrollTimeStart.getTime();

        while (depthTmp < depth) {
            depthTmp = (scrollDepthIterator * slicePct) < 1 ? (scrollDepthIterator * slicePct) : 1;
            messageTxt = "sd_" + Math.round(depthTmp * 100) + "=" + timeDiff;

            if (message === undefined) {
                message = messageTxt;
            }
            else {
                message += "&" + messageTxt;
            }

            scrollDepthIterator++;
        }

        // first scroll depth measure (fake)
        if (scrollDepthIterator === 0) {
            message = "sd_0=0"
            scrollDepthIterator++;
        }

        return message;
    }

    /**
     * Send events
     * @param message: event message
     */
    function broadcastEvent(message) {
        console.log("simulate event: " + message);
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
