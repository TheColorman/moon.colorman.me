type EntryMetadata = {
    official: { [key: string]: string },
    download: { [key: string]: string },
    source: { [key: string]: string },
    credit: string,
    cover?: string,
}

export type EntriesMetadata = { [key: number]: EntryMetadata }