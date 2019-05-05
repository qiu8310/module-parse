/*
  可解析：
    const variable = require('my_module')
  报警告：
    const variable = require('my_module', xx)
*/

import { Test, NODE_TYPE } from '../type'

export const test: Test = (node, s) => {
  if (
    node.type === s.VariableDeclarator &&
    node.id.type === s.Identifier &&
    node.init &&
    node.init.type === s.CallExpression &&
    node.init.callee.type === s.Identifier &&
    node.init.callee.name === 'require'
  ) {
    const arg = node.init.arguments[0]
    if (node.init.arguments.length === 1 && arg.type === s.Literal) {
      return { type: NODE_TYPE.REQUIRE_ASSIGN, src: arg.value as string, variable: node.id.name }
    } else {
      return false
    }
  }
}
