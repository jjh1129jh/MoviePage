import Navigation from "../jsx/navigation"
import "../styles/global.css"

export const metadata = {
  title: {
    template: "%s & Next Movies",
    default: "Next Movies"
  },
  description: 'JH의 MoviePage 입니다.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Navigation></Navigation>
      <body>{children}</body>
    </html>
  )
}
