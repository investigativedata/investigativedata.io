---
title: Reference
description: Authoring reference – copy/paste markdown for every UI component on the site.
---

# Reference

Snippets for every component used on the site. Copy a block, paste it into any
markdown page (`docs/*.md`), tweak the contents.

The `markdown` attribute on every wrapper `<div>` / `<section>` is **required** –
it tells Python-Markdown to keep parsing markdown inside the HTML tag.

Most components below are thin compositions on top of Zensical / mkdocs-material
primitives. Each section ends with an _Upstream_ link pointing to the
official docs for the underlying feature.

---

## Section (screen)

Every page is composed of `<section class="screen">` blocks. Each one carries
a `data-background-color` attribute the scroll-color JS uses to swap the page
background as the section crosses the viewport midpoint.

````markdown
<section class="screen screen--bg-orange" data-background-color="orange" markdown>

Section content here…

</section>
````

**Background variants** (light scheme only – dark mode stays on the slate palette):

| Class                    | Token (`--bg-*`)         |
|--------------------------|--------------------------|
| `.screen--bg-white`      | warm cream `#fff8f1`     |
| `.screen--bg-black`      | near-black `#1a1a1a`     |
| `.screen--bg-green`      | mint `--oa-green-300`    |
| `.screen--bg-orange`     | ember `--oa-orange-400`  |
| `.screen--bg-yellow`     | pale `--oa-yellow-100`   |
| `.screen--bg-purple`     | lavender `--oa-purple-200` |

**Optional modifier**

````markdown
<section class="screen screen--bg-white screen--full-height" data-background-color="white" markdown>
…
</section>
````

`.screen--full-height` makes the section at least 100 vh – useful for landing
heroes.

_Project-specific component – no upstream._

---

## Hero – landing variant

A single centered column for splash blocks. Sligoil-mono h1, lighter
weights, larger button row.

````markdown
<section class="screen screen--bg-white screen--full-height" data-background-color="white" markdown>

<div class="hero hero--landing" markdown>

**Tagline above the title**

# Big headline<br>two lines

A short paragraph of teaser copy describing what this site / project is about.

