export function capitalise(string: string) {
  if (!string) {
    return string;
  }
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export type Tree = {
  name: string;
  children: Tree[];
};

type File = {
  inputPath: string;
  children: { inputPath: string }[];
};

export function buildFileTree(files: File[]): Tree | null {
  const rootFile = files.find(x => x.inputPath === "README.md");

  if (!rootFile) {
    console.warn("Cannot find the root page");
    return null;
  }

  function buildTree(node: File): Tree {
    return {
      name: node!.inputPath.replace(/README\.md$/, "").replace(/\.md$/, ""),
      children: node.children
        .filter(file => !!file && !!file.inputPath)
        .sort((a, b) => (b.inputPath > a.inputPath ? -1 : 1))
        .map(file => files.find(x => x.inputPath === file.inputPath))
        .filter(file => !!file)
        .map(file => buildTree(file!))
    };
  }

  return buildTree(rootFile);
}

export function cleanupLink(link = "#") {
  return link.replace(/^\/\//, "/");
}
