import './App.css';
import {ApolloClient, 
        InMemoryCache, 
        ApolloProvider, 
        HttpLink, 
        from,
} from '@apollo/client'

const link = from([
  errorLink,
  new HttpLink({uri: "http://localhost:5000/graphql"}),
])

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: link 
})

function App() {
  return (
    <div className="App">
      <div>dasd dasdfsdfse</div>
    </div>
  );
}

export default App;
