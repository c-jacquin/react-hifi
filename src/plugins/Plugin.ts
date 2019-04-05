export interface Plugin<Props, Node = AudioNode> {
  createNode(ctx: AudioContext, props: Props): Node;
  updateNode?(node: Node, props: Props, ctx: AudioContext): void;
}
