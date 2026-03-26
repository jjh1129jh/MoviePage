import "../styles/global.css"
import Navigation from "../jsx/navigation"
import Footer from "../jsx/footer"

export const metadata = {
  title: {
    template: "%s & Next Movies",
    default: "Loading..."
  },
  description: 'JH의 MoviePage 입니다.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <Navigation></Navigation>
        {children}
        <Footer/>
        </body>
    </html>
  )
}
