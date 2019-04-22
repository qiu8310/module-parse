/*
  可解析：
    module.exports = 42
    module.exports = variable
    module.exports = function() {}
    module.exports = function test() {}
*/

import { Test, NODE_TYPE } from '../type'

export const test: Test = (node, s) => {
  if (
    node.type === s.ExpressionStatement &&
    node.expression.type === s.AssignmentExpression &&
    node.expression.left.type === s.MemberExpression &&
    node.expression.left.object.type === s.Identifier &&
    node.expression.left.object.name === 'module' &&
    node.expression.left.property.type === s.Identifier &&
    node.expression.left.property.name === 'exports'
  ) {
    return { type: NODE_TYPE.EXPORTS_DEFAULT }
  }
}
