const { BlockData } = require('..');

describe('block data has correct transparency', () => {
  it('needs tests', () => {
    const error = new BlockData({ blockType: 0 });
    const air = new BlockData({ blockType: 1 });
    const stone = new BlockData({ blockType: 2 });

    expect(error.isTransparent()).toBe(false);
    expect(air.isTransparent()).toBe(true);
    expect(stone.isTransparent()).toBe(false);
  });
});
