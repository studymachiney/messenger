'use client'

import Avatar from '@/components/Avatar'
import useOtherUser from '@/hooks/useOtherUser'
import { Conversation, User } from '@prisma/client'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { HiChevronLeft } from 'react-icons/hi'
import { HiEllipsisHorizontal } from 'react-icons/hi2'
import ProfileDrawer from './ProfileDrawer'
import AvatarGroup from '@/components/AvatarGroup'
import useActiveList from '@/hooks/useAcitveList'

interface HeaderProps {
  conversation: Conversation & {
    users: User[]
  }
}

export default function Header({ conversation }: HeaderProps) {
  const otherUser = useOtherUser(conversation)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const { members } = useActiveList()
  const isActive = members.indexOf(otherUser.email!) !== -1

  const statusText = useMemo(() => {
    if (conversation.isGroup) {
      return `${conversation.users.length} members`
    }

    return isActive ? 'Active' : 'Offline'
  }, [conversation, isActive])

  return (
    <>
      <ProfileDrawer
        data={conversation}
        isOpen={drawerOpen}
        onClose={() => {
          setDrawerOpen(false)
        }}
      />
      <div className="flex items-center justify-between w-full py-3 bg-white border-b shadow-sm sm:px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <Link
            className="block transition cursor-pointer lg:hidden text-sky-500 hover:text-sky-600"
            href="/conversations"
          >
            <HiChevronLeft size={32} />
          </Link>

          {conversation.isGroup ? (
            <AvatarGroup users={conversation.users} />
          ) : (
            <Avatar user={otherUser} />
          )}

          <div className="flex flex-col">
            <div>{conversation.name || otherUser.name}</div>
            <div className="text-sm font-light text-neutral-500">
              {statusText}
            </div>
          </div>
        </div>
        <HiEllipsisHorizontal
          size={32}
          onClick={() => setDrawerOpen(true)}
          className="transition cursor-pointer text-sky-500 hover:text-sky-600"
        />
      </div>
    </>
  )
}
