/*
  可解析：
    exports.a = xx
    module.exports.a = xx
*/

import { Test, NODE_TYPE } from '../type'

export const test: Test = (node, s) => {
  if (
    node.type === s.ExpressionStatement &&
    node.expression.type === s.AssignmentExpression &&
    node.expression.left.type === s.MemberExpression &&
    node.expression.left.object.type === s.Identifier &&
    node.expression.left.object.name === 'exports' &&
    node.expression.left.property.type === s.Identifier
  ) {
    return { type: NODE_TYPE.EXPORTS_VARIABLE, variable: node.expression.left.property.name }
  }

  if (
    node.type === s.ExpressionStatement &&
    node.expression.type === s.AssignmentExpression &&
    node.expression.left.type === s.MemberExpression &&
    node.expression.left.object.type === s.MemberExpression &&
    node.expression.left.object.object.type === s.Identifier &&
    node.expression.left.object.object.name === 'module' &&
    node.expression.left.object.property.type === s.Identifier &&
    node.expression.left.object.property.name === 'exports' &&
    node.expression.left.property.type === s.Identifier
  ) {
    return { type: NODE_TYPE.EXPORTS_VARIABLE, variable: node.expression.left.property.name }
  }
}
