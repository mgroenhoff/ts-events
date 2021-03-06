// Copyright © 2015 Rogier Schouten<github@workingcode.ninja>

import assert = require('assert');
import {expect} from 'chai';

import * as tsevents from '../lib/index';

describe('index', (): void => {

    let eq: tsevents.EventQueue;

    beforeEach((): void => {
        tsevents.EventQueue.resetGlobal();
        eq = tsevents.EventQueue.global();
    });

    describe('queue()', (): void => {
        it('should return the global event queue', (): void => {
            expect(tsevents.queue()).to.equal(tsevents.EventQueue.global());
        });
    });

    describe('flushOnce()', (): void => {
        it('should call a handler', (): void => {
            let callCount = 0;
            eq.add((): void => {
                callCount++;
            });
            tsevents.flushOnce();
            expect(callCount).to.equal(1);
        });
        it('should not call a handler twice', (): void => {
            let callCount = 0;
            eq.add((): void => {
                callCount++;
            });
            tsevents.flushOnce();
            tsevents.flushOnce();
            expect(callCount).to.equal(1);
        });
        it('should not call a recursively inserted handler', (): void => {
            let callCount = 0;
            eq.add((): void => {
                eq.add((): void => {
                    callCount++;
                });
            });
            tsevents.flushOnce();
            expect(callCount).to.equal(0);
            tsevents.flushOnce();
            expect(callCount).to.equal(1);
        });
    });

    describe('flush()', (): void => {
        it('should call a handler', (): void => {
            let callCount = 0;
            eq.add((): void => {
                callCount++;
            });
            tsevents.flush();
            expect(callCount).to.equal(1);
        });
        it('should not call a handler twice', (): void => {
            let callCount = 0;
            eq.add((): void => {
                callCount++;
            });
            tsevents.flush();
            tsevents.flush();
            expect(callCount).to.equal(1);
        });
        it('should call a recursively inserted handler', (): void => {
            let callCount = 0;
            eq.add((): void => {
                eq.add((): void => {
                    callCount++;
                });
            });
            tsevents.flush();
            expect(callCount).to.equal(1);
        });
        it('should throw for endless loop after 10 times by default', (): void => {
            let callCount = 0;
            const f = (): void => {
                callCount++;
                eq.add(f);
            };
            eq.add(f);
            assert.throws((): void => {
                tsevents.flush();
            });
            expect(callCount).to.equal(10);
        });
        it('should throw for endless loop after given # times', (): void => {
            let callCount = 0;
            const f = (): void => {
                callCount++;
                eq.add(f);
            };
            eq.add(f);
            assert.throws((): void => {
                tsevents.flush(5);
            });
            expect(callCount).to.equal(5);
        });
        it('should function after throwing', (): void => {
            let callCount = 0;
            const f = (): void => {
                callCount++;
                eq.add(f);
            };
            eq.add(f);
            assert.throws((): void => {
                tsevents.flush(5);
            });

            callCount = 0;
            eq.add((): void => {
                callCount++;
            });
            eq.flush();
            expect(callCount).to.equal(1);
        });
        it('should not throw for endless loop when set to null', (): void => {
            let callCount = 0;
            const f = (): void => {
                callCount++;
                if (callCount < 100) {
                    eq.add(f);
                }
            };
            eq.add(f);
            assert.doesNotThrow((): void => {
                tsevents.flush(null);
            });
            expect(callCount).to.equal(100);
        });
    });
});
