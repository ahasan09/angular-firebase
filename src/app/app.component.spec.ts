import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { User } from '@angular/fire/auth';
import { AppComponent } from './app.component';
import { AuthService } from './services/auth.service';
import { CourseService } from './services/course.service';
import { Course } from './models/course.model';

const MOCK_USER = { uid: 'u1', email: 'test@example.com' } as User;
const MOCK_COURSES: Course[] = [
  { key: 'k1', text: 'Angular Basics' },
  { key: 'k2', text: 'Firebase Intro' },
];

function makeAuthService(user: User | null = MOCK_USER) {
  return {
    currentUser$: of(user),
    signIn: jest.fn().mockResolvedValue(undefined),
    register: jest.fn().mockResolvedValue(undefined),
    signOut: jest.fn().mockResolvedValue(undefined),
  };
}

function makeCourseService(courses: Course[] = MOCK_COURSES) {
  return {
    getCourses: jest.fn().mockReturnValue(of(courses)),
    addCourse: jest.fn().mockResolvedValue(undefined),
    updateCourse: jest.fn().mockResolvedValue(undefined),
    deleteCourse: jest.fn().mockResolvedValue(undefined),
    deleteAll: jest.fn().mockResolvedValue(undefined),
  };
}

async function setup(
  user: User | null = MOCK_USER,
  courses: Course[] = MOCK_COURSES
): Promise<{ fixture: ComponentFixture<AppComponent>; component: AppComponent; courseService: ReturnType<typeof makeCourseService> }> {
  const authService = makeAuthService(user);
  const courseService = makeCourseService(courses);

  await TestBed.configureTestingModule({
    imports: [AppComponent],
    providers: [
      { provide: AuthService, useValue: authService },
      { provide: CourseService, useValue: courseService },
    ],
  }).compileComponents();

  const fixture = TestBed.createComponent(AppComponent);
  const component = fixture.componentInstance;
  fixture.detectChanges();
  return { fixture, component, courseService };
}

