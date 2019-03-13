import React from "react"
import { graphql } from "gatsby"

import ScenarioLink from '../components/scenarioLink';

const Enemy = ({ data }) => {
  const { enemy = {}, allScenario = {} } = data;

  const {
    title = '',
    boss = false,
  } = enemy;

  const scenarios = allScenario.edges && allScenario.edges.map(({ node }) => node);

  return (
    <React.Fragment>
      <h2>{title}</h2>
      {boss && <p>BOSS</p>}
      {scenarios && (
        <React.Fragment>
          <h3>Containing Scenarios</h3>
          <ul>
            {scenarios.map((scenario, i) => (
              <li key={i}>
                <ScenarioLink scenario={scenario} />
              </li>
            ))}
          </ul>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default Enemy;

export const query = graphql`
  query($id: String!) {
    enemy(id: { eq: $id }) {
      title
      boss
    }
    allScenario( filter: {
      enemies: {
        elemMatch: {
          id: { eq: $id }
        }
      }
    }, sort: {
      fields: scenarioID
    }) {
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
