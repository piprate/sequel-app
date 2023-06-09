# Sequel Web App

This is an official web client for [Sequel](https://sequel.space) (currently in Beta).

The client is available at [app.sequel.space](https://app.sequel.space).

If you prefer using [Gemini](https://gemini.circumlunar.space/), please visit gemini://sequel.space.

## About Sequel

Sequel is a social platform where everything is fun and fictional. It enables you
to be imaginative and express your playful self through sharing creative content
beyond the limits of reality.

Sequel integrates with [Fediverse](https://fediverse.party/) using ActivityPub.

See [the official site](https://sequel.space) for more details.

## Support

For updates and support, follow us on social media:

- [@sequel@mastodon.social](https://mastodon.social/@sequel)
- [Sequel@Discord](https://discord.gg/YaR7BFuXNk)
- [@sequelspace@twitter.com](https://twitter.com/sequelspace)

## Building

Sequel App requires [Node.js](https://nodejs.org/en/).

To build Sequel App for production, first install dependencies:

    npm --production install

Then build:

    npm run build

Then run:

    PORT=3005 node server.js

### Docker

To build a Docker image for production:

    docker build -f build/docker/app/Dockerfile .
    docker run -d -p 3005:3005 [your-image]

Now Sequel App is running at `localhost:3005`.

## Changelog

For a changelog, see the [GitHub releases](http://github.com/piprate/sequel-app/releases/).

## Credits

Sequel App is based on [Pinafore](https://github.com/nolanlawson/pinafore), an awesome alternative client for [Mastodon](https://joinmastodon.org),
developed by [Nolan Lawson](https://nolanlawson.com/).

Even though Sequel and Mastodon are very different platforms, the team decided to use Pinafore's backbone framework
for building modern web apps, because:

- it's based on Svelte, the framework that we wanted to use,
- we share similar views on application design principles, and
- simply because Pinafore is a great piece of engineering, written with love

### What's changed from Pinafore

- Upgraded from Svelte 2 to Svelte 3
- Borrowed Pinafore code on as-needed basis, but ended up with 80-90% of supporting libraries
- Tried switching to Rollup, but ended up with reverting to Webpack. Simply because Flow libraries back then weren't compatible with Rollup
- Switched from Mastodon domain model to Sequel
- Reworked all platform specific screens
- Added Sequel specific features
- Haven't yet moved any tests over (WIP)
