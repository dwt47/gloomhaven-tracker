import React from "react"
import { graphql, Link } from "gatsby"

import Layout from "../components/layout"
// import Requirement from "../components/requirement";

const Scenario = ({ data }) => {
  const { scenario } = data;

  const {
    scenarioID = '',
    title = '',
    goal = '',
    links = [],
  } = scenario;

  return (
    <Layout>
      <h2><small>{scenarioID}</small> {title}</h2>
      <p>{goal}</p>
      {links && (
        <React.Fragment>
          <h3>Linked Scenarios</h3>
          <ul>
            {links.map((link, i) => (
              <li key={i}>
                <Link to={link.path}>{link.title}</Link>
              </li>
            ))}
          </ul>
        </React.Fragment>
      )}
    </Layout>
  );
};

export default Scenario;

export const query = graphql`
  query($scenarioID: Int!) {
    scenario(scenarioID: { eq: $scenarioID }) {
      scenarioID
      slug
      title
      location
      goal
      treasure
      enemies {
        id
        title
        boss
      }
      links {
        id
        scenarioID
        title
        slug
        path
      }
      requirements {
        id
        title
        complete
        achievement {
          id
          title
          contentType
        }
      }
      rewards {
        title
        contentType
        id
        amount
        type
        collectiveOrEach
        scenarioID
        slug
      }
      losses {
        contentType
        title
        id
      }
    }
  }
`;
