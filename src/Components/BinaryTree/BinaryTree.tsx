import React from "react";
import Tree from "react-d3-tree";

interface TreeNode {
  id: string;
  name: string;
  left?: TreeNode | null;
  right?: TreeNode | null;
}

interface BinaryTreeProps {
  parent: string;
  tree: TreeNode;
  currentSmId: string;
}

const transformTree = (node: TreeNode | null, currentSmId: string): any => {
  if (!node) return null;

  return {
    name: node.name,
    attributes: { "": node.id },
    nodeSvgShape:
      node.id === currentSmId
        ? { shape: "circle", shapeProps: { r: 15, fill: "red" } }
        : undefined,
    children: [
      transformTree(node.left, currentSmId),
      transformTree(node.right, currentSmId),
    ].filter(Boolean),
  };
};

const BinaryTree: React.FC<BinaryTreeProps> = ({
  parent,
  tree,
  currentSmId,
}) => {
  if (!tree) return <p>No tree data available.</p>;

  const treeData = {
    name: `Parent: ${parent}`,
    children: [transformTree(tree, currentSmId)],
  };

  return (
    <div style={{ width: "100%", height: "100vh", fontSize: "12px" }}>
      <Tree
        data={treeData}
        orientation="vertical"
        translate={{ x: window.innerWidth / 2, y: 100 }}
        pathFunc="diagonal"
        separation={{ siblings: 1, nonSiblings: 2 }}
      />
    </div>
  );
};

export default BinaryTree;
