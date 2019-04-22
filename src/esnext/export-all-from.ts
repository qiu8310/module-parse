/*
  可解析：
    export * from 'my_module'
*/

import { Test, NODE_TYPE } from '../type'

export const test: Test = (node, s) => {
  if (node.type === s.ExportAllDeclaration) {
    if (node.source && node.source.type === s.Literal) {
      return { type: NODE_TYPE.EXPORT_ALL_FROM, src: node.source.value as string }
    } else {
      return false
    }
  }
}
