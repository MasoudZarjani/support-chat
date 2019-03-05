import express from 'express'
import userController from '../../../controllers/userController'

const router = express.Router()

router.get('/index', userController.getUser)

export default router;