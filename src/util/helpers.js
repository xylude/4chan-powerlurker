export function chunkArray(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
        const chunk = array.slice(i, i + size);
        chunks.push(chunk);
    }
    return chunks;
}