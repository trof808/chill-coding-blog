import React from "react"
import { graphql, Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

import classNames from 'classnames/bind';

const IndexPage = ({ data }) => {
  console.log(data);
  return (
    <Layout>
      <SEO title="Главная"/>
      <div>
        {data.allMarkdownRemark.edges.map(({ node }) => {
          const disabled = node.frontmatter.active === 'false';
          return (
            <article key={node.id} className={classNames('article-item')}>
              <Link to={disabled ? '#' : node.fields.slug} className={classNames({ disabled: disabled })}>{node.frontmatter.title}</Link>
              <div id='article-info'>
                <span id='article-date'>{disabled ? '⌛ Ожидает публикации...' : `📅 ${node.frontmatter.date}`}</span>
                <span id='article-tags'>
                {node.frontmatter.tags.map(t => {
                  return (
                    `#${t}`
                  )
                })}
              </span>
              </div>
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
    allMarkdownRemark(sort: {
      fields: [frontmatter___date]
      order: ASC
    }) {
      edges {
        node {
          excerpt
          html
          id
          frontmatter {
            title
            date(formatString: "DD MMMM, YYYY")
            active
            tags
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
