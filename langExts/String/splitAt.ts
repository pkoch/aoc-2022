declare global {
  interface String {
    splitAt: (pos: number) => string[];
  }
}

String.prototype.splitAt = function (pos: number): string[] {
  return [
    this.slice(0, pos),
    this.slice(pos, this.length),
  ];
};
