# Migration of Pinafore to Svelte 3

This branch contains the first cut of migrating [Pinafore](https://github.com/nolanlawson/pinafore) from Svelte 2
to Svelte 3.

We used the version of Pinafore as of May 15, 2021.

It's meant to serve as a reference, in case if anyone wanted to complete the migration of the actual Pinafore code.

## Health warnings

* The code was copied over from the original repo on as-needed basis. Not everything is available here.
* The migration was done to the point when everything compiled, and we had a clickable app.
* There was minimal testing done. The further away from the core pages you go, the less it's been tested.
* This was our first experience with Svelte 3 (or any Svelte). Some migrations, especially the early ones, around the login page and Settings, were done in a rather naive way. Sorry.
* The build process was partially migrated to Rollup. Some hairier dependencies were omitted until later.
* Migration from Svelte 2 based stores to Svelte 3 proven to be the most intrusive. The presented version is very crude. It was intended as a temporary implementation, until all the use cases were understood and dealt with (remember, we didn't know much about the inner works of Pinafore back then.)

## Running the server

Once you have checked out this branch, install dependencies and run the server in development mode:

```bash
npm install # or yarn
npm run dev
```

This will start the development server on [localhost:3000](http://localhost:3000). Open it and click around.