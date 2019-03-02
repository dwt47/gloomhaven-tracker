import React from 'react';
import { graphql, StaticQuery } from 'gatsby';

const RequirementQuery = id => graphql`
	query RequirementQuery {
		contentfulEntry(id: {eq: "${id}"}) {
			contentType
		}
	}
`;

const AchievementRequirementQuery = id => graphql`
	query AchievementRequirementQuery {
		contentfulEntry(id: {eq: "${id}"}) {
			title
			complete
			achievement {
				sys {
					id
				}
			}
		}
	}
`;

// const AchievementRequirement = ({ id }) => (
// 	<StaticQuery
// 		query={AchievementRequirementQuery(id)}
// 		render={props => {
// 			const { title, complete } = props.contentfulEntry;
// 			return <span>{title}</span>;
// 		}}
// 	/>
// );

const REQUIREMENT_MAP = {
	'achievementRequirement': AchievementRequirement,
};
export default () => {};
// export default ({ id }) => (
// 	<StaticQuery
// 		query={RequirementQuery(id)}
// 		render={props => {
// 			const Component = REQUIREMENT_MAP[props.contentfulEntry.contentType];
// 			return <Component id={id} />
// 		}}
// 	/>
// );