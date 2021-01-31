import React from "react"
import { graphql, Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

const IndexPage = ({ data }) => {
  console.log(data);
  return (
    <Layout>
      <SEO title="Home"/>
      <div>
        {data.allMarkdownRemark.edges.map(({ node }) => {
          return (
            <article key={node.id} className='article-item'>
              <Link to={node.fields.slug}>{node.frontmatter.title}</Link>
              <span id='article-date'>{node.frontmatter.date}</span>
            </article>
          )
        })}
      </div>
    </Layout>
  )
}

export default IndexPage

export const query = graphql`
  {
    allMarkdownRemark {
      edges {
        node {
          excerpt
          html
          id
          frontmatter {
            title
            date(formatString: "DD MMMM, YYYY")
          }
          fields {
            slug
          }
          timeToRead
          headings {
            value
          }
        }
      }
    }
  }
`
