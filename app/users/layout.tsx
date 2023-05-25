import getUsers from '@/actions/getUsers'
import Sidebar from '@/components/Sidebar/Sidebar'
import UserList from './UserList'

export default async function UsersLayout({
  children
}: {
  children: React.ReactNode
}) {
  const users = await getUsers()

  return (
    // @ts-expect-error Server Component
    <Sidebar>
      <UserList list={users} />
      <div className="h-full">{children}</div>
    </Sidebar>
  )
}
