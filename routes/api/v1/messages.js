import express from 'express'
import messageController from '../../../controllers/messageController'

const router = express.Router()

router.get('/index', messageController.getMessageFromUser)

export default router;