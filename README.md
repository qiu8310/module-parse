# @mora/module-parse

解析代码中的 `require`, `module.exports`, `import` 和 `export` 语句

注意：由于 require 和 exports 可以赋值给其它变量，其它变量也可以覆盖 require 和 exports，所以解析出来的结果可能不准备，如：

```js
const r = require
const fs = r('fs') // 这里的 r 是解析不出来的
```

**建议采用 import 和 export 来解析，即设置 `module="esnext"`**

## 支持解析下面的语句

* `module="commonjs"`

```js
// REQUIRE_ONLY
require('my_module')

// REQUIRE_ASIGN
var fs = require('my_module')
let fs = require('my_module')
const fs = require('my_module')

// REQUIRE_DESTRUCT
const { stat, exists, readFile } = require('my_module')

// EXPORTS_DEFAULT
module.exports = 42
module.exports = variable
module.exports = function() {}
module.exports = function test() {}

// EXPORTS_VARIABLE
exports.a = xx
module.exports.a = xx
```

* `module="esnext"`

```js
// IMPORT_ONLY
import 'my_module'

// IMPORT_ALL
import * as fs from 'my_module'

// IMPORT_NAMED
import fs from 'my_module'
import { stat, exists, readFile } from 'my_module'
import { a as b } from 'my_module'
import _, { each, forEach } from 'lodash'

// EXPORT_DEFAULT
export default 42
export default variable
export default function() {}
export default function test() {}

// EXPORT_NAMED
export {A, B}
export {A as AA, B}

// EXPORT_ALL_FROM
export * from './a'

// EXPORT_NAMED_FROM
export { default } from 'foo'
export { foo, bar } from 'my_module'
export { es6 as default } from './someModule'
```

## Installation

```bash
npm i @mora/module-parser
```

## Usage

```js
import parse from '@mora/module-parser'

parse(code, options)
```


## Support

- 咨询：Mora <qiuzhongleiabc@126.com>

<!--
## Roadmap

If you have ideas for releases in the future, it is a good idea to list them in the README.
-->

## Changelog

[Changelog][./CHANGELOG.md]


## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.


## License

[MIT](https://choosealicense.com/licenses/mit/)
