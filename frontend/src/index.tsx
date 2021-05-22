import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ApolloClient, InMemoryCache, HttpLink, ApolloLink, from } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { setContext } from "@apollo/client/link/context";
import { BrowserRouter } from "react-router-dom";
import omitDeep from "./omitDeep";

const graphqlUri = process.env.NODE_ENV === "production"
  ? "/query"
  : "http://localhost:5000/query";

const httpLink = new HttpLink({ uri: graphqlUri });

const cleanTypenameLink = new ApolloLink((operation, forward) => {
  if (operation.variables && !operation.variables.file) {
    operation.variables = omitDeep(operation.variables, "__typename");
  }
  return forward(operation);
});

const authLink = setContext((_, { headers }) => {
  const userString = localStorage.getItem("packlister-user");
  if (userString) {
    const user = JSON.parse(userString);
    return {
      headers: {
        ...headers,
        authorization: user.token ? `bearer ${user.token}` : null,
      },
    };
  }
  return {
    headers
  };
});

const client = new ApolloClient({
  link: from([
    cleanTypenameLink,
    authLink,
    httpLink,
  ]),
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
