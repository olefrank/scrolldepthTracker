# ScrollDepthTracker
_ScrollDepthTracker_ is a lightweight JavaScript plugin useful for tracking how far down users scroll down into certain content on your web pages. _ScrollDepthTracker_ also reports time stamps when users has reached certain points (e.g. 0%, 20%, 40%, 60%, 80%, 100%). News papers and blogs use _ScrollDepthTracker_ to track scroll depth with time stamps when their articles is viewed. Make sure all articles are within a container element (e.g. #article), include _ScrollDepthTracker_ on your pages and start tracking!

**[Available at my github](https://github.com/olefrank/scrolldepthtracker/)**

## Features
_Coming soon!_

## Options
* **element** which element to track (default: ".article")
* **scrollDepthInterval** percentage to 'slice up' element - preferably divisable by 100 (default: 50)
* **eventHandler** name of external function to handle event broadcasting

## Demos
In the '''demo''' folder you can find various HTML pages to demo the plugin. Open the browsers console to view events.

## Contributing
Bug reports and code contributions are welcome. Please see [CONTRIBUTIONS.md](https://github.com/olefrank/scrolldepthTracker/blob/master/CONTRIBUTIONS.md).

## Contact
If you have any questions you can find me on Twitter at [@olefrankjensen](https://twitter.com/OleFrankJensen).

## Inspiration
In making this plugin I was inspired by:
* [Viljami S](http://blog.adtile.me/2014/01/16/a-dive-into-plain-javascript/) Wrote a blog post about migrating from jQuery to Vanilla JavaScript. I used some of his suggestion how to decide when an element is in view.
* [Addi Osmani](http://addyosmani.com/resources/essentialjsdesignpatterns/book/#modulepatternjavascript) Wrote a great (free) book about JavaScript programming. I used the "Revealing Module Pattern" for my plugin 'cause it's just - nice!