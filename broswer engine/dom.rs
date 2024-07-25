// following: https://limpet.net/mbrubeck/2014/08/08/toy-layout-engine-1.html
struct Node {
    //data common to all nodes:
    children: Vec<Node>,

    //data specific to each node type:
    node_type: NodeType,
}

enum NodeType {
    Text(String),
    Element(ElementData),
}