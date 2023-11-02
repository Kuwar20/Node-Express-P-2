const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");

const getContacts = asyncHandler(async (req, res) => {
    const contacts = await Contact.find({user_id:req.user.id});
    res.json(contacts);
})

const createContact = asyncHandler(async (req, res) => {
    console.log("The req body is :", req.body)
    const { name, email, phone } = req.body;
    if (!name || !email || !phone) {
        res.status(400);
        throw new Error("All fields are mandetory")
    }
    const contact = await Contact.create({
        name,
        email,
        phone,
        user_id:req.user.id,
    });
    res.json(contact);
})

const getContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        res.status(404);
        throw new Error("Contact not foumd")
    }
    res.json(contact);

})


const updateContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        res.status(404);
        throw new Error("Contact not foumd")
    }

    if(contact.user_id.toString() !== req.user.id)
{
    res.status(403);
    throw new Error("User dont have permission to update other users information")
}

    const updatedContact = await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    )

    res.json(updatedContact);
})

const deleteContacts = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        res.status(404);
        throw new Error("Contact not foumd")
    }
    
    if(contact.user_id.toString() !== req.user.id)
{
    res.status(403);
    throw new Error("User dont have permission to update other users information")
}


   // await Contact.remove();
    await Contact.deleteOne({ _id: req.params.id }); 
    //res.status(204).json(); 
     res.json(contact);
})

module.exports = {
    getContacts,
    createContact,
    getContact,
    updateContact,
    deleteContacts
};