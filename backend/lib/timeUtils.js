function isTimeConflict(newDate, appointments) {
  const newTime = newDate.getTime()

  return appointments.some((appointment) => {
    const existingTime = new Date(appointment.date).getTime()
    return Math.abs(existingTime - newTime) < 30 * 60 * 1000 // 30 mins buffer
  })
}

module.exports = { isTimeConflict }
