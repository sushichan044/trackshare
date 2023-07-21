import TopPage from '@/app/components/topPage'
import MainContainer from '@/components/common/mainContainer'
export default async function Home() {
  return (
    <MainContainer>
      <h1 className="text-4xl text-center">Share Track</h1>
      <TopPage />
    </MainContainer>
  )
}
