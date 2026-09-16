const fs = require('fs');

function applyPeekLogic(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    const searchRegex = /responseStream\s*=\s*stream;\s*successModel\s*=\s*modelName;\s*\/\/[^\n]*\n\s*break modelLoop;/g;

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
                        successModel = modelName;
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
