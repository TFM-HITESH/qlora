"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { RefreshCcw, Play, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Job {
  id: string;
  model: string;
  dataset: string;
  progress: number; // 0-100
  status: "Running" | "Completed" | "Allocating";
  durationHours: number; // total planned hours
  elapsedSeconds: number; // seconds elapsed since start
  startedAt?: number; // timestamp
  completedAt?: number;
}

function nowTimestamp() {
  return new Date().toLocaleTimeString();
}

export default function Page() {
  const [jobs, setJobs] = useState<Job[]>([
    {
      id: "#TRN-871",
      model: "wav2vec",
      dataset: "librispeech-960",
      progress: 100,
      status: "Completed",
      durationHours: 4,
      elapsedSeconds: 3.7598 * 3600,
      startedAt: Date.now() - 4 * 3600 * 1000,
      completedAt: Date.now(),
    },
  ]);

  const [allocating, setAllocating] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [selectedDataset, setSelectedDataset] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const gpuRef = useRef(0);

  // Summary numbers derived
  const totalDatasets = 2;
  const activeModels = 2;
  const runningJobsCount = jobs.filter((j) => j.status === "Running").length;
  const completedJobsCount = jobs.filter(
    (j) => j.status === "Completed"
  ).length;

  // helper: push log with timestamp
  const pushLog = (text: string) => {
    setLogs((l) => [`[${nowTimestamp()}] ${text}`, ...l]);
  };

  useEffect(() => {
    // initialize with the completed job log
    pushLog(
      `Preloaded completed job ${jobs[0].id} (${jobs[0].model} @ ${jobs[0].dataset})`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Allocation -> start job
  const allocateAndStart = (model: string, dataset: string) => {
    setSelectedModel(model);
    setSelectedDataset(dataset);
    pushLog(`Selected model: ${model}`);
    pushLog(`Selected dataset: ${dataset}`);

    setAllocating(true);
    pushLog("Allocating Cloud Resources...");
    const allocationMs = Math.floor(Math.random() * 10000) + 20000; // 20-30s

    // create a temporary allocating job to show status (optional)
    const tempId = `#TRN-${Math.floor(Math.random() * 900 + 100)}`;
    const allocatingJob: Job = {
      id: tempId,
      model,
      dataset,
      progress: 0,
      status: "Allocating",
      durationHours: Math.floor(Math.random() * 3) + 3, // 3-5 hours
      elapsedSeconds: 0,
      startedAt: Date.now(),
    };

    setJobs((prev) => [...prev, allocatingJob]);

    setTimeout(() => {
      // change Allocating -> Running and log
      setJobs((prev) =>
        prev.map((j) =>
          j.id === tempId
            ? { ...j, status: "Running", startedAt: Date.now() }
            : j
        )
      );
      pushLog(`Started run ${tempId} (${model} on ${dataset})`);
      setAllocating(false);
    }, allocationMs);
  };

  // Tick every second: update elapsed, progress, gpu
  useEffect(() => {
    const t = setInterval(() => {
      setJobs((prev) => {
        const updated = prev.map((job): Job => {
          if (job.status === "Running") {
            const elapsed = (job.elapsedSeconds || 0) + 1;
            const totalSeconds = Math.max(
              1,
              Math.floor(job.durationHours * 3600)
            );
            const progress = Math.min(100, (elapsed / totalSeconds) * 100);
            if (progress >= 100) {
              pushLog(`Completed run ${job.id}`);
              return {
                ...job,
                elapsedSeconds: totalSeconds,
                progress: 100,
                status: "Completed",
                completedAt: Date.now(),
              };
            }
            return { ...job, elapsedSeconds: elapsed, progress };
          }
          return job;
        });
        return updated;
      });

      // GPU utilization calculation
      const running = jobs.filter((j) => j.status === "Running").length;
      let gpu = 0;
      for (let i = 0; i < running; i++) {
        const contribution = 20 + (Math.random() * 10 - 5); // 20% +-5%
        gpu += contribution;
      }
      gpu = Math.min(100, gpu);
      gpuRef.current = Math.round(gpu);
    }, 1000);

    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobs]);

  // helper to format elapsed hh:mm:ss
  const formatElapsed = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, "0");
    const m = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const s = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  return (
    <div className="flex h-screen bg-[#0d1117] text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-[#161b22] flex flex-col p-4">
        <h2 className="text-lg font-bold mb-4">QLoRA Orchestration</h2>
        <ul className="space-y-2">
          <li className="p-2 rounded bg-[#21262d]">Dashboard</li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6">
        <h1 className="text-2xl font-bold mb-2">Dashboard Overview</h1>

        {/* Selected info */}
        <div className="mb-4 text-sm text-gray-300">
          Selected Model:{" "}
          <span className="text-white font-medium">{selectedModel ?? "—"}</span>{" "}
          | Selected Dataset:{" "}
          <span className="text-white font-medium">
            {selectedDataset ?? "—"}
          </span>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Datasets", value: totalDatasets },
            { label: "Active Models", value: activeModels },
            { label: "Running Jobs", value: runningJobsCount },
            { label: "Completed Jobs", value: completedJobsCount },
          ].map((item, idx) => (
            <Card key={idx} className="bg-[#161b22] border-none text-center">
              <CardHeader>
                <CardTitle className="text-gray-400 text-sm">
                  {item.label}
                </CardTitle>
                <p className="text-2xl font-bold text-white">{item.value}</p>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Quick Actions / Recent Activity / System Status */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card className="bg-[#161b22] border-none">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="secondary"
                    className="w-full bg-[#21262d] hover:bg-[#30363d] text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Add Dataset
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-[#161b22] text-white border-none">
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedDataset("librispeech-100");
                      pushLog("Chose dataset librispeech-100");
                    }}
                  >
                    {"Librispeech-100"}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedDataset("librispeech-960");
                      pushLog("Chose dataset librispeech-960");
                    }}
                  >
                    {"Librispeech-960"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="secondary"
                    className="w-full bg-[#21262d] hover:bg-[#30363d] text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" /> New Model
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-[#161b22] text-white border-none">
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedModel("wav2vec");
                      pushLog("Chose model wav2vec");
                    }}
                  >
                    {"wav2vec"}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedModel("openwhisper");
                      pushLog("Chose model openwhisper");
                    }}
                  >
                    {"openwhisper"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                onClick={() => {
                  if (!selectedModel || !selectedDataset) {
                    pushLog("Please select model and dataset before starting");
                    return;
                  }
                  pushLog("Allocating Cloud Resources");
                  allocateAndStart(selectedModel, selectedDataset);
                }}
                disabled={allocating}
                className="w-full bg-[#238636] hover:bg-[#2ea043] text-white"
              >
                {allocating ? (
                  "Allocating Cloud Resources..."
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" /> Start Training
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-[#161b22] border-none">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="font-mono text-xs text-green-300 h-48 overflow-auto bg-black/20 p-2 rounded">
                {logs.map((l, i) => (
                  <div key={i}>{l}</div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#161b22] border-none">
            <CardHeader>
              <CardTitle>System Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-gray-300 mb-1">GPU Utilization</p>
                <Progress value={gpuRef.current} className="h-2 bg-gray-700" />
                <p className="text-gray-400 text-xs mt-1">{gpuRef.current}%</p>
              </div>
              <div>
                <p className="text-gray-300 mb-1">Storage Used</p>
                <Progress value={(2.4 / 5) * 100} className="h-2 bg-gray-700" />
                <p className="text-gray-400 text-xs mt-1">2.4TB / 5TB</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Training Jobs */}
        <Card className="bg-[#161b22] border-none">
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>Active Training Jobs</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-white"
            >
              <RefreshCcw className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <table className="w-full text-left text-sm text-gray-300">
              <thead>
                <tr className="border-b border-gray-700 text-gray-400">
                  <th className="p-2">Job ID</th>
                  <th className="p-2">Model</th>
                  <th className="p-2">Dataset</th>
                  <th className="p-2">Progress</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Estimated Duration</th>
                  <th className="p-2">Elapsed</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job, i) => (
                  <tr
                    key={i}
                    className="border-b border-gray-800 hover:bg-[#21262d]"
                  >
                    <td className="p-2">{job.id}</td>
                    <td className="p-2">{job.model}</td>
                    <td className="p-2">{job.dataset}</td>
                    <td className="p-2 w-1/3">
                      <Progress
                        value={Math.round(job.progress)}
                        className="h-2 bg-gray-700"
                      />
                    </td>
                    <td className="p-2">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          job.status === "Running"
                            ? "bg-green-700/30 text-green-400"
                            : job.status === "Allocating"
                            ? "bg-blue-700/30 text-blue-300"
                            : "bg-gray-700/30 text-gray-300"
                        }`}
                      >
                        {job.status}
                      </span>
                    </td>
                    <td className="p-2">{job.durationHours} hours</td>
                    <td className="p-2">
                      {formatElapsed(job.elapsedSeconds || 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
