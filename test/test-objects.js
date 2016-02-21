// Copyright (c) 2015 Rogier Schouten<github@workingcode.ninja>
var chai = require("chai");
var expect = chai.expect;
var objects = require("../lib/objects");
describe("objects", function () {
    describe("shallowEquals()", function () {
        it("should compare basic types", function () {
            expect(objects.shallowEquals(true, false)).to.equal(false);
            expect(objects.shallowEquals(true, true)).to.equal(true);
            expect(objects.shallowEquals(0, false)).to.equal(false);
            expect(objects.shallowEquals(0, 0)).to.equal(true);
            expect(objects.shallowEquals(0, 1)).to.equal(false);
            expect(objects.shallowEquals("A", "B")).to.equal(false);
            expect(objects.shallowEquals("A", "A")).to.equal(true);
        });
        it("should compare null", function () {
            expect(objects.shallowEquals(null, 0)).to.equal(false);
            expect(objects.shallowEquals(null, null)).to.equal(true);
            expect(objects.shallowEquals(null, {})).to.equal(false);
        });
        it("should compare objects", function () {
            expect(objects.shallowEquals({ condensed: true }, { condensed: false })).to.equal(false);
            expect(objects.shallowEquals({ condensed: true }, { condensed: true, b: "a" })).to.equal(false);
            expect(objects.shallowEquals({ condensed: true }, { condensed: true })).to.equal(true);
        });
        it("should compare arrays", function () {
            expect(objects.shallowEquals([1, 2], [2, 3])).to.equal(false);
            expect(objects.shallowEquals([1, 2], [2])).to.equal(false);
            expect(objects.shallowEquals([1, 2], { 1: true, 2: true })).to.equal(false);
            expect(objects.shallowEquals([1, 2], [1, 2])).to.equal(true);
        });
    });
});
//# sourceMappingURL=test-objects.js.map