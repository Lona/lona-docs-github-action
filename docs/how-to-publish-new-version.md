# How to publish a new version of the action

## Publish to a distribution branch

Actions are run from GitHub repos. We will create a releases branch and only checkin production modules (core in this case).

Comment out node_modules in `.gitignore` and create a releases/v1 branch

```bash
git checkout -b releases/v1 && npm install && npm run build && npm prune --production
# comment out in .gitgnore
# node_modules/
# lib/
git add . && git commit -a -m "prod dependencies" && git push
```

Your action is now published! :rocket:

See the [versioning documentation](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md)

## Validate

You can now validate the action by referencing the releases/v1 branch

```yaml
uses: Lona/lona-docs-github-action@releases/v1
```

See the [actions tab](https://github.com/actions/javascript-action/actions) for runs of this action! :rocket:

## Create a tag

After testing you can [create a tag](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md) to reference the stable and tested action

```yaml
uses: Lona/lona-docs-github-action@v1
```

# How to publish a new version of the Gatsby Theme

## Add the proper `gatsby-config.js`

- Rename `gatsby-config.js` to `gatsby-config-action.js`
- Rename `gatsby-config-theme.js` to `gatsby-config.js`

## Publish the package

- Update the version number in `package.json`
- Run `npm publish`

## Put back the right `gatsby-config.js`

- Rename `gatsby-config.js` to `gatsby-config-theme.js`
- Rename `gatsby-config-action.js` to `gatsby-config.js`
