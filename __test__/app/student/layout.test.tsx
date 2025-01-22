import { render, screen } from '@testing-library/react';
import StudentLayout from '@/app/student/layout';

describe('StudentLayout', () => {
  it('renders the sidebar with navigation links', () => {
    render(
      <StudentLayout>
        <div>Test Child Content</div>
      </StudentLayout>
    );

    // Check if the sidebar is rendered
    expect(screen.getByRole('navigation')).toBeInTheDocument();

    // Check for all navigation links
    expect(screen.getByRole('link', { name: /dashboard/i })).toHaveAttribute('href', '/student');
    expect(screen.getByRole('link', { name: /mes formations/i })).toHaveAttribute(
      'href',
      '/student/courses'
    );
    expect(screen.getByRole('link', { name: /ma progression/i })).toHaveAttribute(
      'href',
      '/student/progression'
    );
    expect(screen.getByRole('link', { name: /mes messages/i })).toHaveAttribute(
      'href',
      '/student/messages'
    );
    expect(screen.getByRole('link', { name: /paramètres/i })).toHaveAttribute(
      'href',
      '/student/settings'
    );
  });

  it('renders child content correctly', () => {
    render(
      <StudentLayout>
        <div>Test Child Content</div>
      </StudentLayout>
    );

    // Check if child content is rendered
    expect(screen.getByText('Test Child Content')).toBeInTheDocument();
  });
});
