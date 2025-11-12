# Project Context and Instructions for AI Agent

## 1. Project Overview

This project, titled "Less Is More: Toward Scalable and Efficient Multimodal Learning with QLoRA," is a college-level endeavor focused on developing an orchestration service for fine-tuning large audio-text models using Quantized Low-Rank Adaptation (QLoRA). The primary goal is to achieve significant memory and computational efficiency gains during fine-tuning while maintaining or improving task performance. Reliability, simplicity, and an "industry-grade" professional appearance are paramount.

**Key Objectives:**
-   Apply and extend QLoRA to audio-text models.
-   Develop novel QLoRA extensions: Temporal-Aware QLoRA and Cross-Modality Rank Allocation.
-   Implement Quantization-Aware Signal Selection.
-   Provide a user-friendly web interface for managing datasets, models, and training jobs.
-   Benchmark performance, memory usage, and training efficiency.

## 2. Current State of Deliverables (`/deliverables` directory)

The following documents have been generated and are located in the `/deliverables` directory. They serve as the foundational specifications and guides for the project:

-   **`FRONTEND.md`**: Details the specification for the frontend UI, including core features, user flow, and the chosen technology stack (Next.js, Tailwind CSS, Shadcn/ui, Aceternity UI, TypeScript).
-   **`NOTEBOOK.md`**: Provides a basic guide, pseudocode, and conceptual code for implementing QLoRA on audio models, incorporating advanced considerations like temporal-aware QLoRA and cross-modality rank allocation.
-   **`METRICS.md`**: Outlines the pipeline for collecting and evaluating key performance and efficiency metrics (e.g., BLEU, CIDEr, Recall@K, VRAM, training time) for the QLoRA-enabled models.
-   **`SPEC.md`**: Defines the API specification for the FastAPI backend, covering user authentication, dataset management (with S3 upload process), allowed model listing, and training orchestration. It explicitly states that users cannot register new models; only pre-defined models are available.
-   **`RESEARCH.md`**: A research-oriented document covering the literature review, identified research gaps, project objectives, and problem statement, aligning with academic submission requirements.
-   **`SOFTWARE.md`**: A comprehensive software-oriented document detailing the System Requirements Specification (SRS), System Design Specification (SDS), architectural overview, component breakdown, and various UML diagrams (Architecture, Class, Sequence, Use Case, ER).
-   **`PRESENTATION.md`**: An outline for a project presentation, covering all key aspects from introduction to module design and implementation.

## 3. Technical Specifications

### 3.1. Frontend
-   **Framework:** Next.js
-   **Styling:** Tailwind CSS
-   **Component Library:** Shadcn/ui
-   **Animation/Effects:** Aceternity UI
-   **Language:** TypeScript

### 3.2. Backend
-   **Framework:** FastAPI (Python)
-   **Database:** PostgreSQL (for structured data: users, datasets, models, training jobs metadata)
-   **Job Queuing:** Celery/RabbitMQ
-   **Container Orchestration:** Docker/Kubernetes (conceptual for training workers)

### 3.3. Core QLoRA Implementation
-   **Libraries:** PyTorch, `bitsandbytes`, `peft` (Hugging Face)
-   **Deployment Target:** NVIDIA Jetson Nano container emulator (proof of concept), scalable to VMs.

### 3.4. Data Handling
-   **Dataset Storage:** User-uploaded datasets are stored in a dedicated S3 bucket. Each dataset resides in a unique folder identified by its `dataset_id` (`s3://[your-bucket-name]/datasets/{dataset_id}/`).
-   **Model Storage:** Pre-defined models are stored in S3 (`s3://[your-bucket-name]/models/{model_id}/`).
-   **Dataset Upload Process:** Involves initiating an upload to get a pre-signed S3 URL, followed by a client-to-S3 upload, and then completing the upload via an API call to notify the backend.

## 4. Research Context and Novel Contributions

This project aims to contribute novel research in the application of QLoRA to audio-text models. Key research areas include:
-   **Temporal-Aware QLoRA:** Designing dynamic adapters whose rank or scaling is conditioned on temporal properties of the audio (e.g., speech activity, speaker change detection).
-   **Cross-Modality Rank Allocation:** Assigning different LoRA ranks (`r`) to audio encoder, text decoder, and cross-modal fusion components based on their importance or information density.
-   **Quantization-Aware Signal Selection:** Developing a lightweight mechanism to select a subset of audio signals or segments for processing based on their information content, optimizing computational load.

## 5. System Architecture

The system adopts a microservices-oriented architecture, comprising:
-   **Frontend UI:** Web-based interface.
-   **Backend API Gateway:** Central entry point for all API requests.
-   **Authentication Service:** Handles user authentication.
-   **Database Service:** Persistent storage (PostgreSQL).
-   **Training Orchestration Service:** Manages training job lifecycle.
-   **Training Workers/Containers:** Execute QLoRA fine-tuning.
-   **Model/Dataset Storage:** S3 for raw data and models.
-   **Monitoring/Logging Service:** Aggregates logs and metrics.

## 6. Data Models (Key Entities)

-   **User:** `id`, `username`, `email`, `password_hash`, `roles`.
-   **Dataset:** `id`, `name`, `description`, `s3_path`, `status`, `owner_id`, `created_at`.
    -   *Note:* `owner_id` links to `User`.
-   **Model:** `id`, `name`, `description`, `model_type` (e.g., `speech_to_text`, `audio_classification`), `base_architecture` (e.g., `whisper`, `conformer`), `version`.
    -   *Note:* These are pre-defined/allowed models, not user-registered. No `owner_id` for models.
-   **TrainingJob:** `id`, `model_id`, `dataset_id`, `training_params` (JSONB), `status`, `progress`, `owner_id`, `started_at`, `completed_at`, `logs_path`, `results_path`.
    -   *Note:* `model_id` and `dataset_id` link to `Model` and `Dataset` respectively. `owner_id` links to `User`.

## 7. API Specification Highlights

-   **Authentication:** Standard login/signup, JWT-based authentication.
-   **Dataset Management:** Endpoints for initiating (getting S3 pre-signed URL) and completing uploads, listing, viewing, and deleting datasets. Datasets are user-owned.
-   **Model Management:** Only `GET` endpoints for retrieving a list of *allowed* models and their details. No `POST` or `DELETE` for models by users.
-   **Training Orchestration:** Endpoints for starting, listing, viewing status, and stopping training jobs. Training jobs are user-initiated and owned.

## 8. Important Considerations for Future Development

-   **Reliability and Simplicity:** Prioritize robust error handling and straightforward implementation.
-   **Industry-Grade Quality:** Maintain high standards for code quality, documentation, and user experience.
-   **Hardware Constraints:** Be mindful of the target deployment environment (Jetson Nano emulator) when designing and implementing training logic.
-   **Modularity:** Ensure components are loosely coupled for easier maintenance and future extensions.

This `CONTEXT.md` serves as a comprehensive guide for any subsequent AI agent or developer working on this project. All necessary details for understanding the project's scope, technical foundation, and current progress are encapsulated herein.
