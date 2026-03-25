const express = require('express');
const { getTreks, getTrek, createTrek, deleteTrek, updateTrek } = require('../controllers/trekController');
const requireAuth = require('../middleware/requireAuth');
const upload = require('../middleware/upload'); 

const router = express.Router();

router.get('/', getTreks);
router.get('/:id', getTrek);

router.use(requireAuth);

router.post('/', upload.single('image'), createTrek);
router.delete('/:id', deleteTrek);
router.patch('/:id', upload.single('image'), updateTrek);

module.exports = router;