import React from "react"
import { graphql, Link } from "gatsby"
import get from 'lodash.get';
import partition from 'lodash.partition';

const EnemyLanding = props => {
  const edges = get(props, 'data.allEnemy.edges', []);

  let [regulars, bosses] = partition(edges, ({node}) => !node.boss);

  return (
    <React.Fragment>
      <h2>All Enemies</h2>
      <ul>
        {regulars.map(({ node }) => (
          <li key={node.id}>
            <Link to={node.path}>{node.title}</Link>
          </li>
        ))}
      </ul>
      <h3>Bosses</h3>
      <ul>
        {bosses.map(({ node }) => (
          <li key={node.id}>
            <Link to={node.path}>{node.title}</Link>
          </li>
        ))}
      </ul>
    </React.Fragment>
  );
};

export default EnemyLanding;

export const query = graphql`
  query AllEnemies {
    allEnemy(sort: {fields: title}) {
      edges {
        node {
          id
          title
          path
          boss
        }
      }
    }
  }
`;
