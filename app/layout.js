/* eslint-disable @next/next/no-page-custom-font */
import './styles/App.css'
import './styles/index.css'

export const metadata = {
  title: 'Turnt — IRL Hangouts & Good Vibes',
  description: 'Turnt is a Chennai Gen-Z hangout community where we actually meet IRL, make friends, and do the fun stuff we\'ve all been postponing forever.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.cdnfonts.com/css/vilanders-sans" rel="stylesheet" />
        <link href="https://fonts.cdnfonts.com/css/ditty" rel="stylesheet" />
        <link href="https://fonts.cdnfonts.com/css/jorgey" rel="stylesheet" />
        <link href="https://fonts.cdnfonts.com/css/metultah" rel="stylesheet" />
        <link href="https://fonts.cdnfonts.com/css/barlow-condensed" rel="stylesheet" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,700&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
