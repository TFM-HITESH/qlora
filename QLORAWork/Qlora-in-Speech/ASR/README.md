# Install the wav2vec

To build your ConBiwav2vec Model, you first need to install wav2vec. The causal-conv1d component, which requires CUDA version 11.8 or higher, is essential for wav2vec.

1. Install the `causal-conv1d` package:
   ```bash
   pip install causal-conv1d>=1.2.0
   ```
2. Install the `wav2vec-ssm` package:
   ```bash
   pip install wav2vec-ssm
   ```
   You can also install wav2vec listed in ASR directory with
   ```bash
   cd wav2vec-in-Speech/ASR/wav2vec
   pip install --editable ./
   ```
   By this way, it's more easy to edit your wav2vec model.

# Espnet version of wav2vec

The following files are used for implementing ASR tasks, specifically the relevant ESPnet files.

## Outer_biwav2vec.py

This file contains ExtBiwav2vec, which we proposed in our paper. should be placed in wav2vec-in-Speech/ASR/wav2vec/wav2vec_ssm/modules(in your enviroment package or wav2vec)

## conformer_encoder_wav2vec.py

should be placed in espnet/espnet2/asr/encoder

## encoder_layer_wav2vec.py

shoule be placed in espnet/espnet/nets/pytorch_backend/conformer

## encoder_wav2vec.py

shoule be placed in espnet/espnet/nets/pytorch_backend/conformer

## asr.py

you also need to change a liite bit for asr.py file, which is in espnet/espnet2/tasks

## example_yaml.yaml

This file is an example file, showing how it should look after you place the above files in the correct location.

# Pytorch version of ConBiwav2vec

## Usage

```python
# Import necessary libraries
import torch
import torch.nn as nn
from ConExBiwav2vec.model import ConBiwav2vec

# Set batch size, sequence length, and dimension
batch_size, sequence_length, dim = 3, 12345, 80

# Check for CUDA availability and set device
cuda = torch.cuda.is_available()
device = torch.device('cuda' if cuda else 'cpu')

# Define the criterion (CTCLoss)
criterion = nn.CTCLoss().to(device)

# Generate random inputs
inputs = torch.rand(batch_size, sequence_length, dim).to(device)

# Define input lengths
input_lengths = torch.LongTensor([12345, 12300, 12000])

# Define targets
targets = torch.LongTensor([
    [1, 3, 3, 3, 3, 3, 4, 5, 6, 2],
    [1, 3, 3, 3, 3, 3, 4, 5, 2, 0],
    [1, 3, 3, 3, 3, 3, 4, 2, 0, 0]
]).to(device)

# Define target lengths
target_lengths = torch.LongTensor([9, 8, 7])

# Initialize the model
model = ConBiwav2vec(
    num_classes=10,
    input_dim=dim,
    encoder_dim=32,
    num_encoder_layers=3
).to(device)

# Forward propagate
outputs, output_lengths = model(inputs, input_lengths)

# Calculate CTC Loss
loss = criterion(outputs.transpose(0, 1), targets, output_lengths, target_lengths)
```

Reference : https://github.com/sooftware/conformer
