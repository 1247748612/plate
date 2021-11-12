import { renderToStaticMarkup } from 'react-dom/server';
import { createElementWithSlate } from '@udecode/plate-common';
import {
  getRenderElement,
  getRenderLeaf,
  injectOverrideProps,
  PlateEditor,
  PlatePlugin,
  PlateRenderElementProps,
  PlateRenderLeafProps,
  SlateProps,
  TDescendant,
} from '@udecode/plate-core';
import { Text } from 'slate';

// Remove extra whitespace generated by ReactDOMServer
const trimWhitespace = (rawHtml: string): string =>
  rawHtml.replace(/(\r\n|\n|\r|\t)/gm, '');

// Remove redundant data attributes
const stripSlateDataAttributes = (rawHtml: string): string =>
  rawHtml
    .replace(/( data-slate)(-node|-type|-leaf)="[^"]+"/gm, '')
    .replace(/( data-testid)="[^"]+"/gm, '');

/**
 * Remove all class names that do not start with one of preserveClassNames (`slate-` by default)
 */
const stripClassNames = (
  html: string,
  { preserveClassNames = ['slate-'] }: { preserveClassNames?: string[] }
) => {
  const allClasses = html.split(/(class="[^"]*")/g);

  let filteredHtml = '';
  allClasses.forEach((item, index) => {
    if (index % 2 === 0) {
      return (filteredHtml += item);
    }
    const preserveRegExp = new RegExp(
      preserveClassNames.map((cn) => `${cn}[^"\\s]*`).join('|'),
      'g'
    );
    const slateClassNames = item.match(preserveRegExp);
    if (slateClassNames) {
      filteredHtml += `class="${slateClassNames.join(' ')}"`;
    }
  });

  return filteredHtml;
};

const getNode = (
  editor: PlateEditor,
  {
    plugins,
    elementProps,
    slateProps,
    preserveClassNames,
  }: {
    plugins: PlatePlugin[];
    elementProps: PlateRenderElementProps;
    slateProps?: Partial<SlateProps>;
    preserveClassNames?: string[];
  }
) => {
  // If no type provided we wrap children with div tag
  if (!elementProps.element.type) {
    return `<div>${elementProps.children}</div>`;
  }

  let html: string | undefined;

  elementProps = injectOverrideProps<PlateRenderElementProps>(editor, {
    props: elementProps,
    plugins,
  });

  // Search for matching plugin based on element type
  plugins.some((plugin) => {
    if (!plugin.serialize?.element && !plugin.isElement) return false;

    if (
      !plugin
        .deserialize?.(editor, plugin)
        .element?.some(
          (item) => item.type === String(elementProps.element.type)
        )
    ) {
      html = `<div>${elementProps.children}</div>`;
      return false;
    }

    // Render element using picked plugins renderElement function and ReactDOM
    html = renderToStaticMarkup(
      createElementWithSlate({
        ...slateProps,
        children:
          plugin.serialize?.element?.(elementProps) ??
          getRenderElement(editor, plugin)(elementProps),
      })
    );

    html = stripClassNames(html, { preserveClassNames });

    return true;
  });

  return html;
};

const getLeaf = (
  editor: PlateEditor,
  {
    plugins,
    leafProps,
    slateProps,
    preserveClassNames,
  }: {
    plugins: PlatePlugin[];
    leafProps: PlateRenderLeafProps;
    slateProps?: Partial<SlateProps>;
    preserveClassNames?: string[];
  }
) => {
  const { children } = leafProps;

  return plugins.reduce((result, plugin) => {
    if (!plugin.serialize?.leaf && !plugin.isLeaf) return result;
    if (
      (plugin.serialize?.leaf?.(leafProps) ??
        getRenderLeaf(editor, plugin)(leafProps)) === children
    )
      return result;

    leafProps = {
      ...injectOverrideProps<PlateRenderLeafProps>(editor, {
        props: leafProps,
        plugins,
      }),
      children: encodeURIComponent(result),
    };

    let html = decodeURIComponent(
      renderToStaticMarkup(
        createElementWithSlate({
          ...slateProps,
          children:
            plugin.serialize?.leaf?.(leafProps) ??
            getRenderLeaf(editor, plugin)(leafProps),
        })
      )
    );

    html = stripClassNames(html, { preserveClassNames });

    return html;
  }, children);
};

const isEncoded = (str = '') => {
  try {
    return str !== decodeURIComponent(str);
  } catch (error) {
    return false;
  }
};

/**
 * Convert Slate Nodes into HTML string
 */
export const serializeHTMLFromNodes = (
  editor: PlateEditor,
  {
    plugins,
    nodes,
    slateProps,
    stripDataAttributes = true,
    preserveClassNames,
    stripWhitespace = true,
  }: {
    /**
     * Plugins with renderElement or renderLeaf.
     */
    plugins: PlatePlugin[];

    /**
     * Slate nodes to convert to HTML.
     */
    nodes: TDescendant[];

    /**
     * Enable stripping data attributes
     */
    stripDataAttributes?: boolean;

    /**
     * List of className prefixes to preserve from being stripped out
     */
    preserveClassNames?: string[];

    /**
     * Slate props to provide if the rendering depends on slate hooks
     */
    slateProps?: Partial<SlateProps>;

    /**
     * Whether stripping whitespaces from serialized HTML
     * @default true
     */
    stripWhitespace?: boolean;
  }
): string => {
  let result = nodes
    .map((node) => {
      if (Text.isText(node)) {
        return getLeaf(editor, {
          plugins,
          leafProps: {
            leaf: node,
            text: node,
            children: isEncoded(node.text)
              ? node.text
              : encodeURIComponent(node.text),
            attributes: { 'data-slate-leaf': true },
            editor,
            plugins,
          },
          slateProps,
          preserveClassNames,
        });
      }

      return getNode(editor, {
        plugins,
        elementProps: {
          element: node,
          children: encodeURIComponent(
            serializeHTMLFromNodes(editor, {
              plugins,
              nodes: node.children,
              preserveClassNames,
              stripWhitespace,
            })
          ) as any,
          attributes: { 'data-slate-node': 'element', ref: null },
          editor,
          plugins,
        },
        slateProps,
        preserveClassNames,
      });
    })
    .join('');

  if (isEncoded(result)) {
    result = decodeURIComponent(result);
  }

  if (stripWhitespace) {
    result = trimWhitespace(result);
  }

  if (stripDataAttributes) {
    result = stripSlateDataAttributes(result);
  }

  return result;
};
