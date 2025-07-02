import { useState } from "react";
import { z } from "zod";

import { Button } from "@/primitives/button";
import { Input } from "@/primitives/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/primitives/select";
import { isBunEnv, isTauriEnv } from "@/utils/env";

import {
  doubleNumber,
  getSystemInfo,
  greet,
  listFiles,
  testEndpoint,
} from "./server/actions.server";

export function AppClientComponent() {
  // Greet state
  const [greetName, setGreetName] = useState("");
  const [greetResult, setGreetResult] = useState<any>(null);
  const [greetError, setGreetError] = useState<null | string>(null);

  // Double number state
  const [numberValue, setNumberValue] = useState("");
  const [doubleResult, setDoubleResult] = useState<any>(null);
  const [doubleError, setDoubleError] = useState<null | string>(null);

  // Test endpoint state (Bun environment)
  const [endpointUrl, setEndpointUrl] = useState(
    "https://jsonplaceholder.typicode.com/posts/1",
  );
  const [endpointMethod, setEndpointMethod] = useState<
    "DELETE" | "GET" | "PATCH" | "POST" | "PUT"
  >("GET");
  const [endpointResult, setEndpointResult] = useState<any>(null);
  const [endpointError, setEndpointError] = useState<null | string>(null);

  // File system state (Tauri environment)
  const [filePath, setFilePath] = useState("");
  const [fileResult, setFileResult] = useState<any>(null);
  const [fileError, setFileError] = useState<null | string>(null);

  // System info state
  const [systemInfo, setSystemInfo] = useState<any>(null);

  // Greet function
  const handleGreet = async () => {
    try {
      setGreetError(null);
      const result = await greet({ name: greetName });
      setGreetResult(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setGreetError(error.errors[0]?.message || "Validation error");
      } else {
        setGreetError(error instanceof Error ? error.message : "Unknown error");
      }
    }
  };

  // Double number by 2 function
  const handleDoubleNumber = async () => {
    try {
      setDoubleError(null);
      const numValue = Number.parseFloat(numberValue);
      if (Number.isNaN(numValue)) {
        setDoubleError("Please enter a valid number");
        return;
      }
      const result = await doubleNumber({ value: numValue });
      setDoubleResult(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setDoubleError(error.errors[0]?.message || "Validation error");
      } else {
        setDoubleError(
          error instanceof Error ? error.message : "Unknown error",
        );
      }
    }
  };

  // Test endpoint function (Bun environment)
  const handleTestEndpoint = async () => {
    try {
      setEndpointError(null);
      const result = await testEndpoint({
        endpoint: endpointUrl,
        method: endpointMethod,
      });
      setEndpointResult(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setEndpointError(error.errors[0]?.message || "Validation error");
      } else {
        setEndpointError(
          error instanceof Error ? error.message : "Unknown error",
        );
      }
    }
  };

  // List files function (Tauri environment)
  const handleListFiles = async () => {
    try {
      setFileError(null);
      const result = await listFiles({ path: filePath });
      setFileResult(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setFileError(error.errors[0]?.message || "Validation error");
      } else {
        setFileError(error instanceof Error ? error.message : "Unknown error");
      }
    }
  };

  // System info function
  const handleGetSystemInfo = async () => {
    try {
      setSystemInfo(null);
      const result = await getSystemInfo();
      setSystemInfo(result);
    } catch (error) {
      console.error("Failed to get system info:", error);
      setSystemInfo({
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      });
    }
  };

  return (
    <div className="mx-auto mt-8 flex w-full max-w-4xl flex-col gap-8 text-left">
      {/* Greet Section */}
      <div className="rounded-xl border border-input bg-card p-6">
        <h3 className="mb-4 text-lg font-semibold">Greet Function</h3>
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (greetName.trim()) handleGreet();
          }}
        >
          <Input
            className="flex-1"
            onChange={(e) => setGreetName(e.target.value)}
            placeholder="Enter your name..."
            value={greetName}
          />
          <Button disabled={!greetName.trim()} type="submit">
            Greet
          </Button>
        </form>
        {greetError && (
          <p className="mt-2 text-sm text-red-600">{greetError}</p>
        )}
        {greetResult && (
          <div className="mt-4 rounded-lg bg-green-50 p-3">
            <pre className="text-sm">
              {JSON.stringify(greetResult, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Double Number Section */}
      <div className="rounded-xl border border-input bg-card p-6">
        <h3 className="mb-4 text-lg font-semibold">
          Double Number by 2 Function
        </h3>
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (numberValue.trim()) handleDoubleNumber();
          }}
        >
          <Input
            className="flex-1"
            onChange={(e) => setNumberValue(e.target.value)}
            placeholder="Enter a number..."
            type="number"
            value={numberValue}
          />
          <Button disabled={!numberValue.trim()} type="submit">
            Double
          </Button>
        </form>
        {doubleError && (
          <p className="mt-2 text-sm text-red-600">{doubleError}</p>
        )}
        {doubleResult && (
          <div className="mt-4 rounded-lg bg-blue-50 p-3">
            <pre className="text-sm">
              {JSON.stringify(doubleResult, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Test Endpoint Section - Available in Bun environment */}
      {isBunEnv && (
        <div className="rounded-xl border border-input bg-card p-6">
          <h3 className="mb-4 text-lg font-semibold">Test Endpoint Function</h3>
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (endpointUrl.trim()) handleTestEndpoint();
            }}
          >
            <Select
              onValueChange={(value: any) => setEndpointMethod(value)}
              value={endpointMethod}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GET">GET</SelectItem>
                <SelectItem value="POST">POST</SelectItem>
                <SelectItem value="PUT">PUT</SelectItem>
                <SelectItem value="DELETE">DELETE</SelectItem>
                <SelectItem value="PATCH">PATCH</SelectItem>
              </SelectContent>
            </Select>
            <Input
              className="flex-1"
              onChange={(e) => setEndpointUrl(e.target.value)}
              placeholder="https://api.example.com/endpoint"
              value={endpointUrl}
            />
            <Button disabled={!endpointUrl.trim()} type="submit">
              Test
            </Button>
          </form>
          {endpointError && (
            <p className="mt-2 text-sm text-red-600">{endpointError}</p>
          )}
          {endpointResult && (
            <div className="mt-4 rounded-lg bg-purple-50 p-3">
              <pre className="text-sm">
                {JSON.stringify(endpointResult, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* List Files Section - Available in Tauri environment */}
      {isTauriEnv && (
        <div className="rounded-xl border border-input bg-card p-6">
          <h3 className="mb-4 text-lg font-semibold">List Files Function</h3>
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (filePath.trim()) handleListFiles();
            }}
          >
            <Input
              className="flex-1"
              onChange={(e) => setFilePath(e.target.value)}
              placeholder="Enter a directory path..."
              value={filePath}
            />
            <Button disabled={!filePath.trim()} type="submit">
              List Files
            </Button>
          </form>
          {fileError && (
            <p className="mt-2 text-sm text-red-600">{fileError}</p>
          )}
          {fileResult && (
            <div className="mt-4 rounded-lg bg-purple-50 p-3">
              <pre className="text-sm">
                {JSON.stringify(fileResult, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* System Info Section */}
      <div className="rounded-xl border border-input bg-card p-6">
        <h3 className="mb-4 text-lg font-semibold">System Information</h3>
        <div className="flex gap-2">
          <Button onClick={handleGetSystemInfo} variant="outline">
            Get System Info
          </Button>
        </div>
        {systemInfo && (
          <div className="mt-4">
            <div className="rounded-lg bg-yellow-50 p-3">
              <h4 className="mb-2 font-medium">System Info:</h4>
              <pre className="text-sm">
                {JSON.stringify(systemInfo, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
