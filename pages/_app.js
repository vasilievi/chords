import { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css'
import '../styles.css'

export default function MyApp({ Component, pageProps }) {
  
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap");
  }, []);

  return <Component {...pageProps} />
}