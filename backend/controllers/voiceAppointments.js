const { getDb } = require('../lib/mongoClient')
const { isTimeConflict } = require('../lib/timeUtils')

async function scheduleVoiceAppointment(req, res) {
  try {
    const { patientName, doctorName, datetime } = req.body

    if (!patientName || !doctorName || !datetime) {
      return res.status(400).json({ error: 'Missing required fields: patientName, doctorName, and datetime are required' })
    }

    const dateObj = new Date(datetime)
    if (isNaN(dateObj.getTime())) return res.status(400).json({ error: 'Invalid datetime' })

    if (dateObj <= new Date()) {
      return res.status(400).json({ error: 'Appointment datetime must be in the future' })
    }

    const db = await getDb()

    // Find or create patient
    let patient = await db.collection('voicePatients').findOne({ name: patientName })
    if (!patient) {
      const r = await db.collection('voicePatients').insertOne({ name: patientName })
      patient = { _id: r.insertedId, name: patientName }
    }

    // Find or create doctor
    let doctor = await db.collection('voiceDoctors').findOne({ name: doctorName })
    if (!doctor) {
      const r = await db.collection('voiceDoctors').insertOne({ name: doctorName })
      doctor = { _id: r.insertedId, name: doctorName }
    }

    // Check doctor availability
    const existingAppointments = await db.collection('voiceAppointments').find({ doctorId: doctor._id }).toArray()

    if (isTimeConflict(dateObj, existingAppointments)) {
      return res.status(409).json({ error: `Sorry, ${doctorName} is unavailable at that time. Please choose another time.` })
    }

    // Schedule appointment
    const appointment = {
      doctorId: doctor._id,
      patientId: patient._id,
      date: dateObj,
      createdAt: new Date(),
    }

    const result = await db.collection('voiceAppointments').insertOne(appointment)

    return res.json({ message: `Appointment successfully scheduled with ${doctorName} at ${dateObj.toUTCString()}`, appointmentId: result.insertedId })
  } catch (error) {
    console.error('Voice appointment error:', error)
    return res.status(500).json({ error: 'Failed to schedule appointment' })
  }
}

module.exports = { scheduleVoiceAppointment }
