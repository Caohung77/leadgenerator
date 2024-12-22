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
- Tailwind CSS
- Supabase
- React Router DOM
- Lucide React
- React Hot Toast

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
- Use Tailwind CSS for styling
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
- "style:" for UI/styling changes
- "docs:" for documentation
- "refactor:" for code improvements
- "perf:" for performance updates
- "security:" for security enhancements

Rules:
- Use descriptive commit messages
- Reference related issues
- Keep commits focused and atomic
- Document breaking changes

## Documentation
- Maintain clear README
- Document environment setup
- Keep SQL files well-commented
- Document API interactions
- Maintain clear component documentation

## Development Workflow
- Use proper version control
- Test locally before deployment
- Follow deployment checklist
- Update documentation
- Monitor error rates
- Track performance metrics

## Environment Management
- Use .env files properly
- Never commit sensitive data
- Document required variables
- Maintain separate production/development configs
- Handle environment-specific features
