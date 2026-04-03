import { toast as sonnerToast } from "sonner"

export const toast = sonnerToast

export function showJsonToast(title: string, data: unknown) {
  sonnerToast(title, {
    description: (
      <pre className="mt-2 w-full max-w-full overflow-x-auto rounded-md bg-gray-100 p-2 whitespace-pre-wrap wrap-break-word">
        <code className="block text-sm text-gray-800 whitespace-pre-wrap wrap-break-word">{JSON.stringify(data, null, 2)}</code>
      </pre>
    ),
    position: "bottom-right",
    className: "flex max-w-[min(92vw,48rem)] flex-col gap-2",
    style: {
      "--border-radius": "calc(var(--radius) + 4px)",
    } as React.CSSProperties,
  })
}
