// Copyright (c) 2015 Rogier Schouten<github@workingcode.ninja>
/// <reference path="../typings/test.d.ts"/>
var assert = require("assert");
var chai = require("chai");
var expect = chai.expect;
var tsevents = require("../index");
describe("index", function () {
    var eq;
    beforeEach(function () {
        tsevents.EventQueue.resetGlobal();
        eq = tsevents.EventQueue.global();
    });
    describe("queue()", function () {
        it("should return the global event queue", function () {
            expect(tsevents.queue()).to.equal(tsevents.EventQueue.global());
        });
    });
    describe("flushOnce()", function () {
        it("should call a handler", function () {
            var callCount = 0;
            eq.add(function () {
                callCount++;
            });
            tsevents.flushOnce();
            expect(callCount).to.equal(1);
        });
        it("should not call a handler twice", function () {
            var callCount = 0;
            eq.add(function () {
                callCount++;
            });
            tsevents.flushOnce();
            tsevents.flushOnce();
            expect(callCount).to.equal(1);
        });
        it("should not call a recursively inserted handler", function () {
            var callCount = 0;
            eq.add(function () {
                eq.add(function () {
                    callCount++;
                });
            });
            tsevents.flushOnce();
            expect(callCount).to.equal(0);
            tsevents.flushOnce();
            expect(callCount).to.equal(1);
        });
    });
    describe("flush()", function () {
        it("should call a handler", function () {
            var callCount = 0;
            eq.add(function () {
                callCount++;
            });
            tsevents.flush();
            expect(callCount).to.equal(1);
        });
        it("should not call a handler twice", function () {
            var callCount = 0;
            eq.add(function () {
                callCount++;
            });
            tsevents.flush();
            tsevents.flush();
            expect(callCount).to.equal(1);
        });
        it("should call a recursively inserted handler", function () {
            var callCount = 0;
            eq.add(function () {
                eq.add(function () {
                    callCount++;
                });
            });
            tsevents.flush();
            expect(callCount).to.equal(1);
        });
        it("should throw for endless loop after 10 times by default", function () {
            var callCount = 0;
            var f = function () {
                callCount++;
                eq.add(f);
            };
            eq.add(f);
            assert.throws(function () {
                tsevents.flush();
            });
            expect(callCount).to.equal(10);
        });
        it("should throw for endless loop after given # times", function () {
            var callCount = 0;
            var f = function () {
                callCount++;
                eq.add(f);
            };
            eq.add(f);
            assert.throws(function () {
                tsevents.flush(5);
            });
            expect(callCount).to.equal(5);
        });
        it("should function after throwing", function () {
            var callCount = 0;
            var f = function () {
                callCount++;
                eq.add(f);
            };
            eq.add(f);
            assert.throws(function () {
                tsevents.flush(5);
            });
            callCount = 0;
            eq.add(function () {
                callCount++;
            });
            eq.flush();
            expect(callCount).to.equal(1);
        });
        it("should not throw for endless loop when set to null", function () {
            var callCount = 0;
            var f = function () {
                callCount++;
                if (callCount < 100) {
                    eq.add(f);
                }
            };
            eq.add(f);
            assert.doesNotThrow(function () {
                tsevents.flush(null);
            });
            expect(callCount).to.equal(100);
        });
    });
});
//# sourceMappingURL=test-index.js.map