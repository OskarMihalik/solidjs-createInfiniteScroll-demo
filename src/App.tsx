import { render } from 'solid-js/web';
import { For, Show } from 'solid-js';
import { createInfiniteScroll } from '@solid-primitives/pagination';

export default function App() {
  // fetcher: (page: number) => Promise<T[]>
  const [pages, setEl, { end }] = createInfiniteScroll(async (i) => {
    await new Promise((r) => setTimeout(r, 1000));
    if (i > 2) return [];
    console.log('done');
    const arr = new Array(10).fill(0).map((_, i2) => `${i * 100 + i2}`);

    return arr;
  });

  return (
    <div>
      <div>
        <For each={pages()}>
          {(item) => {
            console.log(item);
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
