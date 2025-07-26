// app/controllers/requests_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import Request from '#models/request'

export default class RequestsController {
  async index({ response }: HttpContext) {
    try {
      const requests = await Request.query()
        .preload('requestedBy', (query) => {
          query.preload('role')
        })
        .preload('assignedTo')
        .orderBy('created_at', 'desc')

      return response.json(requests)
    } catch (error) {
      return response.status(500).json({
        message: 'Failed to fetch requests',
        error: error.message,
      })
    }
  }

  async show({ params, response }: HttpContext) {
    try {
      const request = await Request.query()
        .where('id', params.id)
        .preload('requestedBy', (query) => {
          query.preload('role')
        })
        .preload('assignedTo')
        .firstOrFail()

      return response.json(request)
    } catch (error) {
      return response.status(404).json({
        message: 'Request not found',
      })
    }
  }

  async update({ params, request, response }: HttpContext) {
    try {
      const requestRecord = await Request.findOrFail(params.id)
      const data = request.only(['status', 'assignedToId', 'notes'])

      requestRecord.merge(data)
      await requestRecord.save()

      await requestRecord.load('requestedBy', (query) => {
        query.preload('role')
      })
      await requestRecord.load('assignedTo')

      return response.json(requestRecord)
    } catch (error) {
      return response.status(400).json({
        message: 'Failed to update request',
        error: error.message,
      })
    }
  }
}
