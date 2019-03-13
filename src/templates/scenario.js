import React from "react"
import { graphql, Link } from "gatsby"

import ScenarioLink from '../components/scenarioLink';

const Scenario = ({ data }) => {
  const { scenario = {} } = data;

  const {
    scenarioID = '',
    title = '',
    goal = '',
    links = [],
    enemies = [],
    rewards = [],
  } = scenario;

  const unlockedBy = data.unlockedBy && data.unlockedBy.edges && data.unlockedBy.edges.map(({ node }) => node);

  return (
    <React.Fragment>
      <h2><small>{scenarioID}</small> {title}</h2>
      <p>{goal}</p>
      {links && (
        <React.Fragment>
          <h3>Linked Scenarios</h3>
          <ul>
            {links.map(sc => (
              <li key={sc.id}>
                <ScenarioLink scenario={sc} />
              </li>
            ))}
          </ul>
        </React.Fragment>
      )}
      {unlockedBy && (
        <React.Fragment>
          <h3>Unlocked By Scenario{unlockedBy.length && `s`}</h3>
          <ul>
            {unlockedBy.map(sc => (
              <li key={sc.id}>
                <ScenarioLink scenario={sc} />
              </li>
            ))}
          </ul>
        </React.Fragment>
      )}
      {enemies && (
        <React.Fragment>
          <h3>Enemies</h3>
          <ul>
            {enemies.map(enemy => (
              <li key={enemy.id}>
                <Link to={enemy.path}>{enemy.title}</Link>
              </li>
            ))}
          </ul>
        </React.Fragment>
      )}
      {rewards && (
        <React.Fragment>
          <h3>Rewards</h3>
          <ul>
            {rewards.map(reward => (
              <li key={reward.id}>
                {reward.__typename === `Scenario` ?
                  <ScenarioLink scenario={reward} /> :
                  reward.path ? <Link to={reward.path}>{reward.title}</Link> :
                  `${reward.__typename}: ${reward.title}`
                }
              </li>
            ))}
          </ul>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default Scenario;

export const query = graphql`
  query($id: String!) {
    scenario(id: { eq: $id }) {
      id
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
        path
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
          path
        }
        ... on Reward {
          id
          title
          amount
          type
          collectiveOrEach
        }
        ... on Achievement {
          id
          title
        }
      }
      losses {
        __typename
        title
        id
      }
    }
    unlockedBy: allScenario( filter: {
      rewards: {
        elemMatch: {
          id: { eq: $id }
        }
      }
    }) {
      edges {
        node {
          id
          scenarioID
          title
          path
        }
      }
    }
  }
`;
