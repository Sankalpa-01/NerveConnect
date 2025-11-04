const { spawn } = require('child_process')
const http = require('http')
const path = require('path')

const backendDir = path.resolve(__dirname)
const serverPath = path.join(backendDir, 'server.js')
const e2ePath = path.join(backendDir, 'e2e_test.js')

function waitForServer(url, timeout = 30000) {
  const start = Date.now()
  return new Promise((resolve, reject) => {
    const check = () => {
      const req = http.request(url, { method: 'GET', timeout: 2000 }, (res) => {
        resolve()
      })
      req.on('error', () => {
        if (Date.now() - start > timeout) {
          reject(new Error('Server did not start within timeout'))
        } else {
          setTimeout(check, 500)
        }
      })
      req.end()
    }
    check()
  })
}

async function run() {
  console.log('Spawning backend server with in-memory DB...')
  const server = spawn(process.execPath, [serverPath], {
    env: { ...process.env, USE_IN_MEMORY_DB: 'true' },
    cwd: backendDir,
    stdio: ['ignore', 'pipe', 'pipe'],
  })

  server.stdout.on('data', (d) => process.stdout.write(`[server] ${d}`))
  server.stderr.on('data', (d) => process.stderr.write(`[server] ${d}`))

  server.on('exit', (code, sig) => {
    console.log(`Server exited with ${code} ${sig}`)
  })

  try {
    await waitForServer('http://localhost:4000/')
    console.log('Server is up, running E2E test...')

    const tester = spawn(process.execPath, [e2ePath], { cwd: backendDir, stdio: 'inherit', env: process.env })
    tester.on('exit', (code) => {
      console.log('E2E test finished with code', code)
      // kill server
      server.kill()
      process.exit(code)
    })
  } catch (err) {
    console.error('Failed to start server or run tests:', err)
    server.kill()
    process.exit(1)
  }
}

run()
