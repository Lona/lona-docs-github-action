# Lona Docs GitHub Action

A Github Action to build a documentation website.

## Usage

```yaml
name: Lona
on:
  push:
    branches:
      - master
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@master
      - uses: Lona/lona-github-action@v1
        id: lona
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          workflow_succeeded: ${{ job.status == 'Success' }}
      - uses: Lona/lona-docs-github-action@v1
        with:
          output_folder: ${{ steps.lona.outputs.output_folder }}
```

### Inputs

- **`output_folder`** - The folder where to put the website. Usually `${{ steps.lona.outputs.output_folder }}`.
- **`secret_prefix`** - The prefix to put in front of links.
