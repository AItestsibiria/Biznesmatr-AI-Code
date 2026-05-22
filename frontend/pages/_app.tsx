import type { AppProps } from 'next/app'
import '../styles/globals.css'
import BizAiChat from '../components/BizAiChat'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <BizAiChat />
    </>
  )
}
