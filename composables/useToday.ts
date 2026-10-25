// Shared between server and client so both render the same day.
export function useToday() {
  return useState('today', () => parisDay(new Date()))
}