describe('AppComponent', () => {
  describe('when not authenticated', () => {
    it('shows the login form', async () => {
      const { fixture } = await setup(null, []);
      const el: HTMLElement = fixture.nativeElement;
      expect(el.querySelector('.auth-card')).toBeTruthy();
      expect(el.querySelector('.main-content')).toBeNull();
    });

    it('toggles to registration mode', async () => {
      const { fixture, component } = await setup(null, []);
      component.isRegistering.set(true);
      fixture.detectChanges();
      const el: HTMLElement = fixture.nativeElement;
      expect(el.textContent).toContain('Create Account');
    });

    it('calls signIn with entered credentials', async () => {
      const authService = makeAuthService(null);
      const courseService = makeCourseService([]);
      await TestBed.configureTestingModule({
        imports: [AppComponent],
        providers: [
          { provide: AuthService, useValue: authService },
          { provide: CourseService, useValue: courseService },
        ],
      }).compileComponents();
      const fixture = TestBed.createComponent(AppComponent);
      const component = fixture.componentInstance;
      fixture.detectChanges();

      component.email = 'a@b.com';
      component.password = 'secret';
      await component.signIn();

      expect(authService.signIn).toHaveBeenCalledWith('a@b.com', 'secret');
    });

    it('sets authError on signIn failure', async () => {
      const authService = makeAuthService(null);
      authService.signIn.mockRejectedValue({ code: 'auth/invalid-credential' });
      const courseService = makeCourseService([]);
      await TestBed.configureTestingModule({
        imports: [AppComponent],
        providers: [
          { provide: AuthService, useValue: authService },
          { provide: CourseService, useValue: courseService },
        ],
      }).compileComponents();
      const fixture = TestBed.createComponent(AppComponent);
      const component = fixture.componentInstance;
      fixture.detectChanges();

      await component.signIn();
      expect(component.authError()).toBe('Invalid email or password.');
    });
  });

  describe('when authenticated', () => {
    it('shows the main content', async () => {
      const { fixture } = await setup();
      const el: HTMLElement = fixture.nativeElement;
      expect(el.querySelector('.main-content')).toBeTruthy();
      expect(el.querySelector('.auth-card')).toBeNull();
    });

    it('displays the current user email', async () => {
      const { fixture } = await setup();
      const el: HTMLElement = fixture.nativeElement;
      expect(el.textContent).toContain('test@example.com');
    });

    it('loads and renders courses', async () => {
      const { fixture } = await setup();
      const items = fixture.nativeElement.querySelectorAll('.course-item');
      expect(items.length).toBe(2);
    });

    it('shows empty state when no courses', async () => {
      const { fixture } = await setup(MOCK_USER, []);
      const el: HTMLElement = fixture.nativeElement;
      expect(el.querySelector('.empty-state')).toBeTruthy();
    });

    it('signs out via AuthService', async () => {
      const authService = makeAuthService();
      const courseService = makeCourseService();
      await TestBed.configureTestingModule({
        imports: [AppComponent],
        providers: [
          { provide: AuthService, useValue: authService },
          { provide: CourseService, useValue: courseService },
        ],
      }).compileComponents();
      const fixture = TestBed.createComponent(AppComponent);
      const component = fixture.componentInstance;
      fixture.detectChanges();

      await component.signOut();
      expect(authService.signOut).toHaveBeenCalled();
    });
  });

  describe('CRUD operations', () => {
    it('addCourse optimistically updates UI then calls service', async () => {
      const { component, courseService } = await setup();
      component.newCourseText = 'New Course';

      const addPromise = component.addCourse();
      expect(component.courses().some(c => c.text === 'New Course')).toBe(true);
      expect(component.newCourseText).toBe('');

      await addPromise;
      expect(courseService.addCourse).toHaveBeenCalledWith('New Course');
    });

    it('addCourse ignores empty input', async () => {
      const { component, courseService } = await setup();
      component.newCourseText = '   ';
      await component.addCourse();
      expect(courseService.addCourse).not.toHaveBeenCalled();
    });

    it('addCourse rolls back on failure', async () => {
      const { component, courseService } = await setup(MOCK_USER, []);
      courseService.addCourse.mockRejectedValue(new Error('network'));
      component.newCourseText = 'Bad Course';

      await component.addCourse().catch(() => undefined);

      expect(component.courses().some(c => c.text === 'Bad Course')).toBe(false);
      expect(component.newCourseText).toBe('Bad Course');
    });

    it('deleteCourse removes course optimistically', async () => {
      const { component, courseService } = await setup();
      const initialCount = component.courses().length;

      const deletePromise = component.deleteCourse('k1');
      expect(component.courses().length).toBe(initialCount - 1);

      await deletePromise;
      expect(courseService.deleteCourse).toHaveBeenCalledWith('k1');
    });

    it('deleteCourse restores course on failure', async () => {
      const { component, courseService } = await setup();
      courseService.deleteCourse.mockRejectedValue(new Error('fail'));
      const before = component.courses().length;

      await component.deleteCourse('k1').catch(() => undefined);

      expect(component.courses().length).toBe(before);
    });

    it('updateCourse calls service with trimmed text', async () => {
      const { component, courseService } = await setup();
      await component.updateCourse('k1', '  Updated  ');
      expect(courseService.updateCourse).toHaveBeenCalledWith('k1', 'Updated');
    });

    it('updateCourse skips empty text', async () => {
      const { component, courseService } = await setup();
      await component.updateCourse('k1', '   ');
      expect(courseService.updateCourse).not.toHaveBeenCalled();
    });

    it('deleteAll clears courses optimistically', async () => {
      const { component, courseService } = await setup();
      const deleteAllPromise = component.deleteAll();
      expect(component.courses().length).toBe(0);

      await deleteAllPromise;
      expect(courseService.deleteAll).toHaveBeenCalled();
    });

    it('deleteAll restores courses on failure', async () => {
      const { component, courseService } = await setup();
      courseService.deleteAll.mockRejectedValue(new Error('fail'));
      const before = component.courses().length;

      await component.deleteAll().catch(() => undefined);

      expect(component.courses().length).toBe(before);
    });
  });
});
