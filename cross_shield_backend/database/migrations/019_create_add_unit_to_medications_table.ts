import { BaseSchema } from '@adonisjs/lucid/schema'
import db from '@adonisjs/lucid/services/db'

export default class BackfillUnitInMedications extends BaseSchema {
  async up() {
    // Fetch all rows that have medications
    const requests = await db.from('medication_requests').select('id', 'medications')

    for (const req of requests) {
      try {
        // Parse JSON (handle cases where it's already an object)
        let meds =
          typeof req.medications === 'string' ? JSON.parse(req.medications) : req.medications

        if (!Array.isArray(meds)) continue

        // Add "unit": "Pack" if missing
        const updatedMeds = meds.map((med) => ({
          ...med,
          unit: med.unit || 'Pack',
        }))

        // Save updated JSON back
        await db
          .from('medication_requests')
          .where('id', req.id)
          .update({ medications: JSON.stringify(updatedMeds) })
      } catch (error) {
        console.error(`Skipping request ID ${req.id}:`, error.message)
      }
    }
  }

  async down() {
    // Optional: remove "unit" key from medications
    const requests = await db.from('medication_requests').select('id', 'medications')

    for (const req of requests) {
      try {
        let meds =
          typeof req.medications === 'string' ? JSON.parse(req.medications) : req.medications

        if (!Array.isArray(meds)) continue

        const updatedMeds = meds.map(({ unit, ...rest }) => rest)

        await db
          .from('medication_requests')
          .where('id', req.id)
          .update({ medications: JSON.stringify(updatedMeds) })
      } catch (error) {
        console.error(`Skipping request ID ${req.id}:`, error.message)
      }
    }
  }
}
