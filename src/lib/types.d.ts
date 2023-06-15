type EntryMetadata = {
    official: { [key: string]: string },
    download: { [key: string]: string },
    source: { [key: string]: string },
    external: {
        "myanimelist"?: string,
        "anilist"?: string,
        "wiki"?: string,
    },
    credit: string,
    cover?: string,
    description?: string,
}

export type EntriesMetadata = { [key: number]: EntryMetadata }