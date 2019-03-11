import { Link, StaticQuery, graphql } from "gatsby"
import React from "react"
import Img from 'gatsby-image'

const GloomhavenLogo = (props) => (
  <StaticQuery
    query={graphql`
      query {
        placeholderImage: file(relativePath: { eq: "gloomhaven-logo.png" }) {
          childImageSharp {
            fluid(maxWidth: 300) {
              ...GatsbyImageSharpFluid_noBase64
            }
          }
        }
      }
    `}
    render={data => (
      <Img
        fluid={data.placeholderImage.childImageSharp.fluid}
        {...props}
      />
    )}
  />
);

const Header = () => (
  <header
    style={{
      background: `#9972338a`,
    }}
  >
    <div
      style={{
        margin: `0 auto`,
        maxWidth: 960,
        padding: `.8rem .5rem`,
      }}
    >
      <h1 style={{ margin: 0 }}>
        <Link
          to="/"
          style={{
            color: `#4c2812`,
            textDecoration: `none`,
            display: `flex`,
            alignItems: `center`,
          }}
        >
          <GloomhavenLogo
            fadeIn={false}
            style={{
              maxWidth: `240px`,
              minWidth: `100px`,
              width: `50%`,
              marginRight: `10px`,
            }}
            alt="Gloomhaven"
          />
          <span>Tracker</span>
        </Link>
      </h1>
    </div>
  </header>
)

export default Header
