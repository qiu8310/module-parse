/*
  可解析：
    export {A, B}
    export {A as AA, B}

    export { default } from 'foo'
    export { foo, bar } from 'my_module'
    export { es6 as default } from './someModule'
*/

import { Test, NODE_TYPE } from '../type'

export const test: Test = (node, s) => {
  if (node.type === s.ExportNamedDeclaration) {
    const variables: string[] = []
    let warning = false
    node.specifiers.forEach(it => {
      if (it.type === s.ExportSpecifier && it.exported.type === s.Identifier && it.local.type === s.Identifier) {
        variables.push(`${it.local.name}:${it.exported.name}`)
      } else {
        warning = true
      }
    })

    if (warning) return false

    if (node.source) {
      if (node.source.type === s.Literal) {
        return { type: NODE_TYPE.EXPORT_NAMED_FROM, variables, src: node.source.value as string }
      } else {
        return false
      }
    } else {
      return { type: NODE_TYPE.EXPORT_NAMED, variables }
    }
  }
}
