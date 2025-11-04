const express = require('express')
const router = express.Router()
const auth = require('../middleware/authMiddleware')
const { createAppointment, getAppointments, getAppointment, updateAppointment, deleteAppointment, getTodayCount } = require('../controllers/appointments')

router.use(auth)
router.post('/', createAppointment)
router.get('/today', getTodayCount)
router.get('/', getAppointments)
router.get('/:id', getAppointment)
router.put('/:id', updateAppointment)
router.delete('/:id', deleteAppointment)

module.exports = router
