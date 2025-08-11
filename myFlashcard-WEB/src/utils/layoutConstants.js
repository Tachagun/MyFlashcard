/**
 * LAYOUT CONSTANTS - NEVER FORGET THESE!
 * 
 * The application has a fixed layout structure that ALL pages must respect:
 * - Fixed header: 64px height (MainNav)
 * - Fixed sidebar: 224px width (w-56) when authenticated
 * - Main content area starts after header and sidebar
 * 
 * CRITICAL RULES:
 * 1. NEVER use full-screen layouts (h-screen, fixed positioning, etc.)
 * 2. NEVER add manual offsets for header/sidebar (Layout handles this)
 * 3. ALWAYS use standard container patterns (max-w-X mx-auto p-6)
 * 4. Back button is handled by Layout component automatically
 */

export const LAYOUT_CONSTANTS = {
  // Header dimensions
  HEADER_HEIGHT: 64, // px - from MainNav style={{ height: '64px' }}
  
  // Sidebar dimensions  
  SIDEBAR_WIDTH: 224, // px - from w-56 (14rem = 224px)
  
  // Back button positioning (handled by Layout)
  BACK_BUTTON_TOP: 64, // px - top-16 (4rem = 64px) 
  BACK_BUTTON_LEFT_STUDY: 24, // px - left-6 (1.5rem = 24px) for study pages
  BACK_BUTTON_LEFT_PROFILE: 240, // px - left-60 (15rem = 240px) for profile pages
  
  // Standard container patterns
  CONTAINER_CLASSES: {
    STANDARD: 'max-w-4xl mx-auto p-6',
    SMALL: 'max-w-2xl mx-auto p-6', 
    LARGE: 'max-w-6xl mx-auto p-6',
    FORM: 'max-w-xl mx-auto p-6',
  },
  
  // DO NOT USE - These break the layout!
  FORBIDDEN_CLASSES: [
    'h-screen',
    'fixed',
    'absolute', 
    'pt-16', 
    'pt-20',
    'ml-56',
    'ml-60',
    'top-16',
    'top-20',
    'left-6',
    'left-60'
  ]
};

/**
 * Helper function to get proper container class
 * @param {string} size - 'standard', 'small', 'large', or 'form'
 * @returns {string} - The appropriate container class
 */
export const getContainerClass = (size = 'standard') => {
  return LAYOUT_CONSTANTS.CONTAINER_CLASSES[size.toUpperCase()] || LAYOUT_CONSTANTS.CONTAINER_CLASSES.STANDARD;
};

/**
 * Reminder function - call this before creating any layout!
 */
export const layoutReminder = () => {
  console.warn(`
🚨 LAYOUT REMINDER:
- Header: ${LAYOUT_CONSTANTS.HEADER_HEIGHT}px fixed
- Sidebar: ${LAYOUT_CONSTANTS.SIDEBAR_WIDTH}px fixed (when authenticated)  
- Use: ${LAYOUT_CONSTANTS.CONTAINER_CLASSES.STANDARD} for standard pages
- NEVER use: ${LAYOUT_CONSTANTS.FORBIDDEN_CLASSES.join(', ')}
- Layout component handles back button positioning automatically
  `);
};
