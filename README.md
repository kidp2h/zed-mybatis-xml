# Zed MyBatis XML

XML syntax highlighting for [Zed](https://github.com/zed-industries/zed), with SQL highlighting
inside MyBatis mapper files. Fork of [sweetppro/zed-xml](https://github.com/sweetppro/zed-xml).

SQL is highlighted in the text of `select`, `insert`, `update`, `delete`, `sql`, `if`, `where`,
`set`, `foreach`, `trim`, `when`, `otherwise`, `choose`, `bind` and in any `CDATA` section.
`#{...}` and `${...}` parameters get their own color.

## Install (Linux, macOS, Windows)

Requirements: [Rust via rustup](https://rustup.rs) (Zed compiles the extension locally).

1. Uninstall the official **XML** extension in Zed. Both register the `XML` language and conflict.
2. Clone this repository:
   ```bash
   git clone https://github.com/kidp2h/zed-mybatis-xml.git
   ```
3. In Zed open the command palette, run `zed: install dev extension` and pick the cloned folder.

To update: `git pull`, then click **Rebuild** on the extension in the Extensions page.

## Editing the SQL grammar

The grammar is in [`tree-sitter-mybatis-sql/`](tree-sitter-mybatis-sql). Zed fetches it from this
repository at the commit pinned in `extension.toml`, so local grammar edits are not used until
they are pushed and pinned:

1. Edit `tree-sitter-mybatis-sql/grammar.js`, then regenerate with ABI 14:
   ```bash
   cd tree-sitter-mybatis-sql
   tree-sitter generate --abi 14
   tree-sitter parse test/sample.sql
   ```
2. Commit and push the grammar change.
3. Put that commit's sha in `[grammars.mybatis_sql] commit` of `extension.toml`, commit and push.
4. Rebuild the dev extension in Zed.

Highlight colors for SQL are in [`languages/mybatis-sql/highlights.scm`](languages/mybatis-sql/highlights.scm)
and need no grammar commit, only a rebuild.

See the official [Zed XML Language Documentation](https://zed.dev/docs/languages/xml).

## Adding file types

This extension only claims `.xml` by default, plus any file whose first line matches an XML declaration (`^<.*xml`). There are too many XML based formats to hardcode them all, so extra extensions are left to you.

To associate more file types, add them to your Zed `settings.json`:

```json
{
  "file_types": {
    "XML": ["*.svg", "*.xsl", "*.dtd"]
  }
}
```

## Tree-Sitter

- https://github.com/tree-sitter-grammars/tree-sitter-xml

## Language Server

This extension uses the [eclipse-lemminx/lemminx](https://github.com/eclipse-lemminx/lemminx) language server for completion, validation and hover from XSD and DTD, XML catalogs and file associations.

The `lemminx` binary is found in this order:

1. `lsp.lemminx.binary.path` in your settings;
2. a `lemminx` binary in your PATH;
3. otherwise the extension downloads the native binary Red Hat publishes with [redhat-developer/vscode-xml/releases](https://github.com/redhat-developer/vscode-xml/releases), for macOS (x86_64 and aarch64), Linux (x86_64 and aarch64) and Windows (x86_64, which also runs on Windows on ARM). No Java is needed. The release is pinned in [`src/lemminx_release.rs`](src/lemminx_release.rs) and the binary is checked against the SHA-256 published with it.

If the download or the checksum fails, or there is no binary for your platform, install LemMinX yourself and point the extension at it:

```json
  "lsp": {
    "lemminx": {
      "binary": {
        "path": "/path/to/lemminx",
        "arguments": []
      }
    }
  }
```

### Settings

Everything under `lsp.lemminx.settings` reaches LemMinX as its settings, both at start-up and on every `workspace/configuration` request. See the [vscode-xml settings](https://github.com/redhat-developer/vscode-xml/blob/main/docs/Preferences.md) and the [LemMinX configuration](https://github.com/eclipse-lemminx/lemminx/blob/main/docs/Configuration.md) for the full list.

Relative paths in `xml.catalogs` and `xml.fileAssociations[].systemId` are resolved against the project root, as the VS Code client does, so they can live in a project's `.zed/settings.json`. Absolute paths and URIs (`https://…`, `file:///…`) are passed through untouched.

```json
  "lsp": {
    "lemminx": {
      "settings": {
        "xml": {
          "catalogs": ["schemas/catalog.xml"],
          "fileAssociations": [
            { "pattern": "**/config/*.xml", "systemId": "schemas/config.xsd" }
          ],
          "format": { "maxLineWidth": 120 }
        }
      }
    }
  }
```

A catalog maps namespaces to schemas, which is enough for completion and hover. LemMinX only validates a document bound to a grammar: by `xsi:schemaLocation`, a DOCTYPE or a file association.

### Updating LemMinX

To move to a new release of redhat-developer/vscode-xml, run `script/update-lemminx.sh <tag>` (for example `script/update-lemminx.sh 0.29.3`). It rewrites `src/lemminx_release.rs` with the tag and the SHA-256 of each binary.

## Formatter

### Prettier

Use [prettier](https://prettier.io/) with [prettier/plugin-xml](https://github.com/prettier/plugin-xml) to format:

```json
  "languages": {
    "XML": {
      "prettier": {
        "allowed": true,
        "plugins": ["@prettier/plugin-xml"]
      },
      "formatter": "prettier",
    }
  }
```

### Language Server

Use `lemminx` language server to format documents:

```json
  "languages": {
    "XML": {
      "format_on_save": "on",
      "formatter": "language_server"
    }
  }
```

Zed passes its indentation settings to LemMinX when formatting (`tabSize`, `insertSpaces`). Set them in an `.editorconfig`:

```editorconfig
root = true

[*.xml]
indent_style = space
indent_size = 2
```

or with [`tab_size`](https://zed.dev/docs/reference/all-settings#tab-size) and [`hard_tabs`](https://zed.dev/docs/reference/all-settings#hard-tabs) in your Zed settings:

```json
  "languages": {
    "XML": {
      "tab_size": 2,
      "hard_tabs": false
    }
  }
```

### Manual formatting

If you prefer, you can manually use `editor::FormatDocument` (`ctrl-shift-i` on Linux, `cmd-shift-i` on macOS) and disable automatic "Format on Save" with:

```json
  "languages": {
    "XML": {
      "format_on_save": "off"
    }
  }
```
