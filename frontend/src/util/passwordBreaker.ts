export const generateRandomLetter = () => {
    const letters = "abcdefghijklmnopqrstuvwxyz";
    return letters[Math.floor(Math.random() * letters.length)];
}

export const generateRandomLetters = (length: number) => {
    let result = "";
    for (let i = 0; i < length; i++) {
        result += generateRandomLetter();
    }
    return result;
}