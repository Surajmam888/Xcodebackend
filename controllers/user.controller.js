import User from '../models/user.model.js';

export const getProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
};

export const updateProfile = async (req, res) => {
  const updates = req.body;
  if (req.files?.profileImage) {
    const file = req.files.profileImage;
    const path = `uploads/${file.name}`;
    await file.mv(path);
    updates.profileImage = path;
  }

  const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true });
  res.json(user);
};

export const getAllUsers = async (req, res) => {
  const { page = 1, limit = 10, search = '' } = req.query;
  const query = search ? { name: new RegExp(search, 'i') } : {};
  const users = await User.find(query)
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .select('-password');

  const total = await User.countDocuments(query);

  res.json({ users, total });
};


export const updateUserStatus = async (req, res) => {
  const { id } = req.params;
  const { isVerified } = req.body;

  try {
    const user = await User.findByIdAndUpdate(id, { isVerified }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'Status updated successfully', user });
  } catch (err) {
    console.error('Status update error:', err.message);
    res.status(500).json({ message: 'Error updating user status' });
  }
};
