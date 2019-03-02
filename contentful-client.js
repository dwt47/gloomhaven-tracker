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

	const type = contentType[0].toUpperCase() + contentType.slice(1);

	const stringified = stringify(entry);
	const contentDigest = crypto
		.createHash(`md5`)
		.update(stringified)
		.digest(`hex`);

	let processedFields = flattenItem(fields);
	switch(contentType) {
		case 'scenario':
			processedFields.slug = slugify(processedFields.title.toLowerCase());
			processedFields.path = `scenario/${processedFields.slug}`;
			break;
	}

	return {
		contentType,
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

	function getLinkedEntry(obj) {
		return obj && obj.sys && obj.sys.id && entriesByID[obj.sys.id] || false;
	}

	function tryToResolveLinkedEntry(parent, key) {
		const entry = parent[key];
		const linkedEntry = getLinkedEntry(entry);

		if (!linkedEntry) return;

		// don't actually link the full scenario since there are circular references
		if (linkedEntry.contentType === 'scenario') {
			const {
				id,
				contentType,
				scenarioID,
				title,
				slug,
				path,
			} = linkedEntry;
			parent[key] = { id, contentType, scenarioID, title, slug, path };
		} else {
			parent[key] = linkedEntry;
		}
	}

	// Replace any reference to another entry with the entry object itself
	// Looping through each top-level field of each entry, as well as any array that is a top-level value
	entries.forEach(entry => {
		Object.keys(entry).forEach(key => {
			tryToResolveLinkedEntry(entry, key);

			const val = entry[key];
			if (Array.isArray(val)) {
				val.forEach((obj, index) => {
					tryToResolveLinkedEntry(val, index);
				});
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