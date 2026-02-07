export function getTagNames(tags: {id: string, name: string }[]): string {
    return tags.map(tag => tag.name).join(', ');
}