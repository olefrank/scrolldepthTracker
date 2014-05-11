; // defensive programming: script may be concatenated with others

/*
 * ScrollDepth | v0.5
 * Copyright (c) 2014 Ole Frank Jensen
 * Licensed under the MIT license
 */

var AttentionTracker = (function() {

    "use strict";

    var scrollDepthIterator = 0;
    var scrollDepth = -1;
    var scrollDelay;
    var scrollTimeStart;

    /**
     * Object to hold default settings
     * @element: DOM element to track
     * @scrollDepthPercentage: size of slices to measure content with
     * @eventHandler: function to handle event broadcasting
     */
    var settings = {
        element: document.querySelector(".article"),
        scrollDepthPercentage: 20,
        eventHandler: broadcastEvent
    };

    /**
     * Central function for binding all event listeners
     */
    function bindDOMEvents() {

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

    function getScrollDepth() {
        var result;
        var rect = settings.element.getBoundingClientRect();
        var elementTop = rect.top;
        var elementHeight = rect.height;
        var viewBottom = window.innerHeight;
        var slicePct = settings.scrollDepthPercentage / 100;

        // if element is in view
        if (elementTop <= viewBottom) {
            result = (viewBottom - elementTop) / elementHeight;

            // save time for first scroll event
            if (scrollTimeStart === undefined) {
                scrollTimeStart = new Date();
            }

            // round down to nearest
            result = result > 1 ? 1 : ~~(result / slicePct) * slicePct;
        }

        return result;
    }

    function getScrollDepthEventMessage(depth) {
        var messageTxt;
        var message;
        var slicePct = settings.scrollDepthPercentage / 100;
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

    return {
        init: init
    };

})();
