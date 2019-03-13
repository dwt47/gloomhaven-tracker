import React from "react"
import { Link } from "gatsby"

import {AstronautImage} from "../components/image"
import SEO from "../components/seo"
import { useUser } from '../../services/firebase';

const IndexPage = () => {
  const user = useUser();

  console.log(user);

  return (
    <>
      <SEO title="Home" keywords={[`gatsby`, `application`, `react`]} />
      <h1>Hi {user.displayName || `People`}</h1>
      <p>Welcome to your new Gatsby site.</p>
      <p>Now go build something great.</p>
      <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
        <AstronautImage />
      </div>
      <Link to="/scenario">See All Scenarios</Link>
    </>
  );
}

export default IndexPage
