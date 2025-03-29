// Define props interface
interface StatusBarProps {
    status: string;
  }
  
  export default function StatusBar({ status }: StatusBarProps) {
    return (
      <footer className="p-2 bg-gray-200 text-center text-sm text-gray-600">
        {status}
      </footer>
    );
  }