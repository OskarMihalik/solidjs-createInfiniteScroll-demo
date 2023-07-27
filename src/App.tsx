import { render } from 'solid-js/web';
import { batch, For, Show } from 'solid-js';
// import { createInfiniteScroll } from "@solid-primitives/pagination";

import { createInfiniteScroll } from './createInfiniteScroll';
export default function App() {
  // fetcher: (page: number) => Promise<T[]>
  const [pages, setEl, { end, setPage, setEnd, setPages }] =
    createInfiniteScroll(async (i) => {
      console.log('page:', i);
      await new Promise((r) => setTimeout(r, 1000));
      if (i > 2) return [];
      console.log('done');
      const arr = new Array(50).fill(0).map((_, i2) => `${i * 100 + i2}`);

      return arr;
    });

  return (
    <div>
      <button
        onClick={() => {
          batch(() => {
            setPage(0);
            setEnd(false);
            setPages([]);
          });
        }}
      >
        reset pagination
      </button>
      <div>
        <For each={pages()}>
          {(item) => {
            return <h4>{item}</h4>;
          }}
        </For>
        <Show when={!end()}>
          <h1 ref={setEl}>Loading...</h1>
        </Show>
      </div>
    </div>
  );
}
