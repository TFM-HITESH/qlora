# Training Strategy and Performance Metrics

This document outlines the **ML training strategy** for the Audio QLoRA fine-tuning framework, including the dataset processing pipeline, training loop design, and performance metrics (accuracy + efficiency) to be tracked for evaluating the research contribution.

---

## 1. Training Strategy

### 1.1 Dataset Preprocessing

The dataset consists of paired `(audio, text)` sequences. Audio is processed into acoustic features (e.g., mel-spectrograms, MFCCs), while text is tokenized using a SentencePiece or BPE tokenizer.

1. **Audio Preprocessing**:

   - Convert raw waveform \( x(t) \) into a log-Mel spectrogram:
     \[
     S(f, t) = \log \big( \text{Mel}(\text{STFT}(x(t))) \big)
     \]
   - Normalize spectrograms to zero mean and unit variance per dataset.
   - Apply SpecAugment for robustness (time warping, frequency/time masking).

2. **Text Preprocessing**:

   - Apply subword tokenization.
   - Add BOS (beginning-of-sequence) and EOS (end-of-sequence) tokens.
   - Pad or truncate sequences to a maximum length \( L \).

3. **Batch Formation**:
   - Dynamic padding for variable sequence lengths.
   - Bucketing by length to minimize padding overhead.
   - Each batch \( B = \{(S*i, y_i)\}*{i=1}^N \).

---

### 1.2 Model Architecture

The model uses a **pretrained audio encoder** (e.g., Conformer or Wav2Vec2) connected to a **decoder** for text generation, adapted with **Entropy-Aware QLoRA**:

- **Quantization-Aware LoRA Layers**:  
  Low-rank adapters are inserted at transformer attention and feed-forward layers.
- **Entropy-Based Rank Allocation**:  
  Regions with lower entropy in activations are assigned lower rank \( r \), while higher-entropy regions get higher rank.

---

### 1.3 Training Loop

#### Forward Pass

1. Encode spectrogram \( S \) into latent representation \( h = \text{Encoder}(S) \).
2. Apply QLoRA adapters and quantization.
3. Decode into text logits \( \hat{y} \).

#### Loss Function

- **Cross-Entropy Loss**:
  \[
  \mathcal{L}_{CE} = - \frac{1}{N} \sum_{i=1}^N \sum*{t=1}^{T_i} y*{i,t} \cdot \log \hat{y}\_{i,t}
  \]
- **Optional Entropy Regularization** (to enforce meaningful rank allocation):
  \[
  \mathcal{L}_{total} = \mathcal{L}_{CE} + \lambda \cdot \mathcal{H}(W\_{LoRA})
  \]

where \( \mathcal{H} \) is entropy of the adapter weights.

#### Pseudocode

```python
for epoch in range(num_epochs):
    for batch in dataloader:
        audio, text = batch

        # Preprocess
        S = audio_to_melspectrogram(audio)
        tokens = tokenize(text)

        # Forward
        logits = model(S)
        loss = cross_entropy_loss(logits, tokens)

        # Backward
        loss.backward()
        optimizer.step()
        optimizer.zero_grad()

        # Monitor metrics
        log_metrics(loss, logits, tokens)
```

---

### 1.4 Optimization Details

- Optimizer: AdamW
- Learning rate schedule: Linear warmup + cosine decay
- Mixed precision training for memory efficiency
- Gradient clipping at $||g||_2 = 1.0$

---

## 2. Metrics to Monitor

### 2.1 Accuracy-Oriented Metrics

- **WER (Word Error Rate)**:

  $$
  \text{WER} = \frac{S + D + I}{N}
  $$

  where $S$=substitutions, $D$=deletions, $I$=insertions, $N$=reference words.

- **CER (Character Error Rate)**: Same as WER but computed at character level.

- **BLEU Score** (for text similarity):

  $$
  BLEU = BP \cdot \exp \left( \sum_{n=1}^N w_n \log p_n \right)
  $$

- **Perplexity**:

  $$
  PPL = \exp \left( \frac{1}{T} \sum_{t=1}^T -\log p(y_t | y_{<t}, S) \right)
  $$

---

### 2.2 Efficiency-Oriented Metrics

- **Training Throughput**: Samples processed per second (sps).

- **Latency**: Time per inference step.

- **GPU Memory Usage**: Peak memory used during training (MB).

- **Compression Ratio**:

  $$
  CR = \frac{\text{Original Parameters}}{\text{Parameters after QLoRA}}
  $$

- **Energy Efficiency (optional, Jetson Nano focus)**:
  Joules per training step, monitored via onboard sensors.

---

### 2.3 Research-Specific Metrics

- **Entropy Distribution Tracking**: Monitor entropy of activations to validate entropy-aware rank allocation.
- **Rank Allocation Heatmaps**: Visualize how low-rank adapters are distributed across layers.
- **Ablation Studies**: Compare standard QLoRA vs. Entropy-Aware QLoRA.

---

## 3. Expected Outcomes

- Improved **accuracy** (lower WER, higher BLEU) compared to baseline QLoRA.
- Reduced **memory footprint** and improved **training throughput**.
- Demonstration of **research novelty** via entropy-aware rank allocation.
