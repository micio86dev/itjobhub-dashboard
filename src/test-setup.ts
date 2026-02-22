import { afterEach, beforeEach, vi } from "vitest";
import { config } from "@vue/test-utils";
import Cookies from "js-cookie";

config.global.stubs = {};

// Mock reka-ui primitives to avoid WeakMap issues
vi.mock("reka-ui", async () => {
  const vue = await vi.importActual<typeof import("vue")>("vue");
  const { defineComponent, h } = vue;
  type VNode = import("vue").VNode;
  const Primitive = defineComponent({
    name: "RekaUiPrimitive",
    props: ["as", "asChild"],
    setup(
      props: { as?: string; asChild?: boolean },
      {
        slots,
        attrs,
      }: { slots: { default?: () => VNode[] }; attrs: Record<string, unknown> },
    ) {
      return () => h(props.as || "div", { ...attrs, class: attrs.class }, slots.default?.());
    },
  });

  return {
    CheckboxRoot: Primitive,
    CheckboxIndicator: Primitive,
    useForwardPropsEmits: (props: unknown) => props,
  };
});

if (!window.matchMedia) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      media: query,
      matches: false,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}

beforeEach(() => {
  Object.keys(Cookies.get() as Record<string, string>).forEach((key) => {
    Cookies.remove(key);
  });
  document.documentElement.classList.remove("dark");
});

afterEach(() => {
  Object.keys(Cookies.get() as Record<string, string>).forEach((key) => {
    Cookies.remove(key);
  });
  document.documentElement.classList.remove("dark");
});
