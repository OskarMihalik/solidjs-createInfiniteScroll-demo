import {
  Accessor,
  Setter,
  createSignal,
  onCleanup,
  createResource,
  createComputed,
  batch,
} from "solid-js";
import { tryOnCleanup, type Directive, noop } from "@solid-primitives/utils";
import { isServer } from "solid-js/web";
/**
 * Provides an easy way to implement infinite scrolling.
 *
 * ```ts
 * const [pages, loader, { page, setPage, setPages, end, setEnd }] = createInfiniteScroll(fetcher);
 * ```
 * @param fetcher `(page: number) => Promise<T[]>`
 * @return `pages()` is an accessor contains array of contents
 * @property `pages.loading` is a boolean indicator for the loading state
 * @property `pages.error` contains any error encountered
 * @return `infiniteScrollLoader` is a directive used to set the loader element
 * @method `page` is an accessor that contains page number
 * @method `setPage` allows to manually change the page number
 * @method `setPages` allows to manually change the contents of the page
 * @method `end` is a boolean indicator for end of the page
 * @method `setEnd` allows to manually change the end
 */
export function createInfiniteScroll<T>(
  fetcher: (page: number) => Promise<T[]>
): [
  pages: Accessor<T[]>,
  loader: Directive,
  options: {
    page: Accessor<number>;
    setPage: Setter<number>;
    setPages: Setter<T[]>;
    end: Accessor<boolean>;
    setEnd: Setter<boolean>;
  }
] {
  const [pages, setPages] = createSignal<T[]>([]);
  const [page, setPage] = createSignal(0);
  const [end, setEnd] = createSignal(false);

  let add: (el: Element) => void = noop;
  if (!isServer) {
    const io = new IntersectionObserver((e) => {
      if (e.length > 0 && e[0]!.isIntersecting && !end() && !contents.loading) {
        setPage((p) => p + 1);
      }
    });
    onCleanup(() => io.disconnect());
    add = (el: Element) => {
      io.observe(el);
      tryOnCleanup(() => io.unobserve(el));
    };
  }

  const [contents] = createResource(page, fetcher);

  createComputed(() => {
    const content = contents();
    if (!content) return;
    batch(() => {
      if (content.length === 0) setEnd(true);
      setPages((p) => [...p, ...content]);
    });
  });

  return [
    pages,
    add,
    {
      page: page,
      setPage: setPage,
      setPages: setPages,
      end: end,
      setEnd: setEnd,
    },
  ];
}
