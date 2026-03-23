import { toast as sonnerToast } from "sonner"

export const toast = sonnerToast

export function showJsonToast(title: string, data: unknown) {
  sonnerToast(title, {
    description: (
      <pre className="mt-2 w-full rounded-md bg-gray-100 p-2">
        <code className="text-sm text-gray-800">{JSON.stringify(data, null, 2)}</code>
      </pre>
    ),
    position: "bottom-right",
    className: "flex flex-col gap-2",
    style: {
      "--border-radius": "calc(var(--radius) + 4px)",
    } as React.CSSProperties,
  })
}
