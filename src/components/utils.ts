export function capitalise(string: string) {
  if (!string) {
    return string;
  }
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export type Tree = {
  name: string;
  children: Tree;
}[];

type File = {
  inputPath: string;
  children: { inputPath: string }[];
};

export function cleanupFiles(files: File[]) {
  const root = files.find(x => x.inputPath === "README.md");

  if (!root) {
    console.warn("Cannot find the root");
    return [];
  }

  function buildTree(node: File): Tree {
    return node.children
      .sort((a, b) => (a > b ? -1 : 1))
      .map(x =>
        !!x && !!x.inputPath
          ? files.find(y => y.inputPath === x.inputPath)
          : undefined
      )
      .filter(x => !!x)
      .map(x => ({
        name: x!.inputPath.replace(/README\.md$/, "").replace(/\.md$/, ""),
        children: buildTree(x!)
      }));
  }

  return buildTree(root);
}

export function cleanupLink(link = "#") {
  return link.replace(/^\/\//, "/");
}
