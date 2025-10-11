export function  randomString() {
    return [...Array(5)].map((value) => (Math.random() * 1000000).toString(36).replace('.', '')).join('');
}