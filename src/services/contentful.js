const contentful = require('contentful');
const stringify = require('json-stringify-safe');
const slugify = require('slugify');
const crypto = require('crypto');

const CONTENTFUL_SPACE_ID = `tewb8am1kr71`;

const client = contentful.createClient({
	space: CONTENTFUL_SPACE_ID,
	accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

function flattenItem(item) {
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

function processEntry(entry) {
	const { sys, fields } = entry;
	const contentType = sys.contentType.sys.id;
	const contentfulID = sys.id;

	if (fields.id) {
		fields[`${contentType}ID`] = fields.id;
		delete fields.id;
	}

	let type = contentType[0].toUpperCase() + contentType.slice(1);

	const stringified = stringify(entry);
	const contentDigest = crypto
		.createHash(`md5`)
		.update(stringified)
		.digest(`hex`);

	let processedFields = flattenItem(fields);
	switch(contentType) {
		case 'globalAchievement':
			processedFields.achievementType = 'global';
			type = 'Achievement';
			break;
		case 'partyAchievement':
			processedFields.achievementType = 'party';
			type = 'Achievement';
			break;
		case 'scenario':
			processedFields.slug = slugify(processedFields.title.toLowerCase());
			processedFields.path = `/scenario/${processedFields.slug}`;
			processedFields.title = processedFields.title.replace(/^\d+ /, '');
			break;
	}

	return {
		...processedFields,
		id: contentfulID,
		parent: null,
		children: [],
		internal: {
			type,
			contentDigest,
		},
	};
}

function resolveLinksBetweenEntries(entries) {
	let entriesByID = {};
	entries.forEach(entry => {
		entriesByID[entry.id] = entry;
	});

	function getLinkedEntryID(obj) {
		return (
			obj && obj.sys && obj.sys.id && entriesByID[obj.sys.id]
		) ? obj.sys.id : false;
	}

	// Create links between linked entries
	// see https://www.gatsbyjs.org/docs/creating-a-source-plugin/#creating-the-relationship
	entries.forEach(entry => {
		Object.keys(entry).forEach(key => {
			const value = entry[key];

			if (Array.isArray(value)) {
				const linkedIDs = value.map(getLinkedEntryID);

				if (linkedIDs.every(id => !!id)) {
					delete entry[key];
					entry[`${key}___NODE`] = linkedIDs;
				}
			} else {
				const id = getLinkedEntryID(value);
				if (id) {
					delete entry[key]
					entry[`${key}___NODE`] = id;
				}
			}
		})
	});
}

function processEntries(entries) {
	entries = entries.map(processEntry);

	resolveLinksBetweenEntries(entries);

	return entries;
}


async function getAllEntryNodes() {
	let entries;
	try {
		const data = await client.sync({
			initial: true,
			resolveLinks: false
		});

		entries = data.entries;
	} catch (e) {
		console.error('No content could be fetched from Contentful:', e);
		entries = [];
	}

	return processEntries(entries);
}

module.exports = {
	client,
	getAllEntryNodes,
};