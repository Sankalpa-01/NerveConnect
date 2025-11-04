const express = require('express')
const router = express.Router()
const auth = require('../middleware/authMiddleware')
const { createPatient, getPatients, getPatient, updatePatient, deletePatient } = require('../controllers/patients')

router.use(auth)
router.post('/', createPatient)
router.get('/', getPatients)
router.get('/:id', getPatient)
router.put('/:id', updatePatient)
router.delete('/:id', deletePatient)

module.exports = router
