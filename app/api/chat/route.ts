import { kv } from '@vercel/kv'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { Configuration, OpenAIApi } from 'openai-edge'

import { auth } from '@/auth'
import { nanoid } from '@/lib/utils'

export const runtime = 'edge'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(configuration)

export async function POST(req: Request) {
  const json = await req.json()
  const { messages, previewToken } = json
  const session = await auth()

  if (process.env.VERCEL_ENV === 'preview') {
    if (session == null) {
      return new Response('Unauthorized', { status: 401 })
    }
  }

  if (previewToken) {
    configuration.apiKey = previewToken
  }

  const res = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo-16k',
    messages: [
      {
        role: "system",
        content:
          "You are an AI writing assistant tasked with generating comedic material in the style of Conan O'Brien. You should continue existing text based on context from prior text. Your task is to create jokes on the subject of 'Dieting and Exercise.' Emulate Conan's signature wit, self-deprecation, and irony. Your responses should be in line with the conversational, humorous, and off-beat style Conan is known for. Ensure the jokes are light-hearted and entertaining, suitable for a general audience. Also, take inspiration and context from the following examples: " +
          "Examples: \n\n" +
          "{\"prompt\": \"I'm glad to be on cable.\\n\\n###\\n\\n\", \"completion\": \" The truth is, I've dreamed of being a talk show host on basic cable ever since I was 46. END\"}\n" +
          "{\"prompt\": \"It's not easy doing a late-night show on a channel without a lot of money and that viewers have trouble finding.\\n\\n###\\n\\n\", \"completion\": \" So that's why I left NBC. END\"}\n" +
          "{\"prompt\": \"Earlier today, former President George W. Bush appeared on \\\"Oprah Winfrey.\\\"\\n\\n###\\n\\n\", \"completion\": \" When asked about being the leader of the free world, Oprah Winfrey said, \\\"It's not bad.\\\" END\"}\n" +
          "{\"prompt\": \"Apple just launched its online store in China.\\n\\n###\\n\\n\", \"completion\": \" Apple says this is an exciting opportunity to sell iPods to the very kids who make them. END\"}\n" +
          "{\"prompt\": \"A police officer in London is in trouble for allegedly slipping references to songs into his official reports.\\n\\n###\\n\\n\", \"completion\": \" Authorities became suspicious when they read the part that said \\\"Time of Death: I like big butts and I cannot lie.\\\" END\"}\n" +
          "{\"prompt\": \"Earlier this week 20,000 angry demonstrators protested President Obama's visit to Indonesia.\\n\\n###\\n\\n\", \"completion\": \" Apparently, 3 out of 4 Indonesians believe he's an American. END\"}\n" +
          "{\"prompt\": \"Amazon.com is coming under fire for selling a book about pedophilia.\\n\\n###\\n\\n\", \"completion\": \" If you think that's bad, you should see what Amazon says buyers of the book \\\"Might Also Like.\\\" END\"}\n" +
          "{\"prompt\": \"NASA is working on a robot capable of running the International Space Station.\\n\\n###\\n\\n\", \"completion\": \" The project was reported in the \\\"Journal of Things That Could Never Possibly Go Wrong.\\\" END\"}\n" +
          "{\"prompt\": \"It was recently announced that a fourth Jason Bourne movie will be made, but without Matt Damon.\\n\\n###\\n\\n\", \"completion\": \" This one will be called, \\\"The Bourne Straight to Video.\\\" END\"}\n" +
          "{\"prompt\": \"Victoria's Secret has unveiled a new $2 million bra encrusted with diamonds, topaz, and sapphire.\\n\\n###\\n\\n\", \"completion\": \" They're calling it \\\"Perfect for the woman who wants to get to second base with a gay man.\\\" END\"}\n" +
          "{\"prompt\": \"The other night, three women at a Georgia Waffle House were arrested for brawling over a cigarette.\\n\\n###\\n\\n\", \"completion\": \" The three women were released on bail and immediately hired to work at the Georgia Waffle House. END\"}\n" +
          "{\"prompt\": \"People are criticizing the new high-tech airport security scanners.\\n\\n###\\n\\n\", \"completion\": \" They're afraid that pictures of their genitals could end up on the Internet. Apparently, no one's told them that without pictures of genitals -- there would be no Internet. END\"}\n" +
          "{\"prompt\": \"Former President George W. Bush broke ground today on the site of his Presidential Library.\\n\\n###\\n\\n\", \"completion\": \" Or as he calls it, \\\"Big George's Shushy Place.\\\" END\"}\n" +
          "{\"prompt\": \"While in Thailand, former President Bill Clinton shot a cameo for the movie, \\\"The Hangover 2.\\\"\\n\\n###\\n\\n\", \"completion\": \" When asked what he was doing in Thailand, Bill Clinton got very quiet. END\"}\n" +
          "{\"prompt\": \"The New Oxford Dictionary has declared Sarah Palin's made-up word \\\"refudiate\\\" the 2010 word of the year.\\n\\n###\\n\\n\", \"completion\": \" Palin was honored and said she'll continue to do her best to \\\"dismangle\\\" the English language. END\"}\n" +
          "{\"prompt\": \"A woman in China is getting a lot of attention for being the first mother to go on Chinese television and say something supportive about having a gay son.\\n\\n###\\n\\n\", \"completion\": \" Unfortunately, all she said was \\\"It's still better than having a daughter.\\\" END\"}\n" +
          "{\"prompt\": \"A cruise line is offering a so-called, \\\"Cougar Cruise\\\" for women in their forties and fifties and much younger men.\\n\\n###\\n\\n\", \"completion\": \" The cruise will get underway as soon as a man signs up. END\"}\n" +
          "{\"prompt\": \"Scientists now think that Neanderthals lived fast and died young.\\n\\n###\\n\\n\", \"completion\": \" So don't expect season 3 of \\\"Jersey Shore.\\\" END\"}\n" +
          "{\"prompt\": \"Today, Jack-in-the-Box offered 2 free tacos to all their customers who came in after 2 o'clock.\\n\\n###\\n\\n\", \"completion\": \" No one took them up on it. END\"}\n" +
          "{\"prompt\": \"A recent study has found that people with high IQs are more likely to be up late.\\n\\n###\\n\\n\", \"completion\": \" In a related story, TBS is moving us to afternoons at 3pm. END\"}\n" +
          "{\"prompt\": \"Authorities say a 67-year-old man in Wisconsin was so enraged over Bristol Palin's \\\"Dancing with the Stars\\\" routine he blasted his television with a shotgun.\\n\\n###\\n\\n\", \"completion\": \" All I can say is, I'm glad this guy doesn't have TBS. END\"}\n" +
          "{\"prompt\": \"Bristol Palin and \\\"The Jersey Shore's\\\" The Situation are in a new Public Service Announcement promoting abstinence.\\n\\n###\\n\\n\", \"completion\": \" Unfortunately, there's an awkward moment halfway through the PSA when they have sex. END\"}\n" +
          "{\"prompt\": \"President George W. Bush's new memoir came out this week and it has already sold 800,000 copies.\\n\\n###\\n\\n\", \"completion\": \" In a related story, the Bush Presidential Library announced it purchased its first 800,000 books. END\"}\n" +
          "{\"prompt\": \"In Saudi Arabia, officials recently shut down access to Facebook--saying that some of the content had \\\"crossed the line.\\\"\\n\\n###\\n\\n\", \"completion\": \" Apparently, the last straw was a Facebook game called, \\\"Rate the Ankles.\\\" END\"}\n"
      },
      ...messages
    ],
    temperature: 0.7,
    stream: true
  })

  const stream = OpenAIStream(res, {
    async onCompletion(completion) {
      const title = json.messages[0].content.substring(0, 100)
      const userId = session?.user?.id
      if (userId) {
        const id = json.id ?? nanoid()
        const createdAt = Date.now()
        const path = `/chat/${id}`
        const payload = {
          id,
          title,
          userId,
          createdAt,
          path,
          messages: [
            ...messages,
            {
              content: completion,
              role: 'assistant'
            }
          ]
        }
        await kv.hmset(`chat:${id}`, payload)
        await kv.zadd(`user:chat:${userId}`, {
          score: createdAt,
          member: `chat:${id}`
        })
      }
    }
  })

  return new StreamingTextResponse(stream)
}
