const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {check , validationResult} = require('express-validator/check');
const Contact = require('../models/Contact');
const User = require('../models/User');

// @route   GET api/contacts
// @desc    Get all user's contacts
// @access  Private
router.get('/', auth, async (req,res)=> {
    try {
        const contacts = await Contact.find({user: req.user.id}).sort({date: -1});
        res.json(contacts);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/contacts
// @desc    Add new contact
// @access  Private
router.post('/',[ auth, 
        [
            check('name','Name is required').not().isEmpty()
        ]
     ],
    async (req,res)=> {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    const {name, email, phone, type} = req.body;
    try {
        const newContact = new Contact({
            name,
            email,
            phone,
            type,
            user: req.user.id
        });
        const contact = await newContact.save();
        res.json(contact);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/contacts/:id
// @desc    Update contact
// @access  Private
router.put('/:id',auth, async (req,res)=> {
    const {name,email,phone,type} = req.body;

    //build a contact object
    const contactFields = {};
    if(name) contactFields.name = name;
    if(email) contactFields.email = email;
    if(phone) contactFields.phone = phone;
    if(type) contactFields.type = type;

    try {
        let contact = await Contact.findById(req.params.id);
        if(!contact) return res.status(404).json({msg : 'contact not found'});
        //make sure user owns contact
        if(contact.user.toString() !== req.user.id) {
            return res.status(401).json({msg: 'Not Authorized'});
        }

        contact = await Contact.findByIdAndUpdate(req.params.id, { $set: contactFields },{new:true});
        res.json(contact);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/contact/:id
// @desc    Delete contact
// @access  Private
router.delete('/:id',auth, async (req,res)=> {
    try {
        let contact = await Contact.findById(req.params.id);
        if(!contact) return res.status(404).json({msg : 'contact not found'});
        //make sure user owns contact
        if(contact.user.toString() !== req.user.id) {
            return res.status(401).json({msg: 'Not Authorized'});
        }

        await Contact.findByIdAndRemove(req.params.id);
        res.json({msg: 'Contact Removed'});

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


//export router
module.exports = router;