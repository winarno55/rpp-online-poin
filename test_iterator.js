async function run() {
    const stream = (async function* () {
        yield "hello";
        yield "world";
    })();

    const iterator = stream[Symbol.asyncIterator]();
    const first = await iterator.next();
    
    const responseStream = {
        async *[Symbol.asyncIterator]() {
            if (!first.done) {
                yield first.value;
            }
            yield* iterator;
        }
    };

    for await (const chunk of responseStream) {
        console.log(chunk);
    }
}
run();
