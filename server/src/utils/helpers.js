/**
 * Sanitize user object — remove sensitive fields before sending to client.
 */
function sanitizeUser(user) {
  if (!user) return null;
  const { password, ...safe } = user;
  return safe;
}

module.exports = { sanitizeUser };
