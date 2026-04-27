#!/usr/bin/env tsx
/**
 * EiraNova — generate-control-center.ts
 * Regenererer docs/status/CONTROL_CENTER.md fra CONTRACT_QUEUE.json
 * Kjør med: pnpm generate-cc
 */

import fs from 'fs'
import path from 'path'

const ROOT = path.resolve(__dirname, '..')
const QUEUE_PATH = path.join(ROOT, 'docs/contracts/CONTRACT_QUEUE.json')
const CC_PATH = path.join(ROOT, 'docs/status/CONTROL_CENTER.md')
const HISTORY_PATH = path.join(ROOT, 'docs/status/MERGED_HISTORY.md')

interface Contract {
  id: string
  title: string
  type: string
  status: string
  spec_path?: string | null
  goal: string
  dependencies: string[]
  user_stories?: string[]
  merged_at?: string
  blocked_reason?: string
  paused_reason?: string
}

interface Queue {
  contracts: Contract[]
}

function main() {
  const raw = fs.readFileSync(QUEUE_PATH, 'utf8')
  const queue: Queue = JSON.parse(raw)
  const contracts = queue.contracts

  const today = new Date().toISOString().split('T')[0]

  const active = contracts.filter(c => c.status === 'active')
  const paused = contracts.filter(c => c.status === 'paused')
  const ready = contracts.filter(c => c.status === 'ready')
  const planned = contracts.filter(c => c.status === 'planned')
  const blocked = contracts.filter(c => c.status === 'blocked')
  const merged = contracts.filter(c => c.status === 'merged')

  // Valider single-contract rule
  if (active.length > 1) {
    console.error(`❌ FEIL: ${active.length} kontrakter er 'active'. Maks 1 tillatt.`)
    process.exit(1)
  }

  const mergedCount = merged.length
  const totalCount = contracts.filter(c => c.status !== 'superseded').length
  const progress = totalCount > 0 ? Math.round((mergedCount / totalCount) * 100) : 0

  function depsString(deps: string[]): string {
    if (!deps || deps.length === 0) return '—'
    const mergedIds = new Set(merged.map(c => c.id))
    return deps.map(d => mergedIds.has(d) ? `${d} ✅` : d).join(', ')
  }

  let cc = `# CONTROL CENTER
> ⚠️ AUTO-GENERATED — Do not edit manually.
> Generated from: docs/contracts/CONTRACT_QUEUE.json
> Run \`pnpm generate-cc\` to regenerate.

**Last generated:** ${today}
**Progress:** ${progress}% → MVP Launch

---

## 🟢 ACTIVE CONTRACT

`

  if (active.length === 0) {
    cc += `Ingen aktiv kontrakt.\n`
  } else {
    const c = active[0]
    cc += `| ID | Title | Type | Goal |\n`
    cc += `|----|-------|------|------|\n`
    cc += `| **${c.id}** | ${c.title} | ${c.type} | ${c.goal.substring(0, 80)}... |\n`
  }

  cc += `
---

## ⏸️ PAUSED CONTRACTS

`

  if (paused.length === 0) {
    cc += `Ingen pausede kontrakter.\n`
  } else {
    cc += `| ID | Title | Paused reason |\n`
    cc += `|----|-------|---------------|\n`
    paused.forEach(c => {
      const reason = c.paused_reason || 'Midlertidig pause'
      cc += `| ${c.id} | ${c.title} | ${reason} |\n`
    })
  }

  cc += `
---

## ✅ READY CONTRACTS

`

  if (ready.length === 0) {
    cc += `Ingen klare kontrakter.\n`
  } else {
    cc += `| ID | Title | Type | Dependencies | Goal |\n`
    cc += `|----|-------|------|--------------|------|\n`
    ready.forEach(c => {
      const goal = c.goal.length > 80 ? c.goal.substring(0, 80) + '...' : c.goal
      cc += `| **${c.id}** | ${c.title} | ${c.type} | ${depsString(c.dependencies)} | ${goal} |\n`
    })
  }

  cc += `
---

## 📋 PLANNED CONTRACTS

`

  if (planned.length === 0) {
    cc += `Ingen planlagte kontrakter.\n`
  } else {
    cc += `| ID | Title | Type | Dependencies |\n`
    cc += `|----|-------|------|--------------|\n`
    planned.forEach(c => {
      cc += `| ${c.id} | ${c.title} | ${c.type} | ${depsString(c.dependencies)} |\n`
    })
  }

  cc += `
---

## 🚫 BLOCKED

`

  if (blocked.length === 0) {
    cc += `Ingen blokkerte kontrakter.\n`
  } else {
    cc += `| ID | Title | Blocked reason |\n`
    cc += `|----|-------|----------------|\n`
    blocked.forEach(c => {
      const reason = c.blocked_reason || 'Ekstern avhengighet'
      cc += `| ${c.id} | ${c.title} | ${reason} |\n`
    })
  }

  cc += `
---

## ✅ RECENTLY MERGED

`

  const recentMerged = merged
    .filter(c => c.merged_at)
    .sort((a, b) => (b.merged_at || '').localeCompare(a.merged_at || ''))
    .slice(0, 5)

  if (recentMerged.length === 0) {
    cc += `Ingen kontrakter merget ennå.\n`
  } else {
    cc += `| ID | Title | Merged |\n`
    cc += `|----|-------|--------|\n`
    recentMerged.forEach(c => {
      cc += `| ${c.id} | ${c.title} | ${c.merged_at} |\n`
    })
  }

  cc += `
→ [Komplett merge-historikk](./MERGED_HISTORY.md)

---

*Source: docs/contracts/CONTRACT_QUEUE.json*
*Process: docs/PROCESS.md*
`

  fs.writeFileSync(CC_PATH, cc, 'utf8')
  console.log(`✅ CONTROL_CENTER.md generert (${today})`)
  console.log(`   Active: ${active.length} | Paused: ${paused.length} | Ready: ${ready.length} | Planned: ${planned.length} | Blocked: ${blocked.length} | Merged: ${merged.length}`)
  console.log(`   Progress: ${progress}%`)

  // Oppdater MERGED_HISTORY
  if (merged.length > 0) {
    const sortedMerged = merged
      .filter(c => c.merged_at)
      .sort((a, b) => (b.merged_at || '').localeCompare(a.merged_at || ''))

    let history = `# Merge History — EiraNova

> Auto-generert appendix til CONTROL_CENTER.md.
> Komplett kronologisk liste over alle mergede kontrakter.

| ID | Title | Type | Merged |
|----|-------|------|--------|
`
    sortedMerged.forEach(c => {
      history += `| ${c.id} | ${c.title} | ${c.type} | ${c.merged_at} |\n`
    })

    history += `\n---\n*Source: docs/contracts/CONTRACT_QUEUE.json*\n`
    fs.writeFileSync(HISTORY_PATH, history, 'utf8')
    console.log(`✅ MERGED_HISTORY.md oppdatert (${sortedMerged.length} kontrakter)`)
  }
}

main()
