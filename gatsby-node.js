/**
* Implement Gatsby's Node APIs in this file.
*
* See: https://www.gatsbyjs.org/docs/node-apis/
*/

const path = require('path');
const { createFilePath } = require('gatsby-source-filesystem');
const slugify = require('slugify');
const stringify = require('json-stringify-safe');

const { getAllEntryNodes } = require('./services/contentful');

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
	function makePages(type) {
		const uc = type[0].toUpperCase() + type.slice(1);
		const allName = `all${uc}`;
		return graphql(`{
			${allName} {
				edges {
					node {
						id
						path
					}
				}
			}
		}`).then(result => {
			result.data[allName].edges.forEach(({ node }) => {
				createPage({
					path: node.path,
					component: path.resolve(`./src/templates/${type}.js`),
					context: { id: node.id },
				});
			});
		});
	}

	return Promise.all([
		`scenario`,
		`enemy`,
	].map(makePages));
}