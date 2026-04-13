/**
 * Template Utilities
 * Handles rendering with consistent layout
 */

const ejs = require('ejs');
const path = require('path');

/**
 * Render a template with layout
 * @param {string} templateName - Name of the template file (without .ejs)
 * @param {object} data - Data to pass to the template
 * @param {object} options - EJS options
 * @returns {Promise<string>} - Rendered HTML
 */
async function renderWithLayout(templateName, data = {}, options = {}) {
  const viewsDir = path.join(__dirname, '../views');
  
  try {
    // Render the content template
    const contentPath = path.join(viewsDir, `${templateName}.ejs`);
    const contentHtml = await ejs.renderFile(contentPath, data, options);
    
    // Wrap in layout
    const layoutPath = path.join(viewsDir, 'layout.ejs');
    const title = data.title || 'Expense Tracker';
    const layoutData = {
      title,
      body: contentHtml
    };
    
    const fullHtml = await ejs.renderFile(layoutPath, layoutData, options);
    return fullHtml;
  } catch (error) {
    console.error('Template rendering error:', error);
    throw error;
  }
}

module.exports = {
  renderWithLayout
};
