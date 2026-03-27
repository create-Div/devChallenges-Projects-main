# AGENTS

## Project Plan

This project will remain a demonstration checkout experience built with vanilla TypeScript. All display values should be hardcoded in a dedicated `data.ts` file, then rendered and calculated from that data rather than embedded directly in the HTML.

## Core Goals

- Keep the project vanilla TypeScript with no framework
- Move hardcoded business and display values into `src/data.ts`
- Render the UI from data instead of keeping static repeated markup in `index.html`
- Calculate item count, subtotal, tax, discount, and total from source data
- Use Zod for validation logic on all user inputs
- Match the provided design files as closely as possible in CSS
- Use modern CSS features while preserving the existing CSS layer structure
- Do not modify the `@layer reset` block
- Use CSS nesting with a maximum depth of 3 levels
- Use `em` units for breakpoints
- Scope breakpoints locally to the component or rule that needs them

## Current State

- `index.html` currently contains a static checkout mockup
- `src/style.css` currently contains only the reset and declared layer list
- `src/main.ts` does not exist yet, so the project does not currently build

## Implementation Plan

### 1. App Shell And Entry Point

- Keep `index.html` as a lightweight shell
- Add a mount point for the app
- Create `src/main.ts` to bootstrap rendering, state, and events

### 2. Data-Driven Demo Content

Create `src/data.ts` to hold all hardcoded values, including:

- cart items
- tax rate
- coupon configuration
- country options
- default form values
- labels and other fixed UI content if helpful

Suggested cart item fields:

- `id`
- `name`
- `variant`
- `price`
- `quantity`
- `image`
- `alt`

### 3. Rendering Structure

Split the app into small vanilla TypeScript modules, such as:

- `src/main.ts` for bootstrap and app lifecycle
- `src/data.ts` for demo data and constants
- `src/render.ts` for markup generation
- `src/state.ts` for in-memory UI state
- `src/validation.ts` for Zod schemas and validation helpers
- `src/format.ts` for currency and display formatting helpers

### 4. Calculation Rules

All totals should be derived from the source data:

- item count from cart quantities
- subtotal from price x quantity
- tax from subtotal x tax rate
- discount from coupon rules
- total from subtotal + tax - discount

Do not hardcode visible totals in the rendered output.

### 5. Validation With Zod

Use Zod for all user-facing input validation:

- first and last name
- email address
- country
- postal code
- coupon code

Validation should be reusable and separate from DOM code. Show inline error states and messages based on parse results.

### 6. Coupon Behavior

Recommended demo behavior:

- one hardcoded valid coupon such as `SAVE10`
- apply a percentage-based discount
- show success or error feedback inline
- keep all coupon rules data-driven through `data.ts`

### 7. CSS Architecture

Preserve the existing layer declaration exactly:

- `@layer reset, elements, theme, componenets, utilities;`

Requirements:

- do not touch `@layer reset`
- add new styles only in the remaining layers
- define tokens in `@layer theme`
- build component styles in `@layer componenets`
- use CSS nesting sparingly and no deeper than 3 levels
- use local `@media` queries in `em`
- scope responsive changes to the components that need them

### 8. Pixel-Perfect Design Goals

Use the design files in `design/` as the source of truth for desktop, tablet, and mobile layouts.

Match as closely as possible:

- overall card proportions
- header area and background treatment
- order summary and form panel split
- spacing and alignment
- typography scale and weight
- badge shape and sizing
- product image frames
- coupon row layout
- totals block spacing
- input, select, and button dimensions
- mobile stacking behavior

### 9. Suggested Build Order

1. create `src/main.ts` and restore a successful build
2. move demo values into `src/data.ts`
3. render the UI from TypeScript
4. implement calculations
5. add Zod validation
6. rebuild CSS to match desktop
7. refine tablet and mobile breakpoints
8. verify formatting, linting, and build

## Verification

Run lint and format scripts after implementation of a feature and project.