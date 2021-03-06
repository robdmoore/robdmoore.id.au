---
layout: post
title: Source Code Indentation
date: 2011-03-05 19:09:38.000000000 +08:00
type: post
categories:
- Technical
tags:
- IDE
- semantics
- text editor
- Visual Studio
author: rob
---


I **hate** using spaces for indentation. I'm just putting it out there. My work mates think it's a bit silly to have such a strong opinion on such a minor (mostly invisible) thing, however the pedantic perfectionist in me feels strongly about this.



Why do I hate using spaces for indentation? I'll let the comparative advantages (and disadvantages) speak for themselves.



<!--more-->


## Spaces

- Dumb text editors  that don't allow you to control tab size and show it as a massive amount of space (**\*cough\***notepad)  don't show the code up nicely since you mostly want a smaller tab size for readability.
- Further to the last one, Unix consoles don't give you control over tab size and thus your code might not fit into the console screen whereas it might if you chose how many spaces you wanted.
- Spaces mean that sequential related lines of code can be indented at the appropriate relative level no matter what the tab size (see [Smart Tabs](http://www.emacswiki.org/emacs/SmartTabs "Smart Tabs")).


## Tabs

- Everyone can control how "big" your indentation appears to them if they are using a text editor that gives then that ability (most do), if they like massive indentation then they can make it 8 spaces, vice versa they can make it 2 spaces worth if they like that (I prefer 4).
- Further to the last point, if you have a vision impairment that means you need to have a large font size then you can decrease the size of the indentation so more code fits on the screen.
- When de-indenting code you can press backspace rather than shift-tab (assuming that your editor supports shift-tab, if not you have to press backspace multiple times). Some editors are smart enough to remove all the indentation when pressing backspace and you are using spaces, but not many.
- Any parsing you want to do that needs to figure out indentation becomes easy, you don't need to try and figure out how many spaces equals one indentation, it's a tab character.
- Smaller file size (not a huge advantage)
- Semantically, a tab means "provide some indentation", spaces mean "provide some white space between words" - a tab character is the better semantic choice.


## Conclusion


As far as I'm concerned, tabs are better in every way, the first two "advantages" of spaces are for people working in archaic environments and don't know what they are doing (this won't be the case 100% of the time, but if they know what they are doing then they will be able to either put up with it or use a better environment). The last one can be fixed by either using the combination of tabs and spaces mentioned in the Smart Tabs article (kinda gross) or doing what I do and simply indent the consecutive lines of code a single indentation level rather than trying to match them to some arbitrary point on the previous line (which I think looks ugly).


## Addendum


In saying this, where there is a clear convention for a programming language that most people use that involves using spaces for indentation I will usually try and follow that because it helps with reusing and contributing code.



**One thing I hate more than using spaces for indentation is** **inconsistent indentation** (I also dislike commits that involve changes in indentation mixed with code changes). Consistency of coding conventions is very important - it improves code readability and maintainability (and in terms of indentation saves from painful commit diffs).



<small>By the way, at the end of the day, if you are using a good <abbr title="Integrated Development Environment">IDE</abbr> then there is little difference between tabs and spaces.</small>


## Further Reading

- [Death to the Space Infidels!](http://www.codinghorror.com/blog/2009/04/death-to-the-space-infidels.html "Death to the Sapce Infidels!")
- [Death to the Planet Destroying Space Infidel](http://peterbraden.co.uk/article/space-infidel "# Death to the Planet Destroying Space Infidel")

