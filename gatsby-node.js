/**
* Implement Gatsby's Node APIs in this file.
*
* See: https://www.gatsbyjs.org/docs/node-apis/
*/

const path = require('path');
const { createFilePath } = require('gatsby-source-filesystem');
const slugify = require('slugify');
const stringify = require('json-stringify-safe');

const { getAllEntryNodes } = require('./contentful-client');

exports.onCreateNode = ({ node }) => {
	console.log(node.internal.type)
	if (node.internal.type === 'Scenario' && node.requirements) {
		console.log(node.requirements);
	}
}

exports.sourceNodes = async ({ actions: { createNode } }) => {
	const nodes = await getAllEntryNodes();

	nodes.forEach((n,i) => {
		try {
			createNode(n);
		} catch (e) {
			console.log(`Couldn't create node ${i} because ${e}.`, n);
		}
	});
}

exports.createPages = ({ graphql, actions }) => {
	const { createPage } = actions;
	return graphql(`{
		allScenario {
			edges {
				node {
					path
					scenarioID
				}
			}
		}
	}`).then(result => {
		result.data.allScenario.edges.forEach(({ node }) => {
			createPage({
				path: node.path,
				component: path.resolve(`./src/templates/scenario.js`),
				context: {
					// Data passed to context is available
					// in page queries as GraphQL variables.
					scenarioID: node.scenarioID,
				},
			});
		})
	});
}