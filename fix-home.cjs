const fs = require('fs');
let code = fs.readFileSync('src/pages/HomePage.tsx', 'utf8');

code = code.replace(
    '{appMode === \\'select\\' && (\\n                <div className="flex-1 flex items-center justify-center py-12">',
    '{appMode === \\'select\\' && (\\n                <div className="flex-1 flex flex-col items-center justify-center py-12">'
);

// We need to wrap them in a single fragment or div.
// Wait, the easiest way is just to fix the JSX structure. Let's find exactly the replacement.
