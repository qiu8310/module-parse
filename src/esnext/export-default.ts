/*
  可解析：
    export default 42
    export default variable
    export default function() {}
    export default function test() {}
*/

import { Test, NODE_TYPE } from '../type'

export const test: Test = (node, s) => {
  if (node.type === s.ExportDefaultDeclaration) {
    return { type: NODE_TYPE.EXPORT_DEFAULT }
  }
}
