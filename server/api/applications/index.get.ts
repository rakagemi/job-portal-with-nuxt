import { applications } from '~~/server/data/applications'
import { getAuthUser } from '~~/server/utils/get-auth-user'

export default defineEventHandler((event) => {
  const user = getAuthUser(event)

  const userApplications = applications.filter(
    item => item.userId === user.id
  )

  return {
    data: userApplications,
  }
})