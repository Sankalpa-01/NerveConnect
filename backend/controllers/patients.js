const { getDb } = require('../lib/mongoClient')

async function createPatient(req, res) {
  try {
    const userId = req.user.id
    const { name, age, phone, email, address } = req.body
    if (!name) return res.status(400).json({ error: 'name required' })

    const db = await getDb()
    const patients = db.collection('patients')
    const diseases = req.body.diseases || []
    const patient = { name, age: age || null, phone: phone || '', email: email || '', address: address || '', userId, diseases, createdAt: new Date() }
    const result = await patients.insertOne(patient)
    return res.status(201).json({ id: result.insertedId, ...patient })
  } catch (err) {
    console.error('createPatient error:', err)
    return res.status(500).json({ error: 'Failed to create patient' })
  }
}

async function getPatients(req, res) {
  try {
    const userId = req.user.id
    const db = await getDb()
    const patients = db.collection('patients')
    const list = await patients.find({ userId }).toArray()

    // attach appointments to each patient
    const appointmentsCol = db.collection('appointments')
    const withAppointments = await Promise.all(
      list.map(async (p) => {
        const appts = await appointmentsCol.find({ patientId: p._id }).toArray()
        return { ...p, appointments: appts }
      })
    )

    return res.json(withAppointments)
  } catch (err) {
    console.error('getPatients error:', err)
    return res.status(500).json({ error: 'Failed to fetch patients' })
  }
}

async function getPatient(req, res) {
  try {
    const id = req.params.id
    const { ObjectId } = require('mongodb')
    const db = await getDb()
    const p = await db.collection('patients').findOne({ _id: new ObjectId(id) })
    if (!p) return res.status(404).json({ error: 'Patient not found' })
    return res.json(p)
  } catch (err) {
    console.error('getPatient error:', err)
    return res.status(500).json({ error: 'Failed to fetch patient' })
  }
}

async function updatePatient(req, res) {
  try {
    const id = req.params.id
    const { ObjectId } = require('mongodb')
    const update = req.body
    const db = await getDb()
    const result = await db.collection('patients').findOneAndUpdate({ _id: new ObjectId(id) }, { $set: update }, { returnDocument: 'after' })
    if (!result.value) return res.status(404).json({ error: 'Patient not found' })
    return res.json(result.value)
  } catch (err) {
    console.error('updatePatient error:', err)
    return res.status(500).json({ error: 'Failed to update patient' })
  }
}

async function deletePatient(req, res) {
  try {
    const id = req.params.id
    const { ObjectId } = require('mongodb')
    const db = await getDb()
    const result = await db.collection('patients').deleteOne({ _id: new ObjectId(id) })
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Patient not found' })
    return res.json({ ok: true })
  } catch (err) {
    console.error('deletePatient error:', err)
    return res.status(500).json({ error: 'Failed to delete patient' })
  }
}

module.exports = { createPatient, getPatients, getPatient, updatePatient, deletePatient }
