![PrimeCPU logo](./docs/banner.png)

A simple [web app](https://prime.pkozak.org) for comparing cpus. No bloat, just quick and easy comparison.  
This project was build with backwards compatibility in mind, so that even 12-year-old cpus can be compared.

## How does it work?

The data is scraped from each manufacturer's website. The data is then cached in a redis database, to ensure blazing
fast response times. If the data is older than required by the app, it will be updated.

The selected cpus are saved in the url, so that you can share your comparison with others.

## How to use

Simply select the manufacturer and the model of the cpu you want to compare. The data will automatically fetch, after
the bar vanishes or after pressing enter.

After both cpus are loaded (indicated by the green color), the comparison table will be displayed.

## How do you get the data exactly?

### Cache

The app always tries to fetch the data from the redis cache first. If the data is not in the cache, it will be fetched
from
the manufacturer's website, using the approaches described below.

### Intel

Getting the data for intel cpus was not that hard. I simply used their internal search API, that is used for search on
their own website.
The only con of this approach is, that by simply searching a phrase like `Core`, it can return a random cpu.

### Problem with AMD

Getting the data for AMD cpus was a bit more tricky. AMD does not have an internal search API, but I discovered
a [page](https://www.amd.com/en/products/specifications/processors) which has all of their cpus embedded in the html
file itself. I wrote a simple script that extracted the names and their ids that can be used to get directly to their
specs page.  
This is better than the earlier solution because we can save ~4 seconds of response time.

The biggest problem is that AMD doesn't like being fetched by a server. In the end I ended up spinning
my own instance of
[Browserless](https://browserless.io) and using it to fetch the data. This is not ideal and adds lots of delay (
approximately 6-7 seconds), but that's better than nothing.

Overall the AMD data is not as accurate and is very unreliable. For example, they can have two release dates for the
same cpu on one page.

### Tech stack

- [Next.js](https://nextjs.org/)
- [Upstash](https://upstash.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [TailwindCSS](https://tailwindcss.com/)