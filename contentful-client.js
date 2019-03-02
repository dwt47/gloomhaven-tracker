const contentful = require('contentful');
const stringify = require('json-stringify-safe');
const crypto = require('crypto');

const CONTENTFUL_SPACE_ID = `tewb8am1kr71`;

const client = contentful.createClient({
	space: CONTENTFUL_SPACE_ID,
	accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

const CONTENT_TYPES_TO_SAVE = [
	'characterClass',
	'scenario',
	'enemy',
	'reward',
	'globalAchievement',
	'partyAchievement',
	'achievementRequirement',
	'misc',
];

function flattenItem(item, debug = false) {
	if (typeof item !== 'object') return;

	Object.keys(item).forEach(k => {

		if (typeof item[k] !== 'object' || item[k] === null) return;

		const keys = Object.keys(item[k]);

		if (
			keys.length === 1
			&& (keys[0] === 'en_US'
			|| keys[0] === 'en-US')
		) {
			item[k] = item[k]['en_US'] || item[k]['en-US'];
		}

		flattenItem(item[k]);
	})

	return item;
}


async function getAllEntryNodes() {
	try {
		const data = await client.sync({
			initial: true,
			resolveLinks: false
		});

		const { entries } = data;

		const keptEntries = entries.filter(
			entry => CONTENT_TYPES_TO_SAVE.includes(entry.sys.contentType.sys.id)
		);

		return keptEntries.map(entry => {
			const { sys, fields } = entry;
			const contentType = sys.contentType.sys.id;
			const contentfulID = sys.id;

			if (fields.id) {
				fields[`${contentType}ID`] = fields.id;
				delete fields.id;
			}

			const type = contentType[0].toUpperCase() + contentType.slice(1);

			const stringified = stringify(entry);
			const contentDigest = crypto
				.createHash(`md5`)
				.update(stringified)
				.digest(`hex`);

			return {
				contentType,
				...flattenItem(fields),
				id: contentfulID,
				parent: null,
				children: [],
				internal: {
					type: `ContentfulEntry`,
					contentDigest,
				},
			};
		});
	} catch (e) {
		console.error('No scenarios could be fetched from Contentful:', e);
		return [];
	}
}

module.exports = {
	client,
	getAllEntryNodes,
};