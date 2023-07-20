import MainContainer from '@/components/common/mainContainer'

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <MainContainer>{children}</MainContainer>
}
