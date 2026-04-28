import { TestBed } from '@angular/core/testing';
import { CourseService } from './course.service';
import { Database } from '@angular/fire/database';

const mockDb = {};

describe('CourseService', () => {
  let service: CourseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CourseService, { provide: Database, useValue: mockDb }],
    });
    service = TestBed.inject(CourseService);
  });

  it('is created', () => {
    expect(service).toBeTruthy();
  });
});
