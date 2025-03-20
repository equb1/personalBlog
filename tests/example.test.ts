// tests/example.test.ts
test('基本环境测试', () => {
    expect(process.env.NODE_ENV).toBe('test')
    expect(1 + 1).toBe(2)
  })
  