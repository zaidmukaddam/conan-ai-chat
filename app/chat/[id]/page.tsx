import { type Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'

import { auth } from '@/auth'
import { getChat } from '@/app/actions'
import { Chat } from '@/components/chat'

export const runtime = 'edge'
export const preferredRegion = 'home'

export interface ChatPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({
  params
}: ChatPageProps): Promise<Metadata> {
  const session = await auth()

  if (!session?.user) {
    return {}
  }

  const chat = await getChat(params.id, session.user.id)
  return {
    title: chat?.title.slice(0, 50) ?? 'Chat',
    description: chat?.messages[0]?.content.slice(0, 50) ?? 'Chat',
    openGraph: {
      title: chat?.title.slice(0, 50) ?? 'Chat',
      description: chat?.messages[0]?.content.slice(0, 50) ?? 'Chat',
    },
    twitter: {
      card: 'summary_large_image',
      creator: '@zaidmukaddam',
      title: chat?.title.slice(0, 50) ?? 'Chat',
      description: chat?.messages[0]?.content.slice(0, 50) ?? 'Chat',
    },
  }
}

export default async function ChatPage({ params }: ChatPageProps) {
  const session = await auth()

  if (!session?.user) {
    redirect(`/sign-in?next=/chat/${params.id}`)
  }

  const chat = await getChat(params.id, session.user.id)

  if (!chat) {
    notFound()
  }

  if (chat?.userId !== session?.user?.id) {
    notFound()
  }

  return <Chat id={chat.id} initialMessages={chat.messages} />
}
