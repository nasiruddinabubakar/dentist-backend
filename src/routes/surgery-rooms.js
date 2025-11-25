const express = require('express');
const router = express.Router();
const surgeryRoomController = require('../controllers/SurgeryRoomController');
const { authenticate } = require('../middlewares/auth');

router.get('/', authenticate, surgeryRoomController.getSurgeryRooms);
router.post('/', authenticate, surgeryRoomController.createSurgeryRoom);
router.put('/:id', authenticate, surgeryRoomController.updateSurgeryRoom);
router.delete('/:id', authenticate, surgeryRoomController.deleteSurgeryRoom);

module.exports = router;

