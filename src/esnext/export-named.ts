/*
  可解析：
    export {A, B}
    export {A as AA, B}

    export { default } from 'foo'
    export { foo, bar } from 'my_module'
    export { es6 as default } from './someModule'

    export const C = 1
*/

import { Test, NODE_TYPE } from '../type'

export const test: Test = (node, s) => {
  if (node.type === s.ExportNamedDeclaration) {
    const variables: ({ exported: string; local: string })[] = []
    let warning = false
    node.specifiers.forEach(it => {
      if (it.type === s.ExportSpecifier && it.exported.type === s.Identifier && it.local.type === s.Identifier) {
        variables.push({ exported: it.exported.name, local: it.local.name })
      } else {
        warning = true
      }
    })

    // export const A = 1
    // export function B() {}
    // export class C {}
    if (node.declaration) {
      if (node.declaration.type === s.VariableDeclaration) {
        for (const d of node.declaration.declarations) {
          if (d.id.type === s.Identifier) {
            if (d.init && d.init.type === s.Identifier) {
              variables.push({ exported: d.id.name, local: d.init.name })
            } else {
              return { type: NODE_TYPE.EXPORT_ASSIGN, exported: d.id.name }
            }
          }
        }
      } else if (node.declaration.type === s.FunctionDeclaration || node.declaration.type === s.ClassDeclaration) {
        if (node.declaration.id && node.declaration.id.type === s.Identifier) {
          return { type: NODE_TYPE.EXPORT_ASSIGN, exported: node.declaration.id.name }
        }
      }
    }

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
