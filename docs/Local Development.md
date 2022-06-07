# Local Development

Install dependencies locally:
- Run `yarn`

Start server:
- Run `cd prolog-server && npm run start`

Start web client:
- Run `cd web-client && yarn run start`

## Example queries

```sh
fruit(banana). // true
fruit(onion). // false
eats(john, X). // ['red_apple', 'banana', 'kiwi']
eats(X, banana). // ['john', 'maria']
eats_apple(john). // true
eats_apple(mario). // false
```