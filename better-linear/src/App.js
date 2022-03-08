import './App.css';
import {ApolloClient, 
        InMemoryCache, 
        ApolloProvider, 
        HttpLink, 
        from,
        useQuery, 
        gql
} from '@apollo/client'

const link = from([
  // errorLink,
  new HttpLink({uri: "http://localhost:5000/graphql"}),
])

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: link 
})

const EXCHANGE_RATES = gql`
  query hello {
    hello
  }
`;

function ExchangeRates() {
  const { loading, error, data } = useQuery(EXCHANGE_RATES);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :</p>;

  return data.hello.map(({hello}) => {
    <div key={hello}>
      <p>
        {hello}
      </p>
    </div>
  });
}

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <div>dasd dasdfsdfse</div>
        <ExchangeRates />
      </div>
    </ApolloProvider>
  );
}

export default App;
