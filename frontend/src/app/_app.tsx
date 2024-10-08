import { ContextProvider } from 'src/contexts/ContextProvider';
import 'src/app/globals.css'; // Your global styles

function MyApp({ Component, pageProps }) {
  return (
    <ContextProvider>
      <Component {...pageProps} />
    </ContextProvider>
  );
}

export default MyApp;
