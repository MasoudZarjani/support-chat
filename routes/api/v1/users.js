import express from 'express'
import userController from '../../../controllers/userController'

const router = express.Router()

router.get('/index', userController.getUsers)
router.post('/register', userController.setUser)

export default router;