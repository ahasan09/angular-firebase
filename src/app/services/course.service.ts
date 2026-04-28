import { Injectable, inject } from '@angular/core';
import { Database, ref, listVal, push, update, remove } from '@angular/fire/database';
import { Observable, map } from 'rxjs';
import { Course } from '../models/course.model';

@Injectable({ providedIn: 'root' })
export class CourseService {
  private db = inject(Database);

  getCourses(): Observable<Course[]> {
    const coursesRef = ref(this.db, 'courses');
    return listVal<Course>(coursesRef, { keyField: 'key' }).pipe(
      map(courses => courses ?? [])
    );
  }

  addCourse(text: string): Promise<void> {
    const coursesRef = ref(this.db, 'courses');
    return push(coursesRef, { text }).then(() => undefined);
  }

  updateCourse(key: string, text: string): Promise<void> {
    const courseRef = ref(this.db, `courses/${key}`);
    return update(courseRef, { text });
  }

  deleteCourse(key: string): Promise<void> {
    const courseRef = ref(this.db, `courses/${key}`);
    return remove(courseRef);
  }

  deleteAll(): Promise<void> {
    const coursesRef = ref(this.db, 'courses');
    return remove(coursesRef);
  }
}
