const axios = require('axios')

const BACKEND = process.env.BACKEND_URL || 'http://localhost:4000'

async function run() {
  try {
    console.log('Running E2E smoke test against', BACKEND)

    // 1) Signup
    const signupRes = await axios.post(`${BACKEND}/api/auth/signup`, {
      name: 'Test User',
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'Password123!'
    }, { validateStatus: () => true })

    console.log('Signup status', signupRes.status)
    // capture cookie
    let cookies = signupRes.headers['set-cookie']
    if (cookies) {
      cookies = Array.isArray(cookies) ? cookies.join('; ') : cookies
    }

    // 2) Signin (if signup didn't set cookie or user existed)
    const signinRes = await axios.post(`${BACKEND}/api/auth/signin`, {
      usernameOrEmail: 'testuser',
      password: 'Password123!'
    }, { validateStatus: () => true })

    console.log('Signin status', signinRes.status)
    if (!cookies) {
      cookies = signinRes.headers['set-cookie']
      if (cookies) cookies = Array.isArray(cookies) ? cookies.join('; ') : cookies
    }

    // 3) Create patient (requires auth)
    const patientRes = await axios.post(`${BACKEND}/api/patients`, {
      name: 'Jane Doe', age: 30, phone: '1234567890', email: 'jane@example.com', address: '123 Main St'
    }, { headers: { Cookie: cookies || '' }, validateStatus: () => true })

    console.log('Create patient status', patientRes.status)
    const patientId = patientRes.data?.id || patientRes.data?._id || (patientRes.data && patientRes.data.insertedId)
    console.log('Patient id:', patientId)

    // 4) Create appointment
    const appointmentRes = await axios.post(`${BACKEND}/api/appointments`, {
      patientId: patientId,
      date: new Date(Date.now() + 3600 * 1000).toISOString(),
      diagnosis: 'Test diagnosis',
      symptoms: 'cough',
    }, { headers: { Cookie: cookies || '' }, validateStatus: () => true })

    console.log('Create appointment status', appointmentRes.status)
    const appointmentId = appointmentRes.data?.id || appointmentRes.data?._id
    console.log('Appointment id:', appointmentId)

    // 5) Generate AI prescription (no auth required for the generate endpoint)
    const aiRes = await axios.post(`${BACKEND}/api/ai_analysis`, { appointment: { symptoms: 'cough', diagnosis: 'cold' } }, { validateStatus: () => true })
    console.log('AI generate status', aiRes.status)
    console.log('AI result snippet:', (aiRes.data?.prescription || aiRes.data?.result || '').slice(0, 200))

    // 6) Store AI analysis on appointment (requires auth)
    const storeRes = await axios.post(`${BACKEND}/api/appointments/ai_analysis`, { appointmentId, aiAnalysis: { prescription: aiRes.data?.prescription || aiRes.data?.result } }, { headers: { Cookie: cookies || '' }, validateStatus: () => true })
    console.log('Store AI analysis status', storeRes.status)
    console.log('Store response:', storeRes.data)

    console.log('E2E test completed')
  } catch (err) {
    console.error('E2E test failed:', err?.response?.data || err.message || err)
    process.exit(1)
  }
}

run()
