/*
  可解析：
    import 'my_module'
    import * as fs from 'my_module'
    import fs from 'my_module'
    import { stat, exists, readFile } from 'my_module'
    import { a as b } from 'my_module'
    import _, { each, forEach } from 'lodash'
*/

import { Test, NODE_TYPE } from '../type'

export const test: Test = (node, s) => {
  if (node.type === s.ImportDeclaration) {
    if (node.source.type !== s.Literal) return false
    const src = node.source.value as string
    const { specifiers } = node
    const length = specifiers.length

    if (!length) {
      // import 'my_module'
      return { type: NODE_TYPE.IMPORT_ONLY, src }
    } else if (length === 1 && specifiers[0].type === s.ImportNamespaceSpecifier) {
      // import * as fs from 'my_module'
      if (specifiers[0].local.type === s.Identifier) {
        return { type: NODE_TYPE.IMPORT_ALL, src, variable: specifiers[0].local.name }
      } else {
        return false
      }
    } else {
      // import { stat, exists, readFile } from 'my_module'
      // import { a as b } from 'my_module'
      // import _, { each, forEach } from 'lodash'
      let importDefault = ''
      let variables: ({ imported: string; local: string })[] = []
      let warning = false
      specifiers.forEach(it => {
        if (it.type === s.ImportDefaultSpecifier) {
          if (it.local.type === s.Identifier) {
            importDefault = it.local.name
          } else {
            warning = true
          }
        } else if (it.type === s.ImportSpecifier) {
          if (it.local.type === s.Identifier && it.imported.type === s.Identifier) {
            variables.push({ imported: it.imported.name, local: it.local.name })
          } else {
            warning = true
          }
        } else {
          warning = true
        }
      })
      if (warning) return false
      return { type: NODE_TYPE.IMPORT_NAMED, src, default: importDefault, variables }
    }
  }
}
