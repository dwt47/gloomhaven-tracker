import React from "react"
import { graphql } from "gatsby"
import get from 'lodash.get';

import Layout from "../components/layout"
import ScenarioLink from '../components/scenarioLink';

const ScenarioLanding = props => {
  const edges = get(props, 'data.allScenario.edges', []);

  return (
    <Layout>
      <h2>Scenarios</h2>
      <ul>
        {edges.map(({ node }, i) => (
          <li key={i}>
            <ScenarioLink scenario={node} />
          </li>
        ))}
      </ul>
    </Layout>
  );
};

export default ScenarioLanding;

export const query = graphql`
  query AllScenarios {
    allScenario(sort: {fields: scenarioID}) {
      edges {
        node {
          scenarioID
          title
          path
        }
      }
    }
  }
`;
