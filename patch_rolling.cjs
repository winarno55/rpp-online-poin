const fs = require('fs');

function applyPeekLogic(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Find the place where responseStream is assigned and break is called
    // We want to replace:
    // responseStream = stream;
    // successModel = modelName;
    // break modelLoop;
    
    // Note: in generate-bundle-step.ts it might not have successModel assignment
    
    const searchRegex = /responseStream\s*=\s*stream;\s*(successModel\s*=\s*modelName;\s*)?break modelLoop;/g;

    const replacement = `
                        const iterator = stream[Symbol.asyncIterator]();
                        const firstResult = await iterator.next();
                        
                        responseStream = {
                            async *[Symbol.asyncIterator]() {
                                if (!firstResult.done) {
                                    yield firstResult.value;
                                }
                                yield* iterator;
                            }
                        };
                        $1
                        break modelLoop;
`;

    if (content.match(searchRegex)) {
        content = content.replace(searchRegex, replacement);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Patched ${filePath}`);
    } else {
        console.log(`Could not find match in ${filePath}`);
    }
}

applyPeekLogic('api/generate.ts');
applyPeekLogic('api/generate-bundle-step.ts');
