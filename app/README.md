# Next.js App Project Structure

This project uses Next.js App Router. Here's how the file structure works:

## Routing Structure

In Next.js App Router, the file system is used for routing. Each folder represents a route segment that maps to a URL segment.

### Key Points

- Files named `page.tsx` define the UI for a route
- Files should be placed directly in the `app` directory or within appropriate route folders
- There should NOT be a `pages` folder inside the `app` directory (this conflicts with the routing system)

### Example Structure
