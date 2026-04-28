import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { User } from '@angular/fire/auth';
import { AuthService } from './services/auth.service';
import { CourseService } from './services/course.service';
import { Course } from './models/course.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  private authService = inject(AuthService);
  private courseService = inject(CourseService);
  private destroyRef = inject(DestroyRef);

  currentUser = signal<User | null>(null);
  courses = signal<Course[]>([]);
  isLoading = signal(true);

  email = '';
  password = '';
  authError = signal('');
  isRegistering = signal(false);
  newCourseText = '';

  constructor() {
    this.authService.currentUser$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(user => {
        this.currentUser.set(user);
        if (user) {
          this.loadCourses();
        } else {
          this.courses.set([]);
          this.isLoading.set(false);
        }
      });
  }

  private loadCourses(): void {
    this.isLoading.set(true);
    this.courseService.getCourses()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(courses => {
        this.courses.set(courses);
        this.isLoading.set(false);
      });
  }

  async signIn(): Promise<void> {
    this.authError.set('');
    try {
      await this.authService.signIn(this.email, this.password);
    } catch (err) {
      this.authError.set(this.getAuthErrorMessage(err));
    }
  }

  async register(): Promise<void> {
    this.authError.set('');
    try {
      await this.authService.register(this.email, this.password);
    } catch (err) {
      this.authError.set(this.getAuthErrorMessage(err));
    }
  }

  async signOut(): Promise<void> {
    await this.authService.signOut();
  }

  async addCourse(): Promise<void> {
    const text = this.newCourseText.trim();
    if (!text) return;

    const tempKey = `temp-${Date.now()}`;
    this.courses.update(courses => [...courses, { key: tempKey, text }]);
    this.newCourseText = '';

    try {
      await this.courseService.addCourse(text);
    } catch {
      this.courses.update(courses => courses.filter(c => c.key !== tempKey));
      this.newCourseText = text;
    }
  }

  async updateCourse(key: string, newText: string): Promise<void> {
    const trimmed = newText.trim();
    if (!trimmed) return;
    await this.courseService.updateCourse(key, trimmed);
  }

  async deleteCourse(key: string): Promise<void> {
    const deleted = this.courses().find(c => c.key === key);
    this.courses.update(courses => courses.filter(c => c.key !== key));
    try {
      await this.courseService.deleteCourse(key);
    } catch {
      if (deleted) this.courses.update(courses => [...courses, deleted]);
    }
  }

  async deleteAll(): Promise<void> {
    const backup = this.courses();
    this.courses.set([]);
    try {
      await this.courseService.deleteAll();
    } catch {
      this.courses.set(backup);
    }
  }

  private getAuthErrorMessage(err: unknown): string {
    if (err && typeof err === 'object' && 'code' in err) {
      const code = (err as { code: string }).code;
      if (code === 'auth/invalid-credential') return 'Invalid email or password.';
      if (code === 'auth/email-already-in-use') return 'Email already in use.';
      if (code === 'auth/weak-password') return 'Password must be at least 6 characters.';
      if (code === 'auth/invalid-email') return 'Invalid email address.';
    }
    return 'An error occurred. Please try again.';
  }
}
