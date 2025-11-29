import Contact from '../models/Contact.model.js';

// Submit contact form
export const submitContact = async (req, res) => {
  try {
    const { name, phone, email, type, message } = req.body;
    
    const contact = new Contact({
      name,
      phone,
      email,
      type,
      message
    });
    
    await contact.save();
    res.status(201).json({ 
      message: 'تم إرسال طلبك بنجاح',
      data: contact 
    });
  } catch (error) {
    res.status(400).json({ error: { message: error.message } });
  }
};

// Get all contacts (Admin only)
export const getAllContacts = async (req, res) => {
  try {
    const { status, type } = req.query;
    const query = {};
    
    if (status) query.status = status;
    if (type) query.type = type;
    
    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .select('-__v');
    
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: { message: error.message } });
  }
};

// Get single contact (Admin only)
export const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({ error: { message: 'الطلب غير موجود' } });
    }
    
    res.json(contact);
  } catch (error) {
    res.status(500).json({ error: { message: error.message } });
  }
};

// Update contact status (Admin only)
export const updateContactStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status, ...(notes && { notes }) },
      { new: true, runValidators: true }
    );
    
    if (!contact) {
      return res.status(404).json({ error: { message: 'الطلب غير موجود' } });
    }
    
    res.json(contact);
  } catch (error) {
    res.status(400).json({ error: { message: error.message } });
  }
};

// Delete contact (Admin only)
export const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    
    if (!contact) {
      return res.status(404).json({ error: { message: 'الطلب غير موجود' } });
    }
    
    res.json({ message: 'تم حذف الطلب بنجاح' });
  } catch (error) {
    res.status(500).json({ error: { message: error.message } });
  }
};
