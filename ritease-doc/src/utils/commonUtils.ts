// Generic debounce function
export function debounce<T extends (...args: Parameters<T>) => unknown>(
    fn: T,
    ms: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
  
    // Return a debounced version of the function that matches the input function's argument types
    return (...args: Parameters<T>) => {
      clearTimeout(timeout); // Clear any existing timeout
      timeout = setTimeout(() => fn(...args), ms); // Schedule the original function call
    };
  }