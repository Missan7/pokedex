import { writeFileSync, mkdirSync } from 'fs'

const BATCH_SIZE = 50

async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return await res.json()
    } catch (e) {
      if (i === retries - 1) throw e
      await new Promise(r => setTimeout(r, 500 * (i + 1)))
    }
  }
}

async function main() {
  console.log('Fetching species list...')
  const list = await fetchWithRetry('https://pokeapi.co/api/v2/pokemon-species?limit=1025')
  console.log(`Got ${list.results.length} species. Fetching French names in batches...`)

  const names = {}

  for (let i = 0; i < list.results.length; i += BATCH_SIZE) {
    const batch = list.results.slice(i, i + BATCH_SIZE)
    await Promise.all(
      batch.map(async (species) => {
        const data = await fetchWithRetry(species.url)
        const frName = data.names.find(n => n.language.name === 'fr')?.name
          ?? data.names.find(n => n.language.name === 'en')?.name
          ?? species.name
        names[data.id] = frName
      })
    )
    const done = Math.min(i + BATCH_SIZE, list.results.length)
    process.stdout.write(`\r  ${done}/${list.results.length}`)
  }

  console.log('\nWriting frenchNames.json...')
  mkdirSync('./src/data', { recursive: true })
  writeFileSync('./src/data/frenchNames.json', JSON.stringify(names))
  console.log(`Done! ${Object.keys(names).length} names saved.`)
}

main().catch(e => { console.error(e); process.exit(1) })
