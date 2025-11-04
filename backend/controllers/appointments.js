const { getDb } = require('../lib/mongoClient')
const { ObjectId } = require('mongodb')

async function createAppointment(req, res) {
  try {
    const userId = req.user.id
    const { patientId, date, diagnosis, symptoms, temperature, bloodPressure, heartRate, oxygenSaturation, instructions, followUpInDays } = req.body
    if (!patientId || !date) return res.status(400).json({ error: 'patientId and date required' })

    const db = await getDb()
    // verify patient belongs to user
    const patient = await db.collection('patients').findOne({ _id: new ObjectId(patientId), userId })
    if (!patient) return res.status(404).json({ error: 'Patient not found or not owned by user' })

    const appointment = {
      patientId: new ObjectId(patientId),
      date: new Date(date),
      diagnosis: diagnosis || '',
      symptoms: symptoms || '',
      temperature: temperature ?? null,
      bloodPressure: bloodPressure || null,
      heartRate: heartRate ?? null,
      oxygenSaturation: oxygenSaturation ?? null,
      instructions: instructions || '',
      followUpInDays: followUpInDays ?? null,
      createdAt: new Date(),
      aiAnalysis: null
    }

    const result = await db.collection('appointments').insertOne(appointment)
    return res.status(201).json({ id: result.insertedId, ...appointment })
  } catch (err) {
    console.error('createAppointment error:', err)
    return res.status(500).json({ error: 'Failed to create appointment' })
  }
}

async function getAppointments(req, res) {
  try {
    const userId = req.user.id
    const { patientId } = req.query
    const db = await getDb()

    if (patientId) {
      const list = await db.collection('appointments').find({ patientId: new ObjectId(patientId) }).toArray()
      return res.json(list)
    }

    // get appointments for all patients owned by user
    const patients = await db.collection('patients').find({ userId }).project({ _id: 1 }).toArray()
    const patientIds = patients.map(p => p._id)
    const list = await db.collection('appointments').find({ patientId: { $in: patientIds } }).toArray()
    return res.json(list)
  } catch (err) {
    console.error('getAppointments error:', err)
    return res.status(500).json({ error: 'Failed to fetch appointments' })
  }
}

async function getTodayCount(req, res) {
  try {
    const userId = req.user.id

    const start = new Date()
    start.setHours(0, 0, 0, 0)

    const end = new Date()
    end.setHours(23, 59, 59, 999)

    const db = await getDb()

    // find patients for user
    const patients = await db.collection('patients').find({ userId }).project({ _id: 1 }).toArray()
    const patientIds = patients.map(p => p._id)

    const count = await db.collection('appointments').countDocuments({ patientId: { $in: patientIds }, date: { $gte: start, $lte: end } })

    return res.json({ count })
  } catch (err) {
    console.error('getTodayCount error:', err)
    return res.status(500).json({ error: "Failed to fetch today's appointment count" })
  }
}

async function getAppointment(req, res) {
  try {
    const id = req.params.id
    const db = await getDb()
    const appt = await db.collection('appointments').findOne({ _id: new ObjectId(id) })
    if (!appt) return res.status(404).json({ error: 'Appointment not found' })
    return res.json(appt)
  } catch (err) {
    console.error('getAppointment error:', err)
    return res.status(500).json({ error: 'Failed to fetch appointment' })
  }
}

async function updateAppointment(req, res) {
  try {
    const id = req.params.id
    const db = await getDb()
    const update = req.body
    if (update.patientId) update.patientId = new ObjectId(update.patientId)
    if (update.date) update.date = new Date(update.date)
    const result = await db.collection('appointments').findOneAndUpdate({ _id: new ObjectId(id) }, { $set: update }, { returnDocument: 'after' })
    if (!result.value) return res.status(404).json({ error: 'Appointment not found' })
    return res.json(result.value)
  } catch (err) {
    console.error('updateAppointment error:', err)
    return res.status(500).json({ error: 'Failed to update appointment' })
  }
}

async function deleteAppointment(req, res) {
  try {
    const id = req.params.id
    const db = await getDb()
    const result = await db.collection('appointments').deleteOne({ _id: new ObjectId(id) })
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Appointment not found' })
    return res.json({ ok: true })
  } catch (err) {
    console.error('deleteAppointment error:', err)
    return res.status(500).json({ error: 'Failed to delete appointment' })
  }
}

module.exports = { createAppointment, getAppointments, getAppointment, updateAppointment, deleteAppointment, getTodayCount }
