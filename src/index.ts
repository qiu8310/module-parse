import * as fs from 'fs'
import * as path from 'path'
import * as esprima from 'esprima'
import * as estraverse from 'estraverse'
import { type, Test, VisitNode, NODE_TYPE } from './type'

export { NODE_TYPE }

export function parse(
  code: string,
  opts: {
    loc?: boolean
    module?: 'commonjs' | 'esnext' | 'both'
    includes?: ('require' | 'exports' | 'import' | 'export')[]
    enter?: estraverse.Visitor['enter']
    leave?: estraverse.Visitor['leave']
  } = {}
) {
  let ast: esprima.Program
  try {
    ast = esprima.parseModule(code, { loc: opts.loc, range: true, tolerant: true })
  } catch (e) {
    throw new Error(`There is a syntax error: "${e.message}"\nIn your code "${truncate(code, 30)}"`)
  }

  const s = esprima.Syntax

  const m = opts.module || 'both'
  const useCommonjs = m === 'commonjs' || m === 'both'
  const useESNext = m === 'esnext' || m === 'both'

  const skip = estraverse.VisitorOption.Skip
  const result: type.NodeWithInfo[] = []
  const warnings: string[] = []

  const getSource = (node: any) => {
    const range = node.range as any
    return code.substring(range[0], range[1])
  }
  const getNodeInfo = (node: any) => {
    return { range: node.range, loc: node.loc, source: getSource(node) } as type.NodeInfo
  }

  const commonjs = useCommonjs ? read('commonjs', opts.includes) : []
  const esnext = useESNext ? read('esnext', opts.includes) : []

  const process = (node: VisitNode, tests: { test: Test }[]) => {
    const found = tests.some(test => {
      const res = test.test(node, s)
      if (res) {
        result.push({ ...res, ...getNodeInfo(node) })
        return true
      } else if (res === false) {
        warnings.push(`can not resolve "${getSource(node)}"`)
      }
      return false
    })

    if (found) return skip
  }

  estraverse.traverse(ast, {
    enter(node, parentNode) {
      if (opts.enter) opts.enter(node, parentNode)
      let rtn: any
      if (useCommonjs && (rtn = process(node, commonjs)) != null) {
        return rtn
      }
      if (useESNext && (rtn = process(node, esnext)) != null) {
        return rtn
      }
    },
    leave(node, parentNode) {
      if (opts.leave) opts.leave(node, parentNode)
    }
  })

  return { nodes: result, warnings }
}

function read(key: string, includes?: string[]) {
  const dir = path.join(__dirname, key)
  const names = fs.readdirSync(dir).filter(n => {
    if (includes) {
      if (!includes.includes(n.split(/[-.]/)[0])) return false
    }
    return !n.endsWith('.d.ts') && (n.endsWith('.ts') || n.endsWith('.js'))
  })

  return names.map(n => require(path.join(dir, n)))
}

function truncate(str: string, length: number) {
  if (str.length <= length) return str
  return str.substr(0, length) + '...'
}
