# Lead Generator - Windsurf Rules

Every time you choose to apply a rule(s), explicitly state the rule(s) in the output. You can abbreviate the rule description to a single word or phrase.

## Project Context
See PROJECT_CONTEXT.md for detailed project information.

## Code Style and Structure
- Write clean, maintainable React TypeScript code
- Use functional components and hooks
- Implement proper error handling and loading states
- Use descriptive variable names (e.g., isLoading, hasError)
- Structure repository files as follows:
```
leadgenerator/
├── src/
    ├── components/     # Reusable React components
    ├── utils/          # Helper functions
    ├── types/          # TypeScript types
    ├── hooks/          # Custom React hooks
    └── lib/            # Shared libraries and configurations
public/
    └── verify/        # Verification page assets
```

## Tech Stack
- React 18
- TypeScript
- Vite
- Bulma CSS (via CDN)
- Tailwind CSS
- Supabase
- React Router DOM
- Lucide React
- React Hot Toast

## CSS Framework Usage
- Use Bulma for:
  - Pre-built components (navbar, tags, buttons)
  - Base styling and structure
  - Form components
  - Hero sections
  - Modifiers (is-primary, is-medium, etc.)

- Use Tailwind for:
  - Layout (flex, grid)
  - Spacing and positioning
  - Responsive design (md:, lg: breakpoints)
  - Custom styling and fine-tuning
  - Component-specific adjustments

## Naming Conventions
- Use lowercase with dashes for directories (e.g., components/form-input)
- Use PascalCase for component files (e.g., FormInput.tsx)
- Use camelCase for utility files (e.g., supabaseClient.ts)
- Use descriptive names for SQL files (e.g., email-rate-limit.sql)

## TypeScript Usage
- Use TypeScript for all new code
- Define interfaces for component props
- Use type safety for Supabase operations
- Implement proper error types
- Use explicit return types for functions
- Avoid any type unless absolutely necessary

## Database and Backend
- Follow Supabase best practices
- Implement proper RLS policies
- Use parameterized queries
- Handle database errors gracefully
- Document database schema changes

## State Management
- Use React hooks for local state
- Implement proper form state management
- Handle loading and error states
- Clean up effects and subscriptions

## Syntax and Formatting
- Follow consistent indentation (2 spaces)
- Use proper TypeScript type annotations
- Implement clean component structure
- Use descriptive variable and function names

## UI and Styling
- Use Bulma for component structure
- Use Tailwind for layout and customization
- Follow responsive design principles
- Implement proper loading states
- Use Lucide icons consistently
- Maintain consistent color scheme
- Follow German language conventions for UI text

## Error Handling
- Implement user-friendly error messages
- Log errors for debugging
- Handle network failures gracefully
- Provide clear validation feedback
- Support proper error recovery

## Testing
- Test email verification flow
- Verify rate limiting functionality
- Test responsive design
- Validate form submissions
- Check database operations

## Security
- Implement proper email validation
- Use rate limiting for abuse prevention
- Follow Supabase security best practices
- Sanitize user inputs
- Protect sensitive operations with RLS

## Git Usage
Commit Message Prefixes:
- "fix:" for bug fixes
- "feat:" for new features
- "style:" for styling changes
- "refactor:" for code improvements
- "docs:" for documentation updates
- "test:" for adding tests
- "chore:" for maintenance tasks

## Performance
- Optimize image sizes
- Minimize unnecessary re-renders
- Use proper lazy loading
- Implement caching where appropriate
- Monitor bundle size

## Accessibility
- Use semantic HTML elements
- Provide proper ARIA labels
- Ensure keyboard navigation
- Maintain sufficient color contrast
- Support screen readers

## Localization
- Use German for all user-facing text
- Support proper date/time formatting
- Follow German address formats
- Use appropriate number formatting
- Support German phone number formats
