

# Adstandards Archive Backend
by Tyrone Johnston

---

### Introduction
This is a Node JS command line application used to scrape and archive advertising complaint case reports from [Adstandards Australia](https://adstandards.com.au). I wrote this program as an exercise in software development, database design, web scraping, and archiving public information.

### What is Adstandards?
To quote their website:

>Ad Standards manages the complaint resolution process of the advertising self-regulation system. Our vision is to be Australia’s community voice for complaints about advertising and marketing standards. Our purpose is to give a voice to consumer values and guide industry in maintaining decent and honest advertising aligning with prevailing community standards.

\-Retrieved 11 January 2021 ([Full text](https://adstandards.com.au/about/ad-standards))

Adstandards, being the self-regulating agency for advertisement content in Australia, enables members of the general public to submit complaints regarding advertisements that can be considered offensive in some way. These complaints are then reviewed by a community panel to assess whether they are justified based on prevailing community values. Reports of these complaints and their outcomes are then [published](https://adstandards.com.au/cases) on their website for public viewing.

### Inspiration
After I had finished [maze-graph-pathfinding](https://gitlab.com/tjohnston_softdev_personal/maze-graph-pathfinding), I wanted to write a piece of software to help me learn more about web scraping.

### Getting Started
After downloading a local copy of the project, open a terminal inside the root folder and run `npm install`. Afterwards, run `node archive` to confirm that the program has been installed and to see a list of supported commands.

The different tasks of this program have been split into several commands so that data archiving can be executed in steps and not just as one huge action. Furthermore, tasks that are likely to take a long time can be aborted and resumed later on as desired.

Here is a table of the main archive commands in suggested order of execution:

| Command          | Description                                                                 |
|------------------|-----------------------------------------------------------------------------|
| create           | Creates and initialises the archive database.                               |
| read-lists       | Downloads and saves product category and media type list data into archive. |
| download-pages   | Downloads page .html files from adstandards.                                |
| read-cases       | Scrapes case report data from saved page files.                             |
| download-reports | Downloads known case report .pdf files from adstandards.                    |


Run `archive.js` for other commands.


### Future
- [ ] Maintain official case reports archive using this program.
- [ ] Write server API for database.
- [ ] Develop front-end website for server API.

As this is a personal project, I am not actively looking for contributions. However, I am open to suggestions, bug reports, etc.


### Legal
This work is licensed under a [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) license. For more information as to why I chose this license, read this [disclaimer](./disclaimer.md)

![Creative Commons License](https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png)
