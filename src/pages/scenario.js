import React from "react"
import { graphql } from "gatsby"
import get from 'lodash.get';

import ScenarioLink from '../components/scenarioLink';

const ScenarioLanding = props => {
  const edges = get(props, 'data.allScenario.edges', []);

  return (
    <>
      <h2>Scenarios</h2>
      <ul>
        {edges.map(({ node }, i) => (
          <li key={i}>
            <ScenarioLink scenario={node} />
          </li>
        ))}
      </ul>
    </>
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
