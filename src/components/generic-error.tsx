import { X } from 'lucide-react';

interface GenericErrorPopupProps {
  message: string;
  background?: string;
  color?: string;
  closeable?: boolean;
  onClose?: () => void;
  icon?: React.ReactNode;
}

export function GenericErrorPopup({
  message,
  onClose,
  background = 'bg-red-500',
  color = 'text-white',
  closeable = false,
  icon,
}: GenericErrorPopupProps) {
  return (
    <div
      className={`absolute flex gap-x-2 items-center z-10 left-1/2 top-2 -translate-x-1/2 ${background} rounded-sm p-2`}>
      {icon}
      <span className={`font-semibold ${color} -translate-y-[1px]`}>
        {message}
      </span>
      {closeable && (
        <button onClick={() => onClose?.()} className={'text-white'}>
          <X />
        </button>
      )}
    </div>
  );
}
