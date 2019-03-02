import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import Requirement from "../components/requirement";

const Scenario = ({ data }) => {
  const { contentfulEntry: scenario } = data;

  const {
    scenarioID = '',
    title = '',
    goal = '',
    requirements = [],
  } = scenario;

  return (
    <Layout>
      <h2><small>{scenarioID}</small> {title}</h2>
      <p>{goal}</p>
      <h3>Requirements</h3>
      <ul>
        {requirements.map((r,i) => (
          <li key={i}>
            <Requirement id={r.sys.id} />
          </li>
        ))}
      </ul>
    </Layout>
  );
};

export default Scenario;

export const query = graphql`
  query($scenarioID: Int!) {
    contentfulEntry(scenarioID: { eq: $scenarioID }) {
      id
      scenarioID
      title
      goal
      requirements {
        sys {
          id
        }
      }
    }
  }
`;