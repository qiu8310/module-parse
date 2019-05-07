import { Visitor } from 'estraverse'
import * as esprima from 'esprima'

export type VisitNode = Parameters<Required<Visitor>['enter']>[0]

export enum NODE_TYPE {
  /**
   * require('my_module')
   */
  REQUIRE_ONLY,
  /**
   * * const fs = require('my_module')
   * * let fs = require('my_module')
   * * var fs = require('my_module')
   */
  REQUIRE_ASSIGN,
  /** const { stat, exists, readFile } = require('my_module') */
  REQUIRE_DESTRUCT,
  /**
   * * module.exports = 42
   * * module.exports = variable
   * * module.exports = function() {}
   * * module.exports = function test() {}
   */
  EXPORTS_DEFAULT,
  /**
   * exports.a = xx
   * module.exports.a = xx
   */
  EXPORTS_VARIABLE,

  /**
   * import 'my_module'
   */
  IMPORT_ONLY,

  // esprima 不支持这种语法
  // /** import('my_module') */
  // IMPORT_LAZY,

  /** import * as fs from 'my_module' */
  IMPORT_ALL,

  /**
   * * import fs from 'my_module'
   * * import { stat, exists, readFile } from 'my_module'
   * * import { a as b } from 'my_module'
   * * import _, { each, forEach } from 'lodash'
   */
  IMPORT_NAMED,

  /**
   * * export default 42
   * * export default variable
   * * export default function() {}
   * * export default function test() {}
   */
  EXPORT_DEFAULT,

  /**
   * * export const A = 1
   */
  EXPORT_ASSIGN,

  /**
   * * export {A, B}
   * * export {A as AA, B}
   */
  EXPORT_NAMED,

  /** export * from './a' */
  EXPORT_ALL_FROM,

  /**
   * * export { default } from 'foo'
   * * export { foo, bar } from 'my_module'
   * * export { es6 as default } from './someModule'
   */
  EXPORT_NAMED_FROM
}

export namespace type {
  export interface NodeInfo {
    source: string
    range: [number, number]
    loc: {
      start: { line: number; column: number }
      end: { line: number; column: number }
    }
  }
  export type Node = commonjs.Node | esnext.Node
  export type NodeWithInfo = Node & NodeInfo
  export namespace commonjs {
    export type Node =
      | RequireOnlyNode
      | RequireAssignNode
      | RequireDestructNode
      | ExportsDefaultNode
      | ExportsVariableNode
    /** require('my_module') */
    export interface RequireOnlyNode {
      type: NODE_TYPE.REQUIRE_ONLY
      src: string
    }
    /** const variable = require('my_module') */
    export interface RequireAssignNode {
      type: NODE_TYPE.REQUIRE_ASSIGN
      src: string
      variable: string
    }
    /** const { stat: aliasFn, exists, readFile } = require('my_module') */
    export interface RequireDestructNode {
      type: NODE_TYPE.REQUIRE_DESTRUCT
      src: string
      variables: ({ imported: string; local: string })[]
    }

    /**
     * * module.exports = 42
     * * module.exports = variable
     * * module.exports = function() {}
     */
    export interface ExportsDefaultNode {
      type: NODE_TYPE.EXPORTS_DEFAULT
    }
    /**
     * * exports.a = xx
     * * module.exports.a = xx
     */
    export interface ExportsVariableNode {
      type: NODE_TYPE.EXPORTS_VARIABLE
      variable: string
    }
  }
  export namespace esnext {
    export type Node =
      | ImportOnlyNode
      | ImportAllNode
      | ImportNamedNode
      | ExportDefaultNode
      | ExportNamedNode
      | ExportAssignNode
      | ExportAllFromNode
      | ExportNamedFromNode
    /** import 'my_module' */
    export interface ImportOnlyNode {
      type: NODE_TYPE.IMPORT_ONLY
      src: string
    }

    /** import * as fs from 'my_module' */
    export interface ImportAllNode {
      type: NODE_TYPE.IMPORT_ALL
      variable: string
      src: string
    }
    /**
     * * import fs from 'my_module'
     * * import { stat, exists, readFile } from 'my_module'
     * * import { a as b } from 'my_module'
     * * import _, { each, forEach } from 'lodash'
     */
    export interface ImportNamedNode {
      type: NODE_TYPE.IMPORT_NAMED
      default: string
      variables: ({ imported: string; local: string })[]
      src: string
    }

    /**
     * * export default 42
     * * export default variable
     * * export default function() {}
     */
    export interface ExportDefaultNode {
      type: NODE_TYPE.EXPORT_DEFAULT
    }

    /**
     * * export {A, B}
     * * export {A as AA, B}
     * * export const A = B
     */
    export interface ExportNamedNode {
      type: NODE_TYPE.EXPORT_NAMED
      variables: ({ exported: string; local: string })[]
    }

    /**
     * * export const A = 1
     */
    export interface ExportAssignNode {
      type: NODE_TYPE.EXPORT_ASSIGN
      exported: string
    }

    /** export * from './a' */
    export interface ExportAllFromNode {
      type: NODE_TYPE.EXPORT_ALL_FROM
      src: string
    }
    /**
     * * export { default } from 'foo'
     * * export { foo, bar } from 'my_module'
     * * export { es6 as default } from './someModule'
     */
    export interface ExportNamedFromNode {
      type: NODE_TYPE.EXPORT_NAMED_FROM
      variables: ({ exported: string; local: string })[]
      src: string
    }
  }
}

export type Test = (node: VisitNode, syntax: typeof esprima.Syntax) => type.Node | false | void
