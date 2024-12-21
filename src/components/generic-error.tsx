import { X } from "lucide-react"

export function GenericErrorPopup({ message }: { message: string }) {
  return (
    <div className={'absolute flex gap-x-2 items-center z-10 left-1/2 top-2 -translate-x-1/2 bg-red-500 rounded p-2'}>
      <X/>
      <span className="font-semibold -translate-y-[1px]">{message}</span>
    </div>
  );
}