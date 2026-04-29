---
title: Typography
---

# Typography test page

A long page with many headings to exercise the table-of-contents rail and
the right-side overlay nav.

## Section one

Tempore labore odio placeat accusantium sed dolorem. Porro consequatur odio accusamus tenetur animi rerum et dignissimos. Ipsam animi similique voluptates magni ut blanditiis illo. Ut dolorem quisquam labore. Qui ex quaerat et autem voluptatum et quas architecto. Sint qui qui exercitationem quidem rerum corrupti dicta.

Cumque dolorem et <a href="">perspiciatis officia</a>. Expedita voluptas quaerat laudantium. Voluptatum tempora ut odio.

Quaerat ex voluptas doloribus omnis fugit. Sapiente quo dolorum ut deserunt ullam ut nisi et. Non quia consequuntur saepe odio.

Laboriosam officiis alias aliquam neque ut. **Eligendi** sequi eos a magni. Praesentium dolores porro doloribus ut eius. Beatae laborum debitis illum temporibus ut. Ea et at iure nesciunt nesciunt. Illo voluptas est vitae.

Aut dignissimos et ipsa. Qui ipsum est natus alias velit. Ut ut esse dolorum ratione non corporis ullam distinctio. Qui aut non est assumenda qui et amet. Quaerat commodi corporis qui incidunt aut.


### Subsection 1a

Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
aliquip ex ea commodo consequat.

### Subsection 1b

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
dolore eu fugiat nulla pariatur.

Aut dignissimos et ipsa. Qui ipsum est natus alias velit. Ut ut esse dolorum ratione non corporis ullam distinctio. Qui aut non est assumenda qui et amet. Quaerat commodi corporis qui incidunt aut.

## Components

`zensical` default components rendering.

### Lists


#### Unordered

- Unordered list item
- Unordered list item 
- Unordered list item

#### Ordered 

1. Ordered list item
2. Ordered list item
3. Ordered list item

### Admonitions

!!! info "This is information" 
    Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt.

!!! warning "This is a warning"
    Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt.

!!! danger "This is really dangerous"
    Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt.

### Table

| Method      | Description                          |
| ----------- | ------------------------------------ |
| `GET`       | :lucide-check:       Fetch resource  |
| `PUT`       | :lucide-check-check: Update resource |
| `DELETE`    | :lucide-x:           Delete resource |

### Code blocks

``` py title="bubble_sort.py"
def bubble_sort(items):
    for i in range(len(items)):
        for j in range(len(items) - 1 - i):
            if items[j] > items[j + 1]:
                items[j], items[j + 1] = items[j + 1], items[j]
```
