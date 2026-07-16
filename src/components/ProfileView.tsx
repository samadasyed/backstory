import { Bookmark, BookOpen, Clock3, Dna, Landmark, Layers3, Play, Sigma } from "lucide-react";
import type { Course, StudentProfile } from "../../shared/contracts";

type ProfileViewProps = {
  profile: StudentProfile | null;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
};

function formatWatchTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
}

function SubjectIcon({ subject }: { subject: Course["subject"] }) {
  if (subject === "history") return <Landmark aria-hidden="true" />;
  if (subject === "science") return <Dna aria-hidden="true" />;
  if (subject === "math") return <Sigma aria-hidden="true" />;
  return <BookOpen aria-hidden="true" />;
}

export function ProfileView({ profile, loading, error, onRetry }: ProfileViewProps) {
  if (error) {
    return (
      <section className="profile-view profile-error" aria-label="Student profile">
        <h1>Profile</h1>
        <p>{error}</p>
        <button type="button" onClick={onRetry}>Try again</button>
      </section>
    );
  }

  if (loading || !profile) {
    return (
      <section className="profile-view profile-loading" aria-label="Student profile" aria-busy="true">
        <div className="profile-loading-line" />
        <div className="profile-loading-avatar" />
        <div className="profile-loading-line short" />
        <div className="profile-loading-block" />
      </section>
    );
  }

  return (
    <section className="profile-view" aria-label={`${profile.student.displayName}'s profile`}>
      <header className="profile-header">
        <span className="profile-wordmark">Backstory<span>.</span></span>
        <h1>Profile</h1>
      </header>

      <div className="student-identity">
        <div className="student-avatar" aria-hidden="true">{profile.student.initials}</div>
        <div>
          <span>DEMO STUDENT</span>
          <h2>{profile.student.displayName}</h2>
          <p>{profile.student.gradeLabel} · {profile.student.connectionLabel}</p>
        </div>
      </div>

      <section className="activity-section" aria-labelledby="activity-heading">
        <div className="section-heading">
          <span>YOUR BACKSTORY</span>
          <h2 id="activity-heading">Activity</h2>
        </div>
        <dl className="profile-stats">
          <div>
            <dt><Play aria-hidden="true" /> Videos watched</dt>
            <dd>{profile.stats.videosWatched}</dd>
          </div>
          <div>
            <dt><Clock3 aria-hidden="true" /> Time watched</dt>
            <dd>{formatWatchTime(profile.stats.totalWatchSeconds)}</dd>
          </div>
          <div>
            <dt><Bookmark aria-hidden="true" /> Saved</dt>
            <dd>{profile.stats.savedPosts}</dd>
          </div>
          <div>
            <dt><Layers3 aria-hidden="true" /> Classes</dt>
            <dd>{profile.stats.connectedClasses}</dd>
          </div>
        </dl>
      </section>

      <section className="current-classes" aria-labelledby="classes-heading">
        <div className="section-heading">
          <span>RIGHT NOW</span>
          <h2 id="classes-heading">In your classes</h2>
        </div>
        <ul className="profile-class-list">
          {profile.classes.map(({ course, current }) => (
            <li key={course.id} className={`profile-class subject-${course.subject}`}>
              <div className="class-icon"><SubjectIcon subject={course.subject} /></div>
              <div className="class-copy">
                <span>{course.name}</span>
                <strong>{current.title} · {current.positionLabel}</strong>
                <small>{current.detail}</small>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <p className="profile-demo-note">Synthetic profile and activity data</p>
    </section>
  );
}
