# Comparator

A simple [web app](https://comparator.pkozak.org) for comparing cpus. No bloat, just quick and easy comparison.  
This project was build with backwards compatibility in mind, so that even 12-year-old cpus can be compared.

![Landing page](./docs/thumbnail.png)

## How does it work?

The data is scraped from each manufacturer's website. The data is then cached in a redis database, to ensure blazing
fast response times. If the data is older than required by the app, it will be updated.

## How to use
Simply select the manufacturer and the model of the cpu you want to compare. The data will automatically fetch, after the bar vanishes or after pressing enter.


### Problem with AMD

There is a problem with AMD's website - It cannot be accessed from a server or a headless browser.
Either it's a weird bug or they are blocking it. Either way, for now, I cannot get the data from their website

If there is a way to get the data from their website, please let me know.  
**Note**: When run locally, the data is loaded correctly.

### Tech stack
- [Next.js](https://nextjs.org/)
- [Upstash](https://upstash.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [TailwindCSS](https://tailwindcss.com/)