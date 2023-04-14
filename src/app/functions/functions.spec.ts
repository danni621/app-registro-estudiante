import { TestBed } from '@angular/core/testing';
import { Functions } from './functions';

describe('Functions', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const functions: Functions = TestBed.get(Functions);
        expect(functions).toBeTruthy();
    });
});