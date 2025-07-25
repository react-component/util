export default function mergeProps<A, B, C>(
  defaultProps: A,
  config: B,
  props: C,
): A & B & C {
  return { ...defaultProps, ...config, ...props };
}
