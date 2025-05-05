export function availableAmenities (amenities) {
  return amenities
    .filter(a => (a.type === 'BOOLEAN' && a.booleanValue) || (a.type === 'NUMERIC' && a.numericValue > 0) || (a.type === 'MULTI' && a.multiValue !== null))
}

export async function LDAPSearch (fullName, LDAP) {
  const users = await LDAP.findUser({ username: `%2A${fullName}%2A` }).then(r => Object.values(r))
  return users.length > 0
    ? users
    : LDAP.findUser({ fullName: `%2A${fullName}%2A` }).then(r => Object.values(r))
}
