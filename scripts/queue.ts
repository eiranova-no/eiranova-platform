#!/usr/bin/env tsx
/**
 * EiraNova — queue.ts
 * Viser kontrakt-køen i terminal med farget output
 * Kjør med: pnpm queue
 */

import fs from 'fs'
import path from 'path'

const ROOT = path.resolve(__dirname, '..')
const QUEUE_PATH = path.join(ROOT, 'docs/contracts/CONTRACT_QUEUE.json')

const C = {
  reset:  '\x1b[0m',
  bold:   '\x1b[1m',
  green:  '\x1b[32m',
  yellow: '\x1b[33m',
  blue:   '\x1b[34m',
  red:    '\x1b[31m',
  cyan:   '\x1b[36m',
  gray:   '\x1b[90m',
  white:  '\x1b[37m',
}

interface Contract {
  id: string
  title: string
  type: string
  status: string
  spec_path?: string | null
  goal: string
  dependencies: string[]
  merged_at?: string
  blocked_reason?: string
  paused_reason?: string
}

function statusColor(status: string): string {
  switch (status) {
    case 'active':  return C.green + C.bold
    case 'ready':   return C.cyan
    case 'planned': return C.blue
    case 'blocked': return C.red
    case 'paused':  return C.yellow + C.bold
    case 'merged':  return C.gray
    default:        return C.white
  }
}

function statusIcon(status: string): string {
  switch (status) {
    case 'active':  return '🟢'
    case 'ready':   return '✅'
    case 'planned': return '📋'
    case 'blocked': return '🚫'
    case 'paused':  return '⏸️'
    case 'merged':  return '✔️'
    default:        return '⚪'
  }
}

function main() {
  const raw = fs.readFileSync(QUEUE_PATH, 'utf8')
  const queue = JSON.parse(raw)
  const contracts: Contract[] = queue.contracts

  console.log()
  console.log(`${C.bold}EiraNova — Contract Queue${C.reset}`)
  console.log(`${C.gray}${'─'.repeat(70)}${C.reset}`)
  console.log()

  const groups = ['active', 'paused', 'ready', 'planned', 'blocked', 'merged']
  const groupLabels: Record<string, string> = {
    active:  '🟢 ACTIVE',
    paused:  '⏸️ PAUSED',
    ready:   '✅ READY',
    planned: '📋 PLANNED',
    blocked: '🚫 BLOCKED',
    merged:  '✔️  MERGED',
  }

  for (const status of groups) {
    const group = contracts.filter(c => c.status === status)
    if (group.length === 0) continue

    console.log(`${C.bold}${groupLabels[status]}${C.reset}`)
    console.log()

    for (const c of group) {
      const col = statusColor(status)
      const spec = c.spec_path ? `  ${C.gray}[${c.spec_path}]${C.reset}` : ''
      const blocked = c.blocked_reason ? `\n  ${C.red}⛔ ${c.blocked_reason}${C.reset}` : ''
      const pausedNote =
        status === 'paused' && c.paused_reason
          ? `\n  ${C.yellow}⏸ ${c.paused_reason}${C.reset}`
          : ''
      const deps = c.dependencies.length > 0
        ? `\n  ${C.gray}deps: ${c.dependencies.join(', ')}${C.reset}`
        : ''
      const merged = c.merged_at ? `  ${C.gray}(${c.merged_at})${C.reset}` : ''

      console.log(`  ${col}${c.id}${C.reset}${merged}${spec}`)
      if (status !== 'merged') {
        console.log(`  ${C.white}${c.title}${C.reset}`)
        if (status === 'active' || status === 'ready' || status === 'paused') {
          const goal = c.goal.length > 90 ? c.goal.substring(0, 90) + '...' : c.goal
          console.log(`  ${C.gray}${goal}${C.reset}`)
        }
      } else {
        console.log(`  ${C.gray}${c.title}${C.reset}`)
      }
      console.log(`${deps}${blocked}${pausedNote}`)
    }
    console.log()
  }

  const merged = contracts.filter(c => c.status === 'merged').length
  const total = contracts.filter(c => c.status !== 'superseded').length
  const progress = total > 0 ? Math.round((merged / total) * 100) : 0

  console.log(`${C.gray}${'─'.repeat(70)}${C.reset}`)
  console.log(`${C.bold}Progress: ${progress}% (${merged}/${total} kontrakter merget)${C.reset}`)
  console.log()
}

main()
