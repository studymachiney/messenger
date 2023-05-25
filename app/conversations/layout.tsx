import Sidebar from '@/components/Sidebar/Sidebar'
import ConversationList from './components/ConversationList'
import getConversations from '@/actions/getConversations'
import getUsers from '@/actions/getUsers'

export default async function ConversationsLayout({
  children
}: {
  children: React.ReactNode
}) {
  const conversations = await getConversations()
  const users = await getUsers()

  return (
    // @ts-expect-error Server Component
    <Sidebar>
      <ConversationList initialItems={conversations} users={users} />
      <div className="h-full">{children}</div>
    </Sidebar>
  )
}