[See solutions](#){.btn} [Talk to us](#){.btn .btn--primary}

</div>

</section>
````

Use `<br>` for hard line-breaks inside the `# headline`. Markdown's two-trailing-spaces
rule does **not** apply inside headings.

_Project-specific component – no upstream._

---

## Hero – two-column with media

`.hero` is a 2-column grid (1 col on mobile, 5fr 6fr on tablet+). The two
direct children are: a content wrapper and an image. Swap sides by swapping
their order.

### Content on left, media on right

````markdown
<div class="hero" markdown>

<div markdown>

**Tagline**

## Section title

Body prose explaining the feature.

[Primary CTA](#){.btn .btn--primary} [Secondary](#){.btn}

</div>

![](path/to/image.jpg){style="aspect-ratio:4/3"}

</div>
````

### Media on left, content on right

````markdown
<div class="hero" markdown>

![](path/to/image.jpg){style="aspect-ratio:4/3"}

<div markdown>

**Tagline**

## Section title

Body prose explaining the feature.

[Read the docs](#){.btn}

</div>

</div>
````

The inner `<div markdown>` wrapper groups the content blocks into a single
grid item – without it each paragraph would land in its own grid cell.

_Project-specific component – no upstream._

---

## Buttons

Two intents only. Apply via attribute lists on inline links or directly on
`<button>` / `<a>` HTML.

````markdown
[Secondary action](#){.btn}
[Primary action](#){.btn .btn--primary}
````

Light mode: secondary = transparent + black border + black text; primary =
black bg + white text. Dark mode: white outline / white bg with black text.

`<button>` works the same – drop the class on a real form button:

````html
<button type="submit" class="btn btn--primary">Subscribe</button>
````

_Upstream:_ [Zensical – Buttons](https://zensical.org/docs/authoring/buttons/)
(we override `.md-button` ↦ `.btn` with the design's pill shape and color logic).

---

## Form / input

Plain `<form>` + `<input>` markup. No component classes – generic CSS handles
the pill shape, border, and per-scheme colors.

````markdown
<form action="https://example.com/subscribe" method="post">
  <input type="email" name="email" placeholder="email@example.org" required>
  <button type="submit" class="btn btn--primary">Subscribe</button>
</form>
````

_Project-specific styling – no upstream._

---

## Card grid

Zensical's built-in pattern – `<div class="grid cards" markdown>` wrapping a
markdown list. Each list item becomes a card. Cards stack to full width on
mobile and lay out in 2–3 columns when there's room.

````markdown
<div class="grid cards" markdown>

-   :material-database: __Aleph__

    Search across leaks and structured public records.

    [Learn more](#){.btn}

-   :material-graph: __FollowTheMoney__

    Standardise entities across investigations and feeds.

    [Documentation](#){.btn}

-   :material-file-search: __ICIJ Datashare__

    Local-first document discovery with redaction tooling.

    [GitHub](#){.btn}

</div>
````

The action paragraph (last paragraph containing `.btn` links) is auto-pushed
to the bottom of every card so all CTAs align.

### Full-width card modifier

`.card--full` makes a single card span every column of the grid.

````markdown
<div class="grid cards" markdown>

-   :material-megaphone: __Featured announcement__

    A wider card spanning the entire grid row.

    [Read more](#){.btn}
{ .card--full }

-   :material-database: __Aleph__
    Description…    [Learn more](#){.btn}

</div>
````

The `{ .card--full }` line right after the item content attaches the modifier;
`:has(.card--full)` on the parent `<li>` triggers the column span.

_Upstream:_ [Zensical – Card grids](https://zensical.org/docs/authoring/grids/#use-card-grids).
The base `.grid.cards` markup ships with the theme; we only override the
border thickness/radius and disable the hover effect.

---

## Project card grid (case studies)

Same `<div class="grid cards">` pattern. Each item starts with a cover image,
then chip tags (`<kbd>`), title, partner/date in italics, prose, and CTA buttons.

````markdown
<div class="grid cards" markdown>

-   ![Case study](path/to/cover.jpg){.no-shadow}

    <kbd>EU</kbd> <kbd>FinCrime</kbd> <kbd>Aleph</kbd>

    __Tracing oligarch real estate across the EU__

    *Süddeutsche Zeitung – March 2026*

    A six-month cross-border investigation linking shell-company ownership
    of premium properties back to a small set of beneficial owners.

    [Read case study](#){.btn} [View project](#){.btn .btn--primary}

</div>
````

`{.no-shadow}` removes the offset hard shadow on the cover (still keeps the
3px black border). Use `{.no-border}` to drop the border too.

_Upstream:_ same [Zensical card grid](https://zensical.org/docs/authoring/grids/#use-card-grids)
as above – no separate primitive.

---

## Profile card grid (team)

Add the `profiles` modifier to the grid. Each list item lays out as
**avatar (left) | name + title (right)**, with bio + buttons spanning both
columns below.

````markdown
<div class="grid cards profiles" markdown>

-   ![Jane Doe](https://i.pravatar.cc/160?img=49)

    __Jane Doe__ <span class="muted">she/they</span>

    *Investigations editor*

    Bio paragraph describing their work and focus.

    [:material-email: Email](mailto:jane@example.org){.btn}

-   ![Alex Chen](https://i.pravatar.cc/160?img=33)

    __Alex Chen__ <span class="muted">he/him</span>

    *Research lead*

    Bio paragraph.

    [:material-email: Email](mailto:alex@example.org){.btn}

</div>
````

The `.profile-card__avatar` class on a markdown image gives it a 4 × 4 rem
circular crop with a 3px border (no shadow).

_Upstream:_ extends [Zensical card grids](https://zensical.org/docs/authoring/grids/#use-card-grids)
with a project-specific `.profiles` modifier on the grid.

---

## Tag chips

`<kbd>` is repurposed as a chip. Filled with the inverse of the page (black
in light, white in dark).

````markdown
<kbd>EU</kbd> <kbd>FinCrime</kbd> <kbd>Aleph</kbd>
````

_Upstream:_ [Zensical – Keyboard keys](https://zensical.org/docs/authoring/keyboard-keys/)
(repurposed for short label chips).

---

## Images

Every `<img>` in markdown content gets the iconic 3px black border + offset
hard shadow automatically.

````markdown
![Caption](path/to/image.jpg)
````

**Per-image opt-outs**:

````markdown
![](path.jpg){.no-border}                  <!-- drop the border -->
![](path.jpg){.no-shadow}                  <!-- drop the shadow -->
![](path.jpg){.no-border .no-shadow}       <!-- drop both -->
![](path.jpg){style="aspect-ratio:4/3"}    <!-- inline override -->
````

_Upstream:_ [Zensical – Images](https://zensical.org/docs/authoring/images/)
(we add the global border + offset shadow on top).

---

## Inline text utilities

Apply via attribute lists.

````markdown
__Title__ <span class="muted">subtitle text</span>     <!-- lower opacity -->
__Title__ <span class="dim">subtitle text</span>       <!-- darc dim text token -->
````

Or on inline markdown elements (italic, code, link):

````markdown
*subtle*{.muted}
`code`{.muted}
````

_Upstream:_ [Zensical – Attribute lists](https://zensical.org/docs/authoring/attribute-lists/)
(the `{ .class }` syntax that powers all the inline attributes above).

---

## Admonitions

````markdown
!!! note
    Use `note`, `tip`, `warning`, `danger`, `info`, `success`, `question`,
    `example`, `quote` – colors come from darc-zensical.
````

_Upstream:_ [Zensical – Admonitions](https://zensical.org/docs/authoring/admonitions/).

### Collapsible details

````markdown
???+ tip "Click to expand"
    Body content goes here.
````

_Upstream:_ [Zensical – Admonitions § Collapsible](https://zensical.org/docs/authoring/admonitions/#collapsible-blocks).

### Content tabs

````markdown
=== "Python"
    ```python
    print("hello")
    ```

=== "Bash"
    ```bash
    echo hello
    ```
````

_Upstream:_ [Zensical – Content tabs](https://zensical.org/docs/authoring/content-tabs/).

---

## Icons

Any of these shortcodes resolves to an inline SVG via Zensical's emoji index:

- `:lucide-mail:` – Lucide (default UI set)
- `:material-database:` – Material Symbols
- `:simple-github:` – Simple Icons (brand logos)
- `:octicons-arrow-right-24:` – Octicons
- `:fontawesome-solid-heart:` – Font Awesome

Combinable with attr_list on links: `[GitHub :simple-github:](#){.btn}`.

_Upstream:_ [Zensical – Icons & emojis](https://zensical.org/docs/authoring/icons-emojis/).

---

## Code blocks & syntax highlighting

````markdown
```python title="example.py"
def hello():
    print("Hello, world")
```
````

_Upstream:_ [Zensical – Code blocks](https://zensical.org/docs/authoring/code-blocks/).
