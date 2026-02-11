const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { authMiddleware, adminMiddleware } = require('../middlewares/auth');

router.get('/', authMiddleware, taskController.getTasks);
router.get('/:id', authMiddleware, taskController.getTaskById);
router.post('/', authMiddleware, adminMiddleware, taskController.createTask);
router.put('/:id', authMiddleware, adminMiddleware, taskController.updateTask);
router.delete('/:id', authMiddleware, adminMiddleware, taskController.deleteTask);

module.exports = router;
