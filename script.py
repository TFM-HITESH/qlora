# ==========================================
# Extended Visualization: Entropy-Aware QLoRA
# ==========================================
import matplotlib.pyplot as plt
import numpy as np

plt.style.use("seaborn-v0_8-muted")

# -----------------------------
# Simulated training data
# -----------------------------
epochs = np.arange(1, 11)

loss_full = np.exp(-epochs/3.5) * 0.7 + 0.25
loss_lora = np.exp(-epochs/3.3) * 0.75 + 0.28
loss_qlora = np.exp(-epochs/3.1) * 0.78 + 0.30
loss_entropy = np.exp(-epochs/3.7) * 0.70 + 0.23

wer_full = 8.2 - 0.04*epochs
wer_lora = 8.6 - 0.05*epochs
wer_qlora = 8.7 - 0.06*epochs
wer_entropy = 8.3 - 0.07*epochs

methods = ["Full Fine-Tuning", "LoRA", "QLoRA", "Entropy-Aware QLoRA"]
final_wer = [7.8, 8.0, 8.1, 7.7]
train_time = [6.4, 4.2, 3.9, 3.7]
energy = [1.35, 0.88, 0.74, 0.68]
gpu_mem = [10.1, 4.8, 3.2, 3.1]
efficiency_score = [0.45, 0.68, 0.82, 0.90]  # scaled synthetic metric

# -----------------------------
# 1. Training Loss Convergence
# -----------------------------
plt.figure(figsize=(8, 5))
plt.plot(epochs, loss_full, label="Full Fine-Tuning", linewidth=2.2)
plt.plot(epochs, loss_lora, label="LoRA", linewidth=2.2)
plt.plot(epochs, loss_qlora, label="QLoRA", linewidth=2.2)
plt.plot(epochs, loss_entropy, label="Entropy-Aware QLoRA", linewidth=2.2)
plt.xlabel("Epoch", fontsize=12)
plt.ylabel("Training Loss", fontsize=12)
plt.title("Training Loss Convergence", fontsize=13, weight='bold')
plt.grid(True, linestyle='--', alpha=0.6)
plt.legend()
plt.tight_layout()
plt.savefig("training_loss_convergence.png", dpi=300)
plt.show()

# -----------------------------
# 2. Validation WER per Epoch
# -----------------------------
plt.figure(figsize=(8, 5))
plt.plot(epochs, wer_full, marker='o', label="Full Fine-Tuning")
plt.plot(epochs, wer_lora, marker='s', label="LoRA")
plt.plot(epochs, wer_qlora, marker='^', label="QLoRA")
plt.plot(epochs, wer_entropy, marker='D', label="Entropy-Aware QLoRA")
plt.xlabel("Epoch", fontsize=12)
plt.ylabel("Validation WER (%)", fontsize=12)
plt.title("Validation WER Across Training Epochs", fontsize=13, weight='bold')
plt.grid(True, linestyle='--', alpha=0.6)
plt.legend()
plt.tight_layout()
plt.savefig("validation_wer_epochs.png", dpi=300)
plt.show()

# -----------------------------
# 3. Accuracy vs Training Time
# -----------------------------
plt.figure(figsize=(7, 5))
plt.scatter(train_time, final_wer, color=['#cc0000','#e69138','#6aa84f','#3d85c6'], s=120)
for i, txt in enumerate(methods):
    plt.annotate(txt, (train_time[i]+0.05, final_wer[i]-0.03), fontsize=10)
plt.xlabel("Training Time (hrs)", fontsize=12)
plt.ylabel("Final WER (%)", fontsize=12)
plt.title("Trade-off Between Training Time and Accuracy", fontsize=13, weight='bold')
plt.grid(True, linestyle='--', alpha=0.6)
plt.tight_layout()
plt.savefig("accuracy_vs_trainingtime.png", dpi=300)
plt.show()

# -----------------------------
# 4. Efficiency Radar Chart
# -----------------------------
import math
labels = np.array(["WER (↓)", "GPU Memory (↓)", "Energy (↓)", "Training Time (↓)", "Efficiency (↑)"])
num_vars = len(labels)
angles = np.linspace(0, 2 * np.pi, num_vars, endpoint=False).tolist()
angles += angles[:1]

def create_radar(values, label, color):
    values = values + values[:1]
    plt.polar(angles, values, label=label, color=color, linewidth=2.5)
    plt.fill(angles, values, color=color, alpha=0.25)

plt.figure(figsize=(7,7))
create_radar([0.5,0.0,0.0,0.0,0.3], "Full Fine-Tuning", "#cc0000")
create_radar([0.7,0.55,0.35,0.45,0.6], "LoRA", "#e69138")
create_radar([0.75,0.70,0.55,0.55,0.8], "QLoRA", "#6aa84f")
create_radar([0.85,0.75,0.65,0.60,0.9], "Entropy-Aware QLoRA", "#3d85c6")
plt.xticks(angles[:-1], labels, fontsize=11)
plt.title("Multi-Metric Efficiency Comparison", fontsize=13, weight='bold', pad=20)
plt.legend(loc='upper right', bbox_to_anchor=(1.3, 1.0))
plt.tight_layout()
plt.savefig("efficiency_radar.png", dpi=300)
plt.show()

# -----------------------------
# 5. WER Improvement Over Epochs
# -----------------------------
plt.figure(figsize=(8, 5))
improvement_entropy = 8.3 - wer_entropy
plt.plot(epochs, improvement_entropy, color="#3d85c6", marker='o', linewidth=2.5)
plt.xlabel("Epoch", fontsize=12)
plt.ylabel("WER Improvement (Δ%)", fontsize=12)
plt.title("Progressive WER Improvement: Entropy-Aware QLoRA", fontsize=13, weight='bold')
plt.grid(True, linestyle='--', alpha=0.6)
plt.tight_layout()
plt.savefig("wer_improvement_trend.png", dpi=300)
plt.show()
