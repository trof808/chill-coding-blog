/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql, Link } from "gatsby"

import "./layout.sass"

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      },
      sitePage {
        path
      }
    }
  `)
  return (
    <>
      <div
        style={{
          margin: `3em auto`,
          maxWidth: 960,
          padding: `0 1.0875rem 1.45rem`,
        }}
      >
        <header>
          <h1 id='logo'>
            <Link to='/'>Chill<span>.Coding</span></Link>
            <p>Blog</p>
          </h1>
          <div>
            <a href="https://t.me/chillcoding"><img src="" alt=""/></a>
            <a href=""></a>
            <a href=""></a>
          </div>
        </header>
        <main>{children}</main>
        <footer
          style={{
            marginTop: `2rem`,
          }}
        >
          © {new Date().getFullYear()},
          {` `}
          <span>chill.coding</span>
        </footer>
      </div>
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
