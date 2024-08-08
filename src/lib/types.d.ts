type EntryMetadata = {
    official: { [key: string]: string },
    download: { [key: string]: string },
    source: { [key: string]: string },
    external: {
        "myanimelist"?: `https://myanimelist.net/${string}`,
        "anilist"?: `https://anilist.co/${string}`,
				"vndb"?: `https://vndb.org/${string}`,
        "wiki"?: `https://typemoon.fandom.com/wiki/${string}`,
    },
    credit: string,
    cover?: string,
    description?: string,
}

export type EntriesMetadata = { [key: number]: EntryMetadata }