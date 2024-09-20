export type EntryNote =
	| 'format'
	| 'missing-material'
	| 'translation-none'
	| 'translation-partly'
	| 'unofficial';

export type EntryData = {
	id: number;
	title: string;
	released: string;
	ended: string;
	medium: string;
	notes?: EntryNote[];
};

export type EntryMetadata = {
	official: { [key: string]: string };
	download: { [key: string]: string };
	source: { [key: string]: string };
	external: {
		myanimelist?: `https://myanimelist.net/${string}`;
		anilist?: `https://anilist.co/${string}`;
		vndb?: `https://vndb.org/${string}`;
		wiki?: `https://typemoon.fandom.com/wiki/${string}`;
	};
	credit: string;
	cover?: string;
	description?: string;
};

export type EntriesMetadata = { [key: number]: EntryMetadata };

export type SortKey = 'id' | 'completed' | 'title' | 'released' | 'ended' | 'medium';
