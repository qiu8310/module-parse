/*
  可解析：
    require('my_module')
  报警告：
    require('my_module', xx)
    require('my_m' + 'odule')
*/

import { Test, NODE_TYPE } from '../type'

export const test: Test = (node, s) => {
  if (
    node.type === s.ExpressionStatement &&
    node.expression.type === s.CallExpression &&
    node.expression.callee.type === s.Identifier &&
    node.expression.callee.name === 'require'
  ) {
    const arg = node.expression.arguments[0]
    if (node.expression.arguments.length === 1 && arg.type === s.Literal) {
      return { type: NODE_TYPE.REQUIRE_ONLY, src: arg.value as string }
    } else {
      return false
    }
  }
}
