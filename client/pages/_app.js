import "../styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
const queryClient = new QueryClient();
function MyApp({ Component, pageProps }) {
  return (
    <>
      <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
       <ReactQueryDevtools  />
     </QueryClientProvider>
    </>
     
  );
}

export default MyApp;
