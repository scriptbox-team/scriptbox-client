import ResourceManager from "core/resource-manager";

test("ResourceManager::Base Behaviour Test", async () => {
    const rm = new ResourceManager<number>();
    const missingMock = jest.fn((str: string) => {});
    rm.onResourceMissing = missingMock;

    // Test when resource is not available
    expect(rm.get("testResource")).toBe(undefined);

    rm.set("testResource", 5);
    const resource = rm.get("testResource");
    expect(resource).toBe(5);

    expect(missingMock.mock.calls.length).toBe(1);
    expect(missingMock.mock.calls[0][0]).toBe("testResource");
});
