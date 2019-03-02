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

exports.sourceNodes = async ({ actions: { createNode } }) => {
	const nodes = await getAllEntryNodes();
	nodes.forEach(n => createNode(n));
}

exports.createPages = ({ graphql, actions }) => {
	const { createPage } = actions;
	return graphql(`{
		allContentfulEntry(filter: {contentType: {eq: "scenario"}}) {
			edges {
				node {
					scenarioID
					title
				}
			}
		}
	}`).then(result => {
		result.data.allContentfulEntry.edges.forEach(({ node }) => {
			createPage({
				path: slugify(node.title.toLowerCase()),
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