export function randomHexGenerator(length) {
    const byteLength = length * 2
    let result = '';
    const characters = '0123456789abcdef';
    for (let i = 0; i < byteLength; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}