export interface Plugin<Props, Node = AudioNode | AudioNode[]> {
  createNode(ctx: AudioContext, props: Props): Node;
  updateNode?(node: Node, props: Props, ctx: AudioContext): void;
  shouldNotUpdate?: (prevProps: Props, nextProps: Props) => boolean;
}
