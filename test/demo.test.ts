describe("Demo tests description", () => {
  const bearerToken = "";
  test("Test 1 descripion", (done) => {
    const demo = 1;
    expect(bearerToken).toBeDefined();
    expect(demo).toBe(1);
    done();
  });
  test("Test 2 descripion", (done) => {
    const demo = false;
    expect(bearerToken).toBeDefined();
    expect(demo).toBeFalsy();
    done();
  });
});
