/*
  可解析：
    export default 42
    export default variable
    export default function() {}
    export default function test() {}

    export default Identifier
*/

import { Test, NODE_TYPE } from '../type'

export const test: Test = (node, s) => {
  if (node.type === s.ExportDefaultDeclaration) {
    if (node.declaration.type === s.Identifier) {
      return { type: NODE_TYPE.EXPORT_NAMED, variables: [{ exported: 'default', local: node.declaration.name }] }
    } else {
      return { type: NODE_TYPE.EXPORT_DEFAULT }
    }
  }
}
