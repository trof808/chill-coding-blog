import React from "react"
import { graphql, Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

import classNames from 'classnames/bind';

const IndexPage = ({ data }) => {
  return (
    <Layout>
      <SEO title="Главная"/>
      <div>
        {data.allMarkdownRemark.edges.filter(({ node }) => !node.frontmatter.hide).map(({ node }) => {
          const disabled = node.frontmatter.active === 'false';
          return (
            <article key={node.id} className={classNames('article-item')}>
              <Link to={disabled ? '#' : node.fields.slug} className={classNames({ disabled: disabled })}>{node.frontmatter.title}</Link>
              <p id='article-excerpt'>{node.excerpt}</p>
              <div id='article-info'>
                <span id='article-date'>{disabled ? '⌛ Ожидает публикации...' : `📅 ${node.frontmatter.date}`}</span>
                <span id='article-date'>⏱️ {node.timeToRead} min</span>
                <span id='article-date'>{node.frontmatter.ready === 'false' ? `✍ Будет дополняться` : ""}</span>
                <span id='article-tags'>
                {node.frontmatter.tags.map((t, i) => {
                  return (
                    `${i !== 0 ? ', ' : ''}#${t}`
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
      order: DESC
    }) {
      edges {
        node {
          excerpt
          timeToRead
          html
          id
          frontmatter {
            title
            date(formatString: "DD MMMM, YYYY")
            active
            tags
            ready
            hide
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
