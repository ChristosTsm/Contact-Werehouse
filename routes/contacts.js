const express = require('express');
const router = express.Router();

// @route   GET api/contacts
// @desc    Get all user's contacts
// @access  Private
router.get('/',(req,res)=> {
    res.send('Get all contacts.');
});

// @route   POST api/contacts
// @desc    Add new contact
// @access  Private
router.get('/',(req,res)=> {
    res.send('Add new contact.');
});

// @route   PUT api/contacts/:id
// @desc    Update contact
// @access  Private
router.put('/:id',(req,res)=> {
    res.send('Updte contact.');
});

// @route   DELETE api/contact/:id
// @desc    Delete contact
// @access  Private
router.delete('/:id',(req,res)=> {
    res.send('Delete contact.');
});


//export router
module.exports = router;