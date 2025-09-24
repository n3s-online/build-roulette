# Claude Project Context

## Package Manager
- Use **pnpm** (not npm) for all package management
- Commands: `pnpm install`, `pnpm run build`, `pnpm run dev`, etc.

## Project Structure
- See `prd.md` for comprehensive project context and requirements
- React/Next.js project with TypeScript
- Components in `/src/components/`
- Main page in `/src/app/page.tsx`

## Development Workflow
- **Lint/Build**: Always run `pnpm run build` (and `pnpm run lint` if available) after making code changes
- **Git commits**: Commit changes when it makes logical sense, not just when asked
- **Testing**: Check for available test scripts in package.json before assuming testing approach

## User Preferences
- Proactive git commits at appropriate milestones
- Use pnpm consistently throughout the project
- Reference prd.md for project context and goals