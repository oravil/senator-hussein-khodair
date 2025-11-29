import News from '../models/News.model.js';
import Contact from '../models/Contact.model.js';

export const getStats = async (req, res) => {
  try {
    const [
      totalNews,
      publishedNews,
      totalContacts,
      pendingContacts,
      inProgressContacts,
      resolvedContacts,
      totalViews
    ] = await Promise.all([
      News.countDocuments(),
      News.countDocuments({ published: true }),
      Contact.countDocuments(),
      Contact.countDocuments({ status: 'pending' }),
      Contact.countDocuments({ status: 'in-progress' }),
      Contact.countDocuments({ status: 'resolved' }),
      News.aggregate([
        { $group: { _id: null, total: { $sum: '$views' } } }
      ])
    ]);
    
    // Contact types distribution
    const contactsByType = await Contact.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);
    
    // Recent contacts
    const recentContacts = await Contact.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name type status createdAt');
    
    res.json({
      news: {
        total: totalNews,
        published: publishedNews,
        views: totalViews[0]?.total || 0
      },
      contacts: {
        total: totalContacts,
        pending: pendingContacts,
        inProgress: inProgressContacts,
        resolved: resolvedContacts,
        byType: contactsByType,
        recent: recentContacts
      }
    });
  } catch (error) {
    res.status(500).json({ error: { message: error.message } });
  }
};
