import { type FormEvent, useRef } from "react";

import { Button } from "@/primitives/button";
import { Input } from "@/primitives/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/primitives/select";
import { cn } from "@/utils/utils";

export function APITester() {
  const responseInputRef = useRef<HTMLTextAreaElement>(null);

  const testEndpoint = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const form = e.currentTarget;
      const formData = new FormData(form);
      const endpoint = formData.get("endpoint") as string;
      const url = new URL(endpoint, location.href);
      const method = formData.get("method") as string;
      const res = await fetch(url, { method });

      const data = await res.json();
      // biome-ignore lint/style/noNonNullAssertion: <>
      responseInputRef.current!.value = JSON.stringify(data, null, 2);
    } catch (error) {
      // biome-ignore lint/style/noNonNullAssertion: <>
      responseInputRef.current!.value = String(error);
    }
  };

  return (
    <div className="mx-auto mt-8 flex w-full max-w-2xl flex-col gap-4 text-left">
      <form
        className={`
          flex w-full items-center gap-2 rounded-xl border border-input bg-card
          p-3 font-mono
        `}
        onSubmit={testEndpoint}
      >
        <Select defaultValue="GET" name="method">
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="GET">GET</SelectItem>
            <SelectItem value="PUT">PUT</SelectItem>
          </SelectContent>
        </Select>

        <Input
          className={cn(
            "flex-1 font-mono",
            "border-0 bg-transparent shadow-none",
            "focus-visible:ring-0 focus-visible:ring-offset-0",
          )}
          defaultValue="/api/hello"
          name="endpoint"
          placeholder="/api/hello"
          type="text"
        />

        <Button type="submit" variant="secondary">
          Send
        </Button>
      </form>

      <textarea
        className={cn(
          "min-h-[140px] w-full bg-card",
          "rounded-xl border border-input p-3",
          "resize-y font-mono",
          "placeholder:text-muted-foreground",
        )}
        placeholder="Response will appear here..."
        readOnly
        ref={responseInputRef}
      />
    </div>
  );
}
