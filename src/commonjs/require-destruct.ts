/*
  可解析：
    const {a1, a2, a3: d} = require('c')
  报警告：
    const {a, b} = require('my_module', xx)
*/

import { Test, NODE_TYPE } from '../type'

export const test: Test = (node, s) => {
  if (
    node.type === s.VariableDeclarator &&
    node.id.type === s.ObjectPattern &&
    node.init &&
    node.init.type === s.CallExpression &&
    node.init.callee.type === s.Identifier &&
    node.init.callee.name === 'require'
  ) {
    const arg = node.init.arguments[0]

    if (node.init.arguments.length === 1 && arg.type === s.Literal) {
      const variables: ({ imported: string; local: string })[] = []
      const yes = node.id.properties.every(p => {
        if (p.key.type === s.Identifier && p.value.type === s.Identifier) {
          variables.push({ imported: p.key.name, local: p.value.name })
          return true
        }
        return false
      })
      if (!yes) return false

      return {
        type: NODE_TYPE.REQUIRE_DESTRUCT,
        src: arg.value as string,
        variables
      }
    } else {
      return false
    }
  }
}
