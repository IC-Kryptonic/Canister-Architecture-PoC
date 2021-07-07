function trimString(input: string, length: number) {
  if (input.length > length) {
    const halfLength = length / 2;
    input =
      input.substring(0, halfLength) +
      '...' +
      input.substring(input.length - halfLength, input.length - 1);
  }
  return input;
}

export { trimString };
