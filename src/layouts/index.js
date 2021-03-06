/**
 * Layout component that queries for data
 * with Gatsby's StaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/static-query/
 */
import React from "react"
import PropTypes from "prop-types"

import { FirebaseProvider } from '../../services/firebase';
import Header from "../components/header"
import "../css/fonts.css"
import "../css/layout.css"

const Layout = ({ children }) => (
  <FirebaseProvider>
    <Header />
    <main style={{
        margin: `0 auto`,
        maxWidth: 960,
        padding: `1.45rem 1.0875rem`,
        minHeight: `100%`,
    }}>
      {children}
    </main>
    <footer style={{
      margin: `0 auto`,
      maxWidth: 960,
      padding: `0 1.0875rem`,
    }}>
      © {new Date().getFullYear()}, Built with
      {` `}
      <a href="https://www.gatsbyjs.org">Gatsby</a>
    </footer>
  </FirebaseProvider>
);

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
