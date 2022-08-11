export default function deprecated(
  props: string,
  instead: string,
  component: string,
) {
  if (typeof window !== 'undefined' && window.console && window.console.error) {
    window.console.error(
      `Warning: ${props} is deprecated at [ ${component} ], ` +
        `use [ ${instead} ] instead of it.`,
    );
  }
}
