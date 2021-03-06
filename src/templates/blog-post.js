import React from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"


export default function BlogPost({ data }) {
  const post = data.markdownRemark
  return (
    <Layout>
      <SEO title={post.frontmatter.title}/>
      <div className='blog-post'>
        <h1>{post.frontmatter.title}</h1>
        <div className='blog-post__content' dangerouslySetInnerHTML={{ __html: post.html }} />
        <p>
          Надеюсь, статья была полезной!
          <br />
          Пиши в телеге, если будут вопросы <a href="https://t.me/reatrof" target="_blank">@reatrof</a>
        </p>
      </div>
    </Layout>
  )
}

export const query = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
      }
    }
  }
`
