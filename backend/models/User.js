const { v4: uuidv4 } = require('uuid');

// In-memory user storage
let users = [];

const User = {
  findAll: () => users,

  findById: (id) => users.find((user) => user.id === id),

  findByEmail: (email) => users.find((user) => user.email === email),

  findByUsername: (username) => users.find((user) => user.username === username),

  create: ({ username, email, password, bio = '', avatar = '' }) => {
    const newUser = {
      id: uuidv4(),
      username,
      email,
      password,
      bio,
      avatar,
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    return newUser;
  },

  update: (id, updates) => {
    const index = users.findIndex((user) => user.id === id);
    if (index === -1) return null;
    users[index] = { ...users[index], ...updates };
    return users[index];
  },

  // Return user without password
  sanitize: (user) => {
    if (!user) return null;
    const { password, ...sanitized } = user;
    return sanitized;
  },
};

module.exports = User;
