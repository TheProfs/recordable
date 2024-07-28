[![test-workflow][test-badge]][test-workflow] [![codeql-workflow][codeql-badge]][codeql-workflow]

# :watch: recordable

> recordable & plottable [histogram][histogram]

## Install

```bash
npm i https://github.com/TheProfs/recordable.git
```

## Usage

### Basic

```js
import { Recordable } from 'recordable'

const histogram = new Recordable()

for (let i = 0; i < 600; i++)
  histogram.record(Math.round(Math.random() * 20) + 1)

console.log(histogram.min)
// 3.05 ms
console.log(histogram.mean)
// 11.42 ms
console.log(histogram.max)
// 85.17 m
console.log(histogram.stddev)
// 5.17 ms
```

### Available methods

`histogram.record(value)`

record a value

`histogram.tick()`

record a value of `1`

`histogram.recordDelta(label)`

record the [time delta][delta] between invocations with the same `label` value.

### Plotting

```js
import { Recordable } from 'recordable'

const histogram = new Recordable()

for (let i = 0; i < 600; i++)
  histogram.record(Math.round(Math.random() * 20) + 1)

histogram.plot()
```

```console

24.33 ┤╭╮
23.27 ┤││
22.21 ┤││
21.15 ┤││
20.09 ┤││
19.03 ┤││
17.97 ┤││                                                                                                 ╭
16.91 ┤││                                                                                               ╭╮│
15.85 ┤││                    ╭╮                 ╭╮                      ╭╮             ╭╮               │││
14.79 ┤││ ╭╮ ╭╮   ╭╮         ││                 ││       ╭╮             ││╭╮           ││          ╭╮   │││
13.73 ┤││ ││ ││   ││         ││              ╭╮ ││╭╮     ││             ││││     ╭╮ ╭╮ ││      ╭╮  ││ ╭╮│╰╯
12.67 ┤│╰╮│╰─╯│  ╭╯│ ╭─╮ ╭─╮ │╰╮  ╭╮         ││ ││││╭─╮  │╰╮            ││││╭╮╭╮ ││ │╰╮│╰╮     ││ ╭╯│ │││
11.61 ┤│ ││   │ ╭╯ ╰╮│ ╰╮│ │ │ │  ││     ╭╮ ╭╯│ │││╰╯ │  │ │ ╭╮    ╭╮╭╮ │││││╰╯│╭╯│╭╯ ││ │  ╭╮ ││╭╯ ╰╮│││
10.55 ┤│ ││   ╰╮│   ││  ││ │╭╯ │╭╮││╭╮ ╭─╯│ │ ╰╮│││   ╰─╮│ │╭╯│    │││╰╮│││││  ││ ││  ╰╯ │  ││╭╯││   ╰╯││
9.48 ┤│ ╰╯    ││   ╰╯  ╰╯ ╰╯  ││││╰╯╰─╯  │ │  ││││     ││ ╰╯ ╰╮╭──╯╰╯ ││││╰╯  ╰╯ ││     │  │╰╯ ╰╯     ╰╯
8.42 ┤│       ╰╯              ╰╯╰╯       │ │  ││││     ╰╯     ││      ││││       ││     ╰─╮│
7.36 ┤│                                  ╰─╯  ╰╯╰╯            ╰╯      ╰╯││       ││       ││
6.30 ┤│                                                                 ╰╯       ╰╯       ╰╯
5.24 ┤│
4.18 ┤│
3.12 ┤│
2.06 ┤│
1.00 ┼╯
Nicholass-MacBook-Air:recordable nicholaswmin$

```

### Install

```bash
npm i @nicholaswmin/recordable
```

## Tests

Install deps

```bash
npm ci
```

Run unit tests

```bash
npm test
```

Run test coverage

```bash
npm run test:coverage
```

## Authors

- [@Bitpaper][profs]
- [@nicholaswmin][nicholaswmin]

## License

[MIT-0 "No Attribution" License][license]

[test-badge]: https://github.com/TheProfs/recordable/actions/workflows/test:unit.yml/badge.svg
[test-workflow]: https://github.com/TheProfs/recordable/actions/workflows/test:unit.yml

[codeql-badge]: https://github.com/TheProfs/recordable/actions/workflows/codeql.yml/badge.svg
[codeql-workflow]: https://github.com/TheProfs/recordable/actions/workflows/codeql.yml

[histogram]: https://en.wikipedia.org/wiki/Histogram
[delta]: https://en.wikipedia.org/wiki/Delta_timing
[profs]: https://github.com/TheProfs
[nicholaswmin]: https://github.com/nicholaswmin
[license]: ./LICENSE
