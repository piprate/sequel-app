export function roleName (role, description) {
  if (description) {
    return description
  } else if (role === 'ClimateAction') {
    return 'Climate Action'
  } else {
    return role
  }
}

export function paymentRoleName (role, evergreenProfile) {
  if (evergreenProfile) {
    for (const profileRole of evergreenProfile.roles) {
      if (profileRole.id === role) {
        return roleName(role, profileRole.description)
      }
    }
  }

  return roleName(role)
}