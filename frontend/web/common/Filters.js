export function availableAmenities (amenities) {
  return amenities
    .filter(a => (a.type === 'BOOLEAN' && a.booleanValue) || (a.type === 'NUMERIC' && a.numericValue > 0) || (a.type === 'MULTI' && a.multiValue !== null))
}

export const LDAPSearch = async (fullName, LDAP) => {
  const users = await LDAP.findUser({ username: fullName, type: ['employee', 'contractor'] }).then(r => Object.values(r))
  return users.length > 0
    ? users
    : LDAP.findUser({ fullName, type: ['employee', 'contractor'] }).then(r => Object.values(r))
}
