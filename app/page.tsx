import { UserButton } from '@clerk/nextjs'

import MainContainer from '@/components/common/mainContainer'
export default function Home() {
  return (
    <MainContainer>
      <div>
        <UserButton />
      </div>
      <h1 className="text-4xl text-center">Home page</h1>
      <form>
        <input name="trackUrl" type="url" />
      </form>
    </MainContainer>
  )
}
