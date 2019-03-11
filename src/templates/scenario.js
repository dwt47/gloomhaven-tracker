import React from "react"
import { graphql } from "gatsby"

import ScenarioLink from '../components/scenarioLink';

const Scenario = ({ data }) => {
  const { scenario = {} } = data;

  const {
    scenarioID = '',
    title = '',
    goal = '',
    links = [],
  } = scenario;

  return (
    <>
      <h2><small>{scenarioID}</small> {title}</h2>
      <p>{goal}</p>
      {links && (
        <React.Fragment>
          <h3>Linked Scenarios</h3>
          <ul>
            {links.map((link, i) => (
              <li key={i}>
                <ScenarioLink scenario={link} />
              </li>
            ))}
          </ul>
        </React.Fragment>
      )}
    </>
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
        __typename
        ... on AchievementRequirement {
          id
          title
          complete
          achievement {
            title
            achievementType
          }
        }
      }
      rewards {
        __typename
        ... on Scenario {
          title
          id
          scenarioID
          slug
        }
        ... on Reward {
          amount
          type
          collectiveOrEach
        }
      }
      losses {
        __typename
        title
        id
      }
    }
  }
`;
